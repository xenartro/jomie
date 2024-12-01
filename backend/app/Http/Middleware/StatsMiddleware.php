<?php

namespace App\Http\Middleware;

use App\Models\Stat;
use Closure;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $this->generateStat($request);

        return $next($request);
    }

    private function generateStat(Request $request)
    {
        $signature = $this->generateUserSignature($request);
        Stat::generate($request->path(), $signature);
    }

    private function generateUserSignature(Request $request)
    {
        Auth::check();
        $user = Auth::user();
        if ($user) {
            // Skip visits from the current user
            if ($user->getUserUrl() === $request->path()) {
                return;
            }
        }

        $data = [
            'user_id' => $user ? $user->id : 'guest',
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ];

        return hash('sha256', json_encode($data));
    }
}
