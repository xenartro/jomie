<?php

namespace App\Models;

use Bugsnag;
use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Exception;
use Validator;

class VisualSetting extends Base
{
    use HasFactory;

    protected $table = 'visual_settings';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
        'user_id'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'palette_id',
        'font_id',
        'layout_id',
        'loading_effect_id',
    ];

    public function palette()
    {
        return $this->belongsTo(Palette::class);
    }

    public function font()
    {
        return $this->belongsTo(Font::class);
    }

    public static function resolveLayout(int $layoutId)
    {
        switch ($layoutId) {
            case 1:
                return 'multi-page';
            case 2:
                return 'single-page';
            case 3:
                return 'single-page-2';
            case 4:
                return 'old-school';
            default:
                Bugsnag::notifyException(new Exception('Invalid layout ID: ' . $layoutId));
                return 'multi-page';
        }
    }

    public static function resolveLoadingEffect(int $loadingEffectId)
    {
        switch ($loadingEffectId) {
            case 1:
                return 'fade-in';
            case 2:
                return 'flip';
            default:
                return '';
        }
    }

    public static function createDefault(User $user)
    {
        $palette = Palette::getDefault();
        $font = Font::getDefault();
        $settings = new VisualSetting([
            'user_id'           => $user->id,
            'palette_id'        => $palette->id,
            'font_id'           => $font->id,
            'layout_id'         => 1,
            'loading_effect_id' => 1,
        ]);
        $settings->published = true;
        $settings->save();
        return $settings;
    }

    public static function setStyleFromPreferences(User $user)
    {
        $settings = self::findFromUser($user, true);
        /**
         * 1: multi page
         * 2: single page
         */
        switch ($user->preferences->site_type) {
            case 'personal-card':
                $settings->layout_id = 2;
                break;
            case 'website':
                $settings->layout_id = 2;
                break;
            case 'blog':
                $settings->layout_id = 1;
                break;
            case 'portfolio':
                $settings->layout_id = 1;
                break;
            case 'dont-know':
            case 'other':
                $settings->layout_id = 2;
                break;
            default:
                Bugsnag::notifyException(new Exception('Unexpected site type: ' . $user->preferences->site_type));

        }
        /**
         * 1 Modern
         * 2 Traditional
         * 3 Monospace
         * 4 Cursive
         */
        switch ($user->preferences->identity) {
            case 'content-creator':
                $settings->font_id = 1;
                break;
            case 'developer':
                $settings->font_id = 3;
                break;
            case 'designer':
                $settings->font_id = 1;
                break;
            case 'artist':
                $settings->font_id = 2;
                break;
            case 'professional':
                $settings->font_id = 1;
                break;
            case 'model':
                $settings->font_id = 4;
                break;
            case 'sports':
                $settings->font_id = 1;
                break;
            case 'gamer':
                $settings->font_id = 31;
                break;
            case 'human':
                $settings->font_id = 1;
                break;
            case 'alien':
                $settings->font_id = 4;
                break;
            default:
                Bugsnag::notifyException(new Exception('Unexpected identity: ' . $user->preferences->identity));
        }

        $settings->palette_id = rand(1, 4);
        $settings->save();
    }

    public static function clonePublished(VisualSetting $settings)
    {
        $newSettings = new VisualSetting([
            'user_id'           => $settings->user_id,
            'palette_id'        => $settings->palette_id,
            'font_id'           => $settings->font_id,
            'layout_id'         => $settings->layout_id,
            'loading_effect_id' => $settings->loading_effect_id,
            'published'         => false
        ]);
        $newSettings->save();
        return $newSettings;
    }

    public static function findFromUser(User $user, bool $published)
    {
        return self::where('user_id', $user->id)
            ->where('published', $published)
            ->first();
    }

    public static function isCurrentPalette(User $user, int $id)
    {
        return self::where('user_id', $user->id)
            ->where('palette_id', $id)
            ->exists();
    }

    public static function isCurrentType(User $user, int $id)
    {
        return self::where('user_id', $user->id)
            ->where('font_id', $id)
            ->exists();
    }

    /*
     * Mutators
     */
    public function getLayoutAttribute()
    {
        return self::resolveLayout($this->layout_id);
    }

    public function getLoadingEffectAttribute()
    {
        return self::resolveLoadingEffect($this->loading_effect_id);
    }
}
