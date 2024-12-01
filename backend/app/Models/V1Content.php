<?php

namespace App\Models;

use DB;
use Storage;

class V1Content extends Base
{
    protected $table = 'v1_contents';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_id',
        'created_at',
        'updated_at',
        'id',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'level1',
        'level2',
        'level3',
        'paragraph',
        'profile_image',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleted(function (V1Content $content) {
            if ($content->profile_image) {
                V1Content::cleanUpProfileImageIfUnused($content->profile_image);
            }
        });
    }

    public function setProfileImageAttribute($imageFile)
    {
        if (gettype($imageFile) === 'string') {
            $this->attributes['profile_image'] = $imageFile;
            return;
        }

        if (!empty($this->attributes['profile_image'])) {
            V1Content::cleanUpProfileImageIfUnused($this->attributes['profile_image']);
        }

        $path = Storage::disk('images')->putFile('profile', $imageFile);
        $this->attributes['profile_image'] = $path;
    }

    public static function createDefaultContent(User $user)
    {
        self::createBasic($user, [
            'level1'    => $user->name,
            'level2'    => $user->preferences->identity,
            'level3'    => 'Somewhere, Planet Earth',
            'paragraph' => 'It all started when I was born...'
        ], true);
    }

    public static function createBasic(User $user, array $data, bool $published)
    {
        $content = new V1Content([
            'level1'        => $data['level1'] ?? '',
            'level2'        => $data['level2'] ?? '',
            'level3'        => $data['level3'] ?? '',
            'paragraph'     => $data['paragraph'] ?? '',
            'profile_image' => $data['profile_image'] ?? '',
        ]);
        $content->user_id = $user->id;
        $content->published = $published;
        $content->save();
        return $content;
    }

    public static function findFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->latest()
            ->where('published', $published)
            ->first();
    }

    public static function hasFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->latest()
            ->where('published', $published)
            ->exists();
    }

    public static function publish(User $user)
    {
        DB::transaction(function () use ($user) {
            $unpublishedContent = self::findFromUser($user, false);
            if (!$unpublishedContent) {
                // log error
                return;
            }

            $publishedContent = self::findFromUser($user, true);

            $unpublishedContent->published = true;
            $unpublishedContent->save();

            $publishedContent->delete();
        });
    }

    public static function discard(User $user)
    {
        $unpublishedContent = self::findFromUser($user, false);
        if ($unpublishedContent) {
            $unpublishedContent->delete();
            return true;
        }
        return false;
    }

    public static function getProfileImage(User $user)
    {
        $content = DB::table('v1_contents')
            ->select('profile_image')
            ->where('user_id', $user->id)
            ->where('published', true)
            ->first();

        return $content && $content->profile_image ? \asset('/storage/images/'.$content->profile_image) : '';
    }

    private static function cleanUpProfileImageIfUnused(string $profileImage)
    {
        $content = self::where('profile_image', $profileImage)->first();
        if (!$content || !$content->published) {
            Storage::disk('images')->delete($profileImage);
        }
    }
}
