<?php

namespace App\Services;

use App\Models\User;
use Auth;
use DB;

class Meta
{
    private User $user;
    public function __construct(User | null $user = null)
    {
        $this->user = $user !== null && $user->id ? $user : Auth::user();
    }

    public function isBasicsUpdated()
    {
        return DB::table('users AS u')
            ->join('v1_contents AS c', 'u.id', '=', 'c.user_id')
            ->where('u.id', $this->user->id)
            ->whereRaw('u.created_at = c.updated_at')
            ->exists() === false;
    }

    public function isLinksUpdated()
    {
        return DB::table('users AS u')
            ->join('links AS l', 'u.id', '=', 'l.user_id')
            ->where('u.id', $this->user->id)
            ->whereRaw('u.created_at != l.created_at')
            ->exists();
    }

    public function isPhotosUpdated()
    {
        return DB::table('users AS u')
            ->join('photos AS p', 'u.id', '=', 'p.user_id')
            ->where('u.id', $this->user->id)
            ->whereRaw('u.created_at != p.created_at')
            ->exists();
    }

    public function isBlogUpdated()
    {
        return DB::table('users AS u')
            ->join('blog_posts AS p', 'u.id', '=', 'p.user_id')
            ->where('u.id', $this->user->id)
            ->whereRaw('u.created_at != p.created_at')
            ->exists();
    }
}
