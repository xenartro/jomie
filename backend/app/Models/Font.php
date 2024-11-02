<?php
namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Exception;
use Nubs\RandomNameGenerator\Alliteration;
use Validator;

class Font extends Base
{
    use HasFactory;
    public const BASIC_FONT_SIZE = 16;
    public const MIN_FONT_SIZE = 14;

    const VALIDATOR_RULES = [
        //'name' => ['required', 'string'],
        'main_family' => ['required', 'string', 'max:100'],
        'ratio' => ['required', 'decimal:1,3',],
        'weight' => ['required', 'integer'],
        'family' => ['required', 'string', 'max:255'],
    ];

    protected $table = 'fonts';
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
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
        'main_family',
        'ratio',
        'weight',
        'family',
    ];

    /**
     * Appended attributes.
     *
     * @var array<string, string>
     */
    public static function saveFromData(User $user, array $data)
    {
        if (!Validator::make($data, self::VALIDATOR_RULES)->validate()) {
            return false;
        }

        $font = isset($data['id']) ? Font::find($data['id']) : new Font();
        if (!$font) {
            return false;
        }
        $font->fill($data);
        if (!$font->name) {
            $generator = new Alliteration();
            $font->name = $generator->getName();
        }

        $font->user_id = $user->id;
        $font->save();

        return $font;
    }

    public static function getFont(User $user, int $id)
    {
        return Font::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
    }

    public static function getDefault()
    {
        return Font::whereNull('user_id')->first();
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['render']    = self::render();
        $data['user_type'] = (bool)$this->user_id;

        return $data;
    }

    /**
     * Sync these functions with services/font.ts
     */
    public static function calculateFontSize(float $ratio, int $level)
    {
        $size = round(self::BASIC_FONT_SIZE * pow($ratio, $level));
        $size = floor($size / 4) * 4;
        return $size < self::MIN_FONT_SIZE ? self::MIN_FONT_SIZE : $size;
    }

    public static function calculateLineHeight(int $fontSize)
    {
        $lineHeight = 1.5 - ($fontSize - self::BASIC_FONT_SIZE) / 200;
        return $lineHeight < 1 ? 1 : $lineHeight;
    }

    public static function calculateFontWeight(int $weight)
    {
        switch ($weight) {
            case 0:
                return 300;
            case 1:
                return 400;
            case 2:
                return 600;
            default:
                return 400;
        }
    }

    public static function getType(User $user, int $id)
    {
        return self::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
    }

    private const LINKS = [
        "Switzer, sans-serif" => [
            '<link href="https://api.fontshare.com/v2/css?f[]=switzer@2,1&display=swap" rel="stylesheet">',
        ],
        "Sentient, serif" => [
            '<link href="https://api.fontshare.com/v2/css?f[]=sentient@2,1&display=swap" rel="stylesheet">',
        ],
        "Sono, monospace" => [
            '<link rel="preconnect" href="https://fonts.googleapis.com">',
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
            '<link href="https://fonts.googleapis.com/css2?family=Sono:wght@300;400;600;700&display=swap" rel="stylesheet">',
        ],
        "Telma, cursive" => [
            '<link href="https://api.fontshare.com/v2/css?f[]=telma@1&display=swap" rel="stylesheet">',
        ],
    ];

    public static function getFontResources(string $familyName)
    {
        if (isset(self::LINKS[$familyName])) {
            return self::LINKS[$familyName];
        }
        $links = [];
        foreach (self::LINKS as $name => $link) {
            $links = array_merge($links, $link);
        }
        return $links;
    }

    public function render()
    {
        $familiesLinks = self::getFontResources($this->main_family);
        if ($this->main_family !== $this->family) {
            $familiesLinks = array_merge($familiesLinks, self::getFontResources($this->family));
        }

        $data = [];
        $data['links'] = [
            'all'      => self::getFontResources(''),
            'families' => $familiesLinks,
        ];
        $data['heading1'] = [
            'font_family' => $this->family,
            'font_size'   => self::calculateFontSize($this->ratio, 2) . 'px',
            'font_weight' => self::calculateFontWeight($this->weight),
            'line_height' => self::calculateLineHeight(self::calculateFontSize($this->ratio, 2)),
        ];
        $data['heading2'] = [
            'font_family' => $this->family,
            'font_size'   => self::calculateFontSize($this->ratio, 1) . 'px',
            'font_weight' => self::calculateFontWeight($this->weight),
            'line_height' => self::calculateLineHeight(self::calculateFontSize($this->ratio, 1)),
        ];
        $data['small'] = [
            'font_family' => $this->family,
            'font_size' => self::calculateFontSize($this->ratio, -1) . 'px',
            'font_weight' => self::calculateFontWeight($this->weight),
            'line_height' => self::calculateLineHeight(self::calculateFontSize($this->ratio, -1)),
        ];
        $data['body'] = [
            'font_family' => $this->main_family,
            'font_size'   => self::BASIC_FONT_SIZE . 'px',
            'font_weight' => self::calculateFontWeight($this->weight),
            'line_height' => self::calculateLineHeight(self::BASIC_FONT_SIZE),
        ];

        return $data;
    }
}
