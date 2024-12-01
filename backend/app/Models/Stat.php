<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Exception;
use Validator;

class Stat extends Base
{
    use HasFactory;

    protected $table = 'stats';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'checksum',
    ];

    public static function generate(string $path, string $signature)
    {
        $parts = explode('/', $path);
        if (count($parts) > 2) {
            return;
        }
        $nickname = count($parts) === 2 ? $parts[1] : $parts[0];
        $prefix = count($parts) === 2 ? $parts[0] : null;
        $user = User::getByNickname($nickname, $prefix);
        if (!$user) {
            return;
        }
        if (self::statExists($user, $signature)) {
            return;
        }
        $stat = new Stat([
            'user_id'  => $user->id,
            'checksum' => $signature,
        ]);
        $stat->save();
    }

    public static function statExists(User $user, string $signature)
    {
        return DB::table('stats')
            ->where('user_id', $user->id)
            ->whereRaw('DATE(created_at) = "'.date('Y-m-d').'"')
            ->where('checksum', $signature)
            ->exists();
    }
}
