<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Storage;
use Validator;

class BlogPost extends Base
{
    use HasFactory;

    public const VALIDATOR_RULES = [
        'title' => ['required', 'string'],
        'content' => ['required', 'string'],
    ];
    protected $table = 'blog_posts';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_id',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'content',
        'image'
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleted(function (BlogPost $post) {
            if ($post->image) {
                BlogPost::cleanUpImageIfUnused($post->image);
            }
        });
    }

    /**
     * Accessors and mutators
     */
    public function setImageAttribute($imageFile)
    {
        if (gettype($imageFile) === 'string') {
            $this->attributes['image'] = $imageFile;
            return;
        }

        if (!empty($this->attributes['image'])) {
            BlogPost::cleanUpImageIfUnused($this->attributes['image']);
        }

        $path = Storage::disk('images')->putFile('post', $imageFile);
        $this->attributes['image'] = $path;
    }

    /**
     * Methods
     */
    public static function saveBlogPost(User $user, array $data)
    {
        if (!Validator::make($data, self::VALIDATOR_RULES)->validate()) {
            return;
        }

        $post = self::findOrCreateFromData($user, $data);
        $post->published = false;
        $post->user_id = $user->id;
        $post->save();

        return $post;
    }

    public static function findOneFromUser(int $id, User $user)
    {
        return self::where('user_id', $user->id)
            ->where('id', $id)
            ->first();
    }

    public static function findOrCreateFromData(User $user, array $data)
    {
        // New unpublished post
        if (!isset($data['id'])) {
            return new BlogPost($data);
        }

        // New unpublished post from published post
        $post = self::findOneFromUser($data['id'], $user);
        if (!$post) {
            return new BlogPost($data);
        }

        // Edited published post
        if ($post->published) {
            if (empty($data['image'])) {
                $data['image'] = $post->image;
            }
            $newPost = new BlogPost($data);
            $newPost->edited_id = $post->id;
            $newPost->created_at = $post->created_at;
            return $newPost;
        }

        // Edited unpublished post
        $post->fill($data);
        return $post;
    }

    public static function hasChangedPostsFromUser(User $user)
    {
        return self::where('user_id', $user->id)
            ->where(function ($q) {
                $q->orWhere('published', false);
                $q->orWhereNotNull('edited_id');
                $q->orWhere('deleted', true);
            })
            ->exists();
    }

    public static function findChangedPostsFromUser(User $user)
    {
        return self::where('user_id', $user->id)
            ->where(function ($q) {
                $q->orWhere('published', false);
                $q->orWhereNotNull('edited_id');
                $q->orWhere('deleted', true);
            })
            ->get();
    }

    public static function publish(User $user)
    {
        DB::transaction(function () use ($user) {
            $changedPosts = self::findChangedPostsFromUser($user);
            foreach ($changedPosts as $post) {
                if ($post->deleted) {
                    $post->delete();
                } elseif ($post->edited_id) {
                    $editedPostId = $post->edited_id;

                    $post->published = true;
                    $post->edited_id = null;
                    $post->save();

                    $oldPost = self::findOneFromUser($editedPostId, $user);
                    $oldPost->delete();
                } else {
                    $post->published = true;
                    $post->save();
                }
            }
        });
    }

    public static function discard(User $user)
    {
        $discarded = false;
        DB::transaction(function () use ($user, &$discarded) {
            $changedPosts = self::findChangedPostsFromUser($user);
            if (count($changedPosts) > 0) {
                $discarded = true;
                foreach ($changedPosts as $post) {
                    if ($post->deleted) {
                        $post->deleted = false;
                        $post->save();
                    } else {
                        $post->delete();
                    }
                }
            }
        });
        return $discarded;
    }

    private static function cleanUpImageIfUnused(string $image)
    {
        $post = self::where('image', $image)->first();
        if (!$post || !$post->published) {
            Storage::disk('images')->delete($image);
        }
    }
}
