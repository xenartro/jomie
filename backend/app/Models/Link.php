<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Exception;
use Validator;

class Link extends Base
{
    use HasFactory;

    public const TYPE_LINK = 0;
    public const TYPE_TIKTOK = 1;
    public const TYPE_INSTAGRAM = 2;
    public const TYPE_THREADS = 3;
    public const TYPE_TWITTER = 4;
    public const TYPE_LINKEDIN = 5;
    public const TYPE_WHATSAPP = 6;
    public const TYPE_BLUESKY = 7;
    public const TYPE_YOUTUBE = 8;
    public const TYPE_TWITCH = 9;
    public const TYPE_KICK = 10;
    public const WHATSAPP_URL = "https://wa.me/";
    public const CATEGORY_LINK = 0;
    public const CATEGORY_SOCIAL = 1;
    public const CATEGORY_STREAMING = 2;

    public const VALIDATOR_RULES = [
        'title'            => ['required', 'string'],
        'url'              => ['required', 'string', 'url'],
        'meta_description' => ['string'],
        'meta_image'       => ['string'],
        'type'             => ['integer'],
    ];

    protected $table = 'links';

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
    protected $fillable = [
        'title',
        'url',
        'meta_description',
        'meta_image',
        'type',
    ];

    public function toArray()
    {
        $data = parent::toArray();
        if ($this->type === self::TYPE_WHATSAPP) {
            $data['url'] = str_replace(self::WHATSAPP_URL, '', $data['url']);
        }
        return $data;
    }

    public static function linkExists(User $user, array $data, bool $published)
    {
        if (!is_array($data)) {
            return false;
        }

        $data['meta_description'] = $data['meta_description'] ?? '';
        $data['meta_image']       = $data['meta_image'] ?? '';

        try {
            if (!Validator::make($data, self::VALIDATOR_RULES)->validate()) {
                return false;
            }
        } catch (Exception $e) {
            return true;
        }

        return Link::where('user_id', $user->id)
            ->where('title', $data['title'])
            ->where('url', $data['url'])
            ->where('meta_description', $data['meta_description'])
            ->where('meta_image', $data['meta_image'])
            ->where('type', $data['type'])
            ->where('category', $data['category'])
            ->where('published', $published)
            ->exists();
    }

    public static function createDefaultContent(User $user)
    {
        self::createLink($user, [
            'title'            => 'Personal Website',
            'url'              => env('APP_URL').'/'.$user->nickname,
            'meta_description' => 'Jomie: your place in the digital world',
            'meta_image'       => '',
            'type'             => self::TYPE_LINK,
            'category'         => self::CATEGORY_LINK,
        ], true);
    }

    public static function createEmpty(User $user, int $category)
    {
        $link = new Link([
            'title'            => '',
            'url'              => '',
            'meta_description' => '',
            'meta_image'       => '',
            'type'             => self::TYPE_LINK,
            'category'         => $category,
        ]);
        $link->user_id = $user->id;
        $link->published = false;
        $link->save();
    }

    public static function createLink(User $user, array $data, bool $published, int $category)
    {
        if (!$published && empty($data['url']) && empty($data['title'])) {
            return self::createEmpty($user);
        }

        $data['meta_description'] = $data['meta_description'] ?? '';
        $data['meta_image']       = $data['meta_image'] ?? '';
        if ($data['type'] === self::TYPE_WHATSAPP) {
            $data['url'] = self::WHATSAPP_URL.$data['url'];
        }

        if (!Validator::make($data, self::VALIDATOR_RULES)->validate()) {
            return;
        }

        $linkCount = self::countFromUser($user, false, $category);
        if ($linkCount > 50) {
            throw new Exception('Too many unpublished links');
        }

        $link = new Link($data);
        $link->user_id = $user->id;
        $link->published = $published;
        $link->category = $category;
        $link->save();

        return $link;
    }

    public static function findFromUser(User $user, bool $published, $category = null)
    {
        $query = self::where('user_id', $user->id)
            ->where('published', $published);

        if (isset($category)) {
            $query->where('category', $category);
        }
        return $query->get();
    }

    public static function countFromUser(User $user, bool $published, int $category)
    {
        return self::where('user_id', $user->id)
            ->where('published', $published)
            ->where('category', $category)
            ->count();
    }


    public static function hasFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->where('published', $published)
            ->exists();
    }

    public static function getUnpublishedCategories()
    {
        $categories = DB::table('links')
            ->where('published', false)
            ->select('category')
            ->distinct()
            ->get();

        $unpublishedCategories = [];
        foreach ($categories as $category) {
            $unpublishedCategories[] = $category->category;
        }
        return $unpublishedCategories;
    }

    public static function publish(User $user)
    {
        DB::transaction(function () use ($user) {
            $categories = self::getUnpublishedCategories();
            foreach ($categories as $category) {
                $publishedLinks = self::findFromUser($user, true, $category);
                if ($publishedLinks) {
                    foreach ($publishedLinks as $link) {
                        $link->delete();
                    }
                }
            }

            $unpublishedLinks = self::findFromUser($user, false);
            if ($unpublishedLinks) {
                foreach ($unpublishedLinks as $link) {
                    $link->published = true;
                    $link->save();
                }
            }
        });
    }

    public static function discard(User $user)
    {
        $discarded = false;
        DB::transaction(function () use ($user, &$discarded) {
            $unpublishedLinks = self::findFromUser($user, false);
            if (count($unpublishedLinks) > 0) {
                $discarded = true;
                foreach ($unpublishedLinks as $link) {
                    $link->delete();
                }
            }
        });
        return $discarded;
    }
}
