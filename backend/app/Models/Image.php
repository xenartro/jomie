<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Storage;

class Image extends Base
{
    use HasFactory;

    protected $table = 'images';
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id',
        'user_id',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [];

    /**
     * Events
     */
    protected static function booted(): void
    {
        static::deleted(function (Image $image) {
            Storage::disk('images')->delete($image->file);
        });
    }

    public function getFullPathAttribute()
    {
        return asset('storage/images/' . $this->file);
    }

    public static function createFromUpload(string $path, $object)
    {
        $image = new Image();
        $image->file = $path;
        $image->object_id = $object->id ?? 0;
        $image->user_id = $object->user_id;
        $image->object = $object::class;
        $image->save();
        return $image;
    }

    public static function findByObject($object)
    {
        return self::where('object_id', $object->id)
            ->where('object', $object::class)
            ->first();
    }
}
