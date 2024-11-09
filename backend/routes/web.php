<?php

use App\Models\User;
use App\Models\VisualSetting;
use App\Services\Content;
use App\Services\Visual;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
require_once('helpers.php');
if (!function_exists("render")) {
    function render(User $user, Request $request, bool $published, bool $preview, bool $devPreview = false)
    {
        $contentService = new Content($user);
        $visualService = new Visual($user);

        $visualSettings = $visualService->getUserSettings();
        if ($preview) {
            $layout = $request->input('layout') ?
                VisualSetting::resolveLayout(intval($request->input('layout'))) : $visualSettings->layout;
        } else {
            $layout = $visualSettings->layout;
        }
        $section = $request->input('section') ?? '';

        return view($layout, [
            'preview'       => $preview,
            'devPreview'    => $devPreview,
            'content'       => $contentService->render($published),
            'effectPreview' => !empty($request->input('effect')),
            'section'       => $section,
            'user'          => $user,
            'visual'        => $visualService->render($published, $request->input('effect')),
        ]);
    }
}

Route::get('/login', function () {
    if (env('APP_ENV') === 'local') {
        // This temporarily indicates a successful authentication
        return redirect('http://localhost:3000/login');
    }
    return file_get_contents(public_path('index.html'));
})->name('login');

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
                ? back()->with(['status' => __($status)])
                : back()->withErrors(['email' => __($status)]);
})->middleware('guest')->name('password.email');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/app', function (Request $request) {
        if ($request->expectsJson()) {
            return response('');
        }
        if (env('APP_ENV') === 'local') {
            // This temporarily indicates a successful authentication
            return redirect('http://localhost:3000/app');
        }
        return file_get_contents(public_path('index.html'));
    });

    Route::get('/render', function (Request $request) {
        $devPreview = !empty($request->input('devPreview'));
        return render(Auth::user(), $request, (boolean)$request->input('published'), true, $devPreview);
    });
    Route::get('/render/styles/visual.css', function (Request $request) {
        $visualService = new Visual(Auth::user());
        return response(view('styles', [
                'visual'  => $visualService->render((boolean)$request->input('published')),
            ]),
            200,
            ['content-type' => 'text/css']
        );
    });
});

Route::get('/render/{nickname}', function ($nickname = null, Request $request) {
    $user = User::where('nickname', $nickname)->first();

    if (!$user) {
        return response(view('404'), 404);
    }

    return render($user, $request, true, false);
});

Route::get('/render/{nickname}/visual.css', function ($nickname = null, Request $request) {
    $user = User::where('nickname', $nickname)->first();

    if (!$user) {
        return response(view('404'), 404);
    }

    $visualService = new Visual($user);
    return response(view('styles', [ 'visual'  => $visualService->render(true) ]), 200, ['content-type' => 'text/css']);
});

$handleRender = function ($nickname, Request $request) {
    $user = User::where('nickname', $nickname)
                ->where('nickname_prefix', '')
                ->first();

    if (!$user) {
        return file_get_contents(public_path('index.html'));
    }

    return render($user, $request, true, false);
};

$handlePrefixRender = function ($prefix, $nickname, Request $request) {
    $user = User::where('nickname', $nickname)
                ->where('nickname_prefix', $prefix)
                ->first();

    if (!$user) {
        return file_get_contents(public_path('index.html'));
    }

    return render($user, $request, true, false);
};

if (env('APP_ENV') !== 'local') {
    Route::get('/app/{any}', function () {
        return file_get_contents(public_path('index.html'));
    })->where('any', '.*');

    Route::get('/{nickname}', $handleRender)->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/@{nickname}', $handleRender)->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/{prefix}/{nickname}', $handlePrefixRender)
        ->where('prefix', '^[a-zA-Z0-9-_]{1,30}$')
        ->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/{prefix}/@{nickname}', $handlePrefixRender)
        ->where('prefix', '^[a-zA-Z0-9-_]{1,30}$')
        ->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');

    Route::get('/{any}', function () {
        return file_get_contents(public_path('index.html'));
    })->where('any', '.*');
} else {
    Route::get('/{nickname}', $handleRender)->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/@{nickname}', $handleRender)->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/{prefix}/{nickname}', $handlePrefixRender)
        ->where('prefix', '^[a-zA-Z0-9-_]{1,30}$')
        ->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
    Route::get('/{prefix}/@{nickname}', $handlePrefixRender)
        ->where('prefix', '^[a-zA-Z0-9-_]{1,30}$')
        ->where('nickname', '^[a-zA-Z0-9-_]{1,30}$');
}
