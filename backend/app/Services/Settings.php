<?php

namespace App\Services;

use Auth;
use DB;
use Hash;
use App\Actions\Fortify\PasswordValidationRules;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Settings
{
    use PasswordValidationRules;
    private User $user;
    public function __construct(User | null $user = null)
    {
        $this->user = $user !== null && $user->id ? $user : Auth::user();
    }

    public function updateSite(array $data): void
    {
        $rules = [
            'nickname' => [
                'alpha_dash',
                'max:30',
                Rule::unique(User::class, 'nickname')
                    ->ignore($this->user->id),
                Rule::notIn(User::$forbiddenUsers),
            ],
            'meta_title' => ['regex:/^[a-zA-Z0-9\s\p{L}\p{P}]+$/u', 'max:255'],
            'meta_description' => ['regex:/^[a-zA-Z0-9\s\p{L}\p{P}]+$/u', 'max:512'],
        ];

        $data['nickname_prefix'] = mb_strtolower($data['nickname_prefix'] ?? '');

        if (!empty($data['nickname_prefix'])) {
            $rules['nickname_prefix'] = [
                'alpha_dash',
                'max:30',
                Rule::notIn(User::$forbiddenUsers),
            ];
        }

        Validator::make($data, $rules)->validate();

        $user = $this->user;
        DB::transaction(function () use ($user, $data) {
            $user->nickname        = $data['nickname'];
            $user->nickname_prefix = $data['nickname_prefix'];
            $user->save();
            $user->preferences->meta_title       = $data['meta_title'];
            $user->preferences->meta_description = $data['meta_description'];
            $user->preferences->save();
        });
    }

    public function updateAccount(array $data): void
    {
        $rules = [
            'name'  => ['required', 'string', 'max:255'],
            'theme' => [Rule::in(['light', 'dark', 'auto'])],
            'lang' => [Rule::in(['es', 'en', ''])],
        ];

        if (!empty($data['password'])) {
            $rules['password'] = $this->passwordRules();
        }

        Validator::make($data, $rules)->validate();

        $user = $this->user;
        DB::transaction(function () use ($user, $data) {
            $user->name = $data['name'];
            if (!empty($data['password'])) {
                $user->password = Hash::make($data['password']);
            }
            $user->save();
            UserPreference::setTheme($user, $data['theme']);
            UserPreference::setLang($user, $data['lang']);
        });
    }
}
