<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Validator;

class Palette extends Base
{
    use HasFactory;

    public const VALIDATOR_RULES = [
        'balance' => ['required', 'integer', 'min:0', 'max:100'],
        'palette' => ['required', 'array', 'min:1'],
        'palette.*.hue' => ['integer', 'min:0', 'max:360'],
        'palette.*.saturation' => ['integer', 'min:0', 'max:100'],
    ];

    protected $table = 'palettes';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_id',
        'created_at',
        'updated_at',
        'hue_1',
        'saturation_1',
        'hue_2',
        'saturation_2',
        'hue_3',
        'saturation_3',
        'hue_4',
        'saturation_4',
    ];

    /**
     * Appended attributes.
     *
     * @var array<string, string>
     */
    protected $appends = [
        'palette',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hue_1',
        'saturation_1',
        'hue_2',
        'saturation_2',
        'hue_3',
        'saturation_3',
        'hue_4',
        'saturation_4',
        'balance',
    ];

    public function toArray()
    {
        $getColorName = function (int $index) {
            switch ($index) {
                case 1:
                    return 'primary';
                case 2:
                    return 'secondary';
                case 3:
                    return 'tertiary';
                case 4:
                    return 'quaternary';
                default:
                    return 'unknown';
            }
        };
        // $this->balance = 90;
        $palette = parent::toArray();
        $palette['colors'] = [];
        $palette['colors']['neutral'] = [];
        $palette['colorfulness'] = self::calculateColorfulness($this->balance);
        $palette['darkColorfulness'] = self::calculateDarkColorfulness($this->balance);

        //LO QUE VOY A HACER ES CALCULAR UN COLOR PARA CADA ELEMENTO DEL WEBSITE
        //DE ESTA FORMA PUEDO USAR MEJOR TODOS LOS COLORES DE LA PALETA
        $palette['colorsCount'] = count($palette['palette']);
        $palette['backgrounds'] = self::calculateBackgrounds($this->balance, $palette['colorsCount']);
        $palette['navigation'] = self::calculateNavigation($this->balance, $palette['colorsCount']);
        $palette['text'] = self::calculateText($this->balance, $palette['colorsCount']);
        $palette['border'] = self::calculateBorder($this->balance, $palette['colorsCount']);
        //
        $balance = self::calculateBalanceCoef($this->balance);
        for ($j = 100; $j >= 10; $j -= 10) {
            $hue = $this->hue_1;
            $saturation = ceil($this->saturation_1 * $balance);
            $luminance = $j <= 90 ? $j : 99;
            $palette['colors']['neutral'][] = "hsl({$hue}, {$saturation}%, {$luminance}%)";
        }

        for ($i = 1; $i < 5; $i++) {
            if (!isset($this->{'hue_' . $i})) {
                break;
            }
            $name = $getColorName($i);
            $palette['colors'][$name] = [];
            for ($j = 100; $j >= 10; $j -= 10) {
                $hue = $this->{'hue_' . $i};
                $saturation = $this->{'saturation_' . $i};
                $luminance = $j <= 90 ? $j : 99;
                $palette['colors'][$name][] = "hsl({$hue}, {$saturation}%, {$luminance}%)";
            }
        }

        $palette['user_palette'] = (bool)$this->user_id;
        $palette['hue'] = $this->hue_1;
        $palette['saturation'] = $this->saturation_1;
        $palette['r'] = $this->random_component;

        return $palette;
    }

    public function getPaletteAttribute()
    {
        $palette = [];
        for ($i = 1; $i < 5; $i++) {
            if (!isset($this->{'hue_' . $i})) {
                break;
            }
            $palette[] = [
                'hue'        => $this->{'hue_' . $i},
                'saturation' => $this->{'saturation_' . $i},
            ];
        }
        return $palette;
    }

    public static function calculateBalanceCoef(int $balance)
    {
        if ($balance <= 5) {
            return 0.02;
        } elseif ($balance <= 25) {
            return 0.15;
        } elseif ($balance <= 50) {
            return 0.35;
        } elseif ($balance <= 85) {
            return 0.75;
        } else {
            return 1;
        }
    }

    public static function calculateColorfulness(int $balance)
    {
        if ($balance <= 25) {
            return 0;
        } elseif ($balance <= 50) {
            return 100;
        } elseif ($balance <= 75) {
            return 200;
        }
        return 300;
    }

    public static function calculateDarkColorfulness(int $balance)
    {
        if ($balance <= 25) {
            return 900;
        } elseif ($balance <= 50) {
            return 900;
        } elseif ($balance <= 75) {
            return 800;
        }
        return 800;
    }

    public static function calculateBackgrounds(int $balance, int $colors)
    {
        if ($colors == 1) {
            return "neutral";
        } elseif ($colors >= 2 && $balance <= 50) {
            return "neutral";
        } elseif ($colors >= 2 && $balance >= 50) {
            return "primary";
        }
        return "neutral";
    }

    public static function calculateText(int $balance, int $colors)
    {
        if ($colors == 1) {
            return "neutral";
        } elseif ($colors >= 2 && $balance >= 50) {
            return "secondary";
        }
        return "neutral";
    }
    public static function calculateBorder(int $balance, int $colors)
    {
        if ($balance <= 50) {
            return self::calculateColorfulness($balance) + 100;
        } else {
            return self::calculateColorfulness($balance) + 200;
        }

        return self::calculateColorfulness($balance);
    }

    public static function calculateNavigation(int $balance, int $colors)
    {
        if ($balance <= 50) {
            return "neutral";
        } elseif ($colors == 1) {
            return "neutral";
        } elseif ($colors == 2) {
            return "secondary";
        } elseif ($colors == 3) {
            return "tertiary";
        } elseif ($colors == 4) {
            return "quaternary";
        }

        return "neutral";
    }

    public static function getDefault()
    {
        return Palette::whereNull('user_id')->first();
    }

    public static function saveFromData(User $user, array $data)
    {
        if (!Validator::make($data, self::VALIDATOR_RULES)->validate()) {
            return false;
        }

        $palette = isset($data['id']) ? Palette::find($data['id']) : new Palette();
        if (!$palette) {
            return false;
        }
        $palette->balance = $data['balance'];

        $max = min(count($data['palette']), 4);
        for ($i = 0; $i < $max; $i++) {
            $palette->{'hue_' . ($i + 1)}        = $data['palette'][$i]['hue'];
            $palette->{'saturation_' . ($i + 1)} = $data['palette'][$i]['saturation'];
        }

        $palette->user_id = $user->id;
        $palette->save();

        return $palette;
    }

    public static function getPalette(User $user, int $id)
    {
        return Palette::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
    }
}
