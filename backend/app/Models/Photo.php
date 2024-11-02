<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Exception;
use Storage;
use DB;

class Photo extends Base
{
    use HasFactory;

    protected $table = 'photos';
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_id',
        'updated_at',
        'id',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'description',
        'position',
        'image'
    ];

    /**
     * Events
     */
    protected static function booted(): void
    {
        static::deleted(function (Photo $photo) {
            $image = Image::findByObject($photo);
            if ($image) {
                $image->delete();
            }
            $photo->delete();
        });
    }

    public static function uploadPhoto(User $user, $file, int $position, bool $published)
    {
        $path = Storage::disk('images')->putFile('photo', $file);
        if (!$path) {
            return '';
        }
        try {
            self::cleanUpExisting($user, $position, $published);
            $photo = new Photo([
                'description' => '',
                'position'    => $position,
                'published'   => $published,
                'image'       => '',
            ]);
            $photo->user_id = $user->id;
            $photo->save();
            $image = Image::createFromUpload($path, $photo);
            $photo->image = $image->full_path;
            $photo->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public static function cleanUpExisting(User $user, int $position, bool $published)
    {
        $photo = self::where('user_id', $user->id)
            ->where('position', $position)
            ->where('published', $published)
            ->first();
        
        if (!$photo) {
            return;
        }
        
        $image = Image::findByObject($photo);
        if ($image) {
            $image->delete();
        }
        $photo->delete();
    }

    public static function findFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->where('published', $published)
            ->orderBy('position', 'ASC')
            ->get();
    }

    public static function findOneFromUser(User $user, int $position, bool $published)
    {
        return self::where('user_id', $user->id)
            ->where('position', $position)
            ->where('published', $published)
            ->first();
    }

    public static function hasFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->where('published', $published)
            ->exists();
    }

    public static function publish(User $user)
    {
        DB::transaction(function () use ($user) {
            $unpublishedPhotos = self::findFromUser($user, false);
            if (!$unpublishedPhotos) {
                return;
            }
            foreach ($unpublishedPhotos as $photo) {
                $publishedPhoto = self::findOneFromUser($user, $photo->position, true);
                if ($publishedPhoto) {
                    $publishedPhoto->delete();
                }
                if ($photo->deleted) {
                    $photo->delete();
                    continue;
                }
                $photo->published = true;
                $photo->save();
            }
        });
    }

    public static function discard(User $user)
    {
        $discarded = false;
        DB::transaction(function () use ($user, &$discarded) {
            $unpublishedPhotos = self::findFromUser($user, false);
            if (count($unpublishedPhotos) > 0) {
                $discarded = true;
                foreach ($unpublishedPhotos as $photo) {
                    $photo->delete();
                }
            }
        });
        return $discarded;
    }
}
