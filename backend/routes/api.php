<?php

use App\Models\User;
use App\Models\UserPreference;
use App\Services\Content;
use App\Services\Metadata;
use App\Services\Settings;
use App\Services\Visual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/homepage/featured', function () {
    $featuredUser = User::join('user_preferences', 'users.id', '=', 'user_preferences.user_id')
        ->where('feature_homepage', true)
        ->inRandomOrder()
        ->first();
    return response($featuredUser ? $featuredUser->nickname : '');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json([
            'data' => $request->user(),
        ]);
    });
    Route::post('/user/skip-setup', function () {
        UserPreference::skipSetup(Auth::user());
    });
    Route::post('/user/set-theme', function (Request $request) {
        UserPreference::setTheme(Auth::user(), $request->input('data'));
    });
    Route::post('/user/setup', function (Request $request) {
        $code = processMutation(function () use ($request) {
            UserPreference::updateInitialSetup(Auth::user(), $request->input('data'));
        });

        return response('', $code);
    });
    Route::post('/user/preferences', function (Request $request) {
        UserPreference::updatePreferences(Auth::user(), $request->input('data'));
    });
    Route::get('/content/basic', function (Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->getBasic(false),
        ]);
    });
    Route::post('/content/basic', function (Request $request, Content $contentService) {
        $code = processMutation(function () use ($request, $contentService) {
            $contentService->updateBasic($request->all());
        });

        return response('', $code);
    });
    Route::get('/content/links', function (Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->getLinks(false),
        ]);
    });
    Route::post('/content/links', function (Request $request, Content $contentService) {
        $code = processMutation(function () use ($request, $contentService) {
            $contentService->updateLinks($request->input('data'));
        });

        return response('', $code);
    });
    Route::post('/content/link/metadata', function (Request $request, Metadata $metadataService) {
        return response()->json([
            'data' => $metadataService->getURLMetadata($request->input('url')),
        ]);
    });
    Route::get('/content/posts', function (Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->getBlogPosts(),
        ]);
    });
    Route::get('/content/post/{id}', function (string $id, Content $contentService) {
        return response()->json([
            'data' => $contentService->getBlogPost(intval($id)),
        ]);
    });
    Route::post('/content/post', function (Request $request, Content $contentService) {
        $savedPost = NULL;
        $code = processMutation(function () use ($request, $contentService, &$savedPost) {
            $savedPost = $contentService->saveBlogPost($request->all());
        });

        return response()->json(['data' => $savedPost], $code);
    });
    Route::post('/content/post/upload', function (Request $request, Content $contentService) {
        $uploadedImage = NULL;
        $code = processMutation(function () use ($request, $contentService, &$uploadedImage) {
            $uploadedImage = $contentService->uploadPostImage($request->file('image'), $request->input('post_id'));
        });

        return response(['data' => $uploadedImage ? $uploadedImage->full_path : ''], $code);
    });
    Route::delete('/content/post/{id}', function (string $id, Content $contentService) {
        $code = processMutation(function () use ($id, $contentService) {
            $contentService->deleteBlogPost(intval($id));
        });

        return response('', $code);
    });
    Route::patch('/content/post/{id}/restore', function (string $id, Content $contentService) {
        $code = processMutation(function () use ($id, $contentService) {
            $contentService->restoreBlogPost(intval($id));
        });

        return response('', $code);
    });
    Route::delete('/content/posts/changes', function (Content $contentService) {
        $code = processMutation(function () use ($contentService) {
            $contentService->discardBlog();
        });

        return response('', $code);
    });
    Route::get('/content/photos', function (Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->getPhotos(),
        ]);
    });
    Route::delete('/content/photos/{position}', function (string $position, Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->removePhoto(intval($position)),
        ]);
    });
    Route::post('/content/photos', function (Request $request, Content $contentService) {
        return response()->json([
            'data' => $contentService->savePhotos($request),
        ]);
    });
    Route::get('/unpublished', function (Request $request, Content $contentService, Visual $visualService) {
        return response()->json([
            'data' => [
                'content' => $contentService->unpublishedContents(),
                'visual'  => $visualService->unpublishedContents(),
            ],
        ]);
    });
    Route::post('/changes/publish', function (Request $request, Content $contentService, Visual $visualService) {
        $contentService->publishChanges();
        $visualService->publishChanges();
        return response('', 200);
    });
    Route::post('/changes/discard', function (Request $request, Content $contentService, Visual $visualService) {
        $contentService->discardChanges();
        $visualService->discardChanges();
        return response('', 200);
    });
    Route::post('/settings/site', function (Request $request, Settings $settings) {
        $settings->updateSite($request->input('data'));
        return response('', 200);
    });
    Route::post('/settings/account', function (Request $request, Settings $settings) {
        $settings->updateAccount($request->input('data'));
        return response('', 200);
    });
    Route::get('/visual/settings', function (Request $request, Visual $visualService) {
        return response()->json([
            'data' => $visualService->getUserSettings(),
        ]);
    });
    Route::get('/visual/palettes', function (Request $request, Visual $visualService) {
        return response()->json([
            'data' => $visualService->getPalettes(),
        ]);
    });
    Route::post('/visual', function (Request $request, Visual $visualService) {
        $code = processMutation(function () use ($request, $visualService) {
            $visualService->saveVisualSettings($request->input('data'));
        });

        return response('', $code);
    });
    Route::post('/visual/palette/create', function (Request $request, Visual $visualService) {
        try {
            $palette = $visualService->createPalette($request->input('data'));
        } catch (Exception $e) {
            if ($e instanceof App\Services\MutationException) {
                $code = $e->getCode();
                return response('', $code);
            }
        }

        return response()->json([ 'data' => $palette ]);
    });
    Route::delete('/visual/palette/{id}', function (string $id, Visual $visualService) {
        $code = processMutation(function () use ($id, $visualService) {
            $visualService->deletePalette(intval($id));
        });

        return response('', $code);
    });
    Route::put('/visual/palette/', function (Request $request, Visual $visualService) {
        $code = processMutation(function () use ($request, $visualService) {
            $visualService->updatePalette($request->input('data'));
        });

        return response('', $code);
    });
    Route::get('/visual/palette/{id}', function (string $id, Visual $visualService) {
        $palette = $visualService->getPalette(intval($id));

        return response()->json([
            'data' => $palette,
        ]);
    });
    Route::get('/visual/palette/preview/{id}', function (string $id, Visual $visualService) {
        $palette = $visualService->getPalettePreview(intval($id));
        if ($palette) {
            return view('palette', [
                'palette' => $palette->toArray(),
            ]);
        } else {
            return response('', 404);
        }
    });
    Route::get('/visual/fonts', function (Request $request, Visual $visualService) {
        return response()->json([
            'data' => $visualService->getFonts(),
        ]);
    });
    Route::post('/visual/font/create', function (Request $request, Visual $visualService) {
        try {
            $font = $visualService->createType($request->input('data'));
        } catch (Exception $e) {
            if ($e instanceof App\Services\MutationException) {
                $code = $e->getCode();
                return response('', $code);
            }
            Bugsnag::notifyException($e);
            return response()->json([ 'data' => NULL ]);
        }

        return response()->json([ 'data' => $font ]);
    });
    Route::delete('/visual/font/{id}', function (string $id, Visual $visualService) {
        $code = processMutation(function () use ($id, $visualService) {
            $visualService->deleteType(intval($id));
        });

        return response('', $code);
    });
    Route::put('/visual/font/', function (Request $request, Visual $visualService) {
        $code = processMutation(function () use ($request, $visualService) {
            $visualService->updateType($request->input('data'));
        });

        return response('', $code);
    });
    Route::get('/visual/font/{id}', function (string $id, Visual $visualService) {
        $palette = $visualService->getType(intval($id));

        return response()->json([
            'data' => $palette,
        ]);
    });
    Route::get('/visual/font/preview/{id}', function (string $id, Visual $visualService) {
        $font = $visualService->getTypePreview(intval($id));
        if ($font) {
            return view('fonts', [
                'fonts' => $font->render(),
            ]);
        } else {
            return response('', 404);
        }
    });
});

if (!function_exists("processMutation")) {
    function processMutation(callable $mutation): int {
        try {
            $mutation();
        } catch (Exception $e) {
            if ($e instanceof App\Services\MutationException) {
                return $e->getCode();
            }
            throw $e;
        }

        return 200;
    }
}
