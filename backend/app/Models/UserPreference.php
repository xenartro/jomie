<?php

namespace App\Models;

use App\Models\User;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    public const THEME_AUTO    = 0;
    public const THEME_LIGHT   = 1;
    public const THEME_DARK    = 2;
    public const THEME_DEFAULT = self::THEME_LIGHT;
    public const IDENTITY_DEFAULT = 'human';
    public const META_DESCRIPTION_DEFAULT = 'Jomie: your place in the digital world.';
    public const LANG_DEFAULT = 'en';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'setup_skipped',
        'theme',
        'identity',
        'site_type',
        'update_frequency',
        'meta_title',
        'meta_description',
        'basics_enabled',
        'links_enabled',
        'posts_enabled',
        'photos_enabled',
        'lang',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'setup_skipped'   => 'boolean',
        'setup_completed' => 'boolean'
    ];

    /**
     * Appended attributes.
     *
     * @var array<string, string>
     */
    protected $appends = [
        'theme_name',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'id',
        'updated_at',
        'user_id',
        'theme',
    ];

    /**
     * Accessors
     */
    public function getThemeNameAttribute()
    {
        return self::themeName($this->theme);
    }

    /**
     * Methods
     */
    public static function createDefault(User $user, $overrides = [])
    {
        $preferences = new UserPreference([
            'setup_skipped'    => false,
            'theme'            => self::THEME_DEFAULT,
            'identity'         => self::IDENTITY_DEFAULT,
            'meta_title'       => $user->name,
            'meta_description' => self::META_DESCRIPTION_DEFAULT,
            'basics_enabled'   => true,
            'links_enabled'    => true,
            'posts_enabled'    => true,
            'photos_enabled'   => true,
            'lang'             => self::LANG_DEFAULT,
        ]);
        foreach ($overrides as $attribute => $value) {
            $preferences->{$attribute} = $value;
        }
        $preferences->user_id = $user->id;
        $preferences->save();

        return $preferences;
    }

    public static function themeName(int $id)
    {
        switch ($id)
        {
            case self::THEME_AUTO:
                return 'auto';
            case self::THEME_LIGHT:
                return 'light';
            case self::THEME_DARK:
                return 'dark';
            default:
                return self::themeName(self::THEME_DEFAULT);
            }
        }

    public static function themeId(string $themeName): int
    {
        switch ($themeName)
        {
            case 'auto':
                return self::THEME_AUTO;
            case 'light':
                return self::THEME_LIGHT;
            case 'dark':
            default:
                return self::THEME_DARK;
        }
    }

    public static function skipSetup(User | null $user)
    {
        if (!$user) {
            // Should log event
            return;
        }

        $user->preferences->setup_skipped = true;
        $user->preferences->save();
    }

    public static function setTheme(User | null $user, string $themeName)
    {
        $theme = self::themeId($themeName);

        if (!$user || !isset($theme)) {
            // Should log event
            return;
        }

        $user->preferences->theme = $theme;
        $user->preferences->save();
    }

    public static function setLang(User | null $user, string $lang)
    {
        if (!in_array($lang, ['es', 'en', ''])) {
            return;
        }

        $user->preferences->lang = $lang;
        $user->preferences->save();
    }

    public static function updateInitialSetup(User | null $user, array $data)
    {
        if (!$user) {
            // Should log event
            return;
        }

        DB::transaction(function () use ($user, $data) {
            $user->preferences->setup_completed  = true;
            $user->preferences->identity         = $data['identity'] ?? $user->preferences->identity;
            $user->preferences->site_type        = $data['usage'] ?? $user->preferences->site_type;
            $user->preferences->update_frequency = $data['frequency'] ?? $user->preferences->update_frequency;
            $user->preferences->save();
            VisualSetting::setStyleFromPreferences($user);
        });
    }

    public static function updatePreferences(User | null $user, array $data)
    {
        if (!$user) {
            return;
        }
        switch ($data['preference']) {
            case 'basics_enabled':
                $user->preferences->basics_enabled = boolval($data['value']);
                $user->preferences->save();
                break;
            case 'links_enabled':
                $user->preferences->links_enabled = boolval($data['value']);
                $user->preferences->save();
                break;
            case 'posts_enabled':
                $user->preferences->posts_enabled = boolval($data['value']);
                $user->preferences->save();
                break;
            case 'photos_enabled':
                $user->preferences->photos_enabled = boolval($data['value']);
                $user->preferences->save();
                break;
            default:
                $sections = [
                    'basics',
                    'links',
                    'posts',
                    'photos',
                ];
                foreach ($sections as $section) {
                    if ($data['preference'] === $section.'_name') {
                        $user->preferences->{$section.'_name'} = $data['value'] ?? '';
                        $user->preferences->save();
                        return;
                    }
                }
                throw new Exception("Unexpected preference update: " . serialize($data));
        }
    }
}
