<?php

namespace App\Models;

use App\Services\Content;
use App\Services\Meta;
use App\Services\Visual;
use Bugsnag;
use DB;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Exception;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    public const DEFAULT_TIER = 'free';

    public static $forbiddenUsers = [
        'admin',
        'user',
        'content',
        'app',
        'api',
        'render',
        'sign-up',
        'login',
        'help-and-contact',
        'feedback',
        'terms',
        'privacy',
        'logout',
        'stats',
        'homepage',
        'reset-password',
        'forgot-password',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'nickname',
        'nickname_prefix',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'id',
        'created_at',
        'updated_at',
        'userPreferences',
        'two_factor_confirmed_at',
        'two_factor_recovery_codes',
        'two_factor_secret',
        'email_verified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Appended attributes.
     *
     * @var array<string, string>
     */
    protected $appends = [
        'preferences',
        'meta',
    ];

    /**
     * Relations
     */
    public function userPreferences()
    {
        return $this->hasOne(UserPreference::class);
    }

    /**
     * Events
     */
    protected static function booted(): void
    {
        static::deleted(function (User $user) {
            $user->userPreferences()->delete();
            DB::table('v1_contents')->where('user_id', $user->id)->delete();
            DB::table('links')->where('user_id', $user->id)->delete();
            DB::table('blog_posts')->where('user_id', $user->id)->delete();
            DB::table('palettes')->where('user_id', $user->id)->delete();
            DB::table('visual_settings')->where('user_id', $user->id)->delete();
        });
    }

    /**
     * Accessors
     */
    public function getPreferencesAttribute()
    {
        if ($this->userPreferences) {
            return $this->userPreferences;
        }
    }

    public function getMetaAttribute()
    {
        $contentService = new Content($this);
        $visualService = new Visual($this);
        $metaService = new Meta($this);

        return [
            'unpublished' => [
                'content' => $contentService->unpublishedContents(),
                'visual'  => $visualService->unpublishedContents(),
            ],
            'profile_image' => V1Content::getProfileImage($this),
            'customizations' => [
                'basics_updated' => $metaService->isBasicsUpdated(),
                'links_updated'  => $metaService->isLinksUpdated(),
                'photos_updated' => $metaService->isPhotosUpdated(),
                'blog_updated'   => $metaService->isBlogUpdated(),
            ]
        ];
    }

    public function getUrlAttribute()
    {
        $base = 'https://jomie.io/';
        if ($this->nickname_prefix) {
            return $base . $this->nickname_prefix . '/' . $this->nickname;
        }
        return $base . $this->nickname;
    }

    public function createDefaultContents()
    {
        Link::createDefaultContent($this);
        VisualSetting::createDefault($this);
        V1Content::createDefaultContent($this);
    }
}
