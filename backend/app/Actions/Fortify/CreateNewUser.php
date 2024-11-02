<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array  $input
     * @return \App\Models\User
     */
    public function create(array $input)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'nickname' => [
                'alpha_dash',
                'max:30',
                Rule::unique(User::class, 'nickname'),
                Rule::notIn(User::$forbiddenUsers),
            ],
        ];

        if (!empty($input['nickname_prefix'])) {
            $rules['nickname_prefix'] = [
                'alpha_dash',
                'max:30',
                Rule::notIn(User::$forbiddenUsers),
            ];
        }

        if (!empty($input['lang'])) {
            $rules['lang'] = [
                'required',
                Rule::in(['en', 'es']),
            ];
        }

        Validator::make($input, $rules)->validate();

        $user = User::create([
            'name'            => $input['name'],
            'email'           => $input['email'],
            'nickname'        => $input['nickname'] ?? '',
            'nickname_prefix' => mb_strtolower($input['nickname_prefix'] ?? ''),
            'password'        => Hash::make($input['password']),
            'tier'            => User::DEFAULT_TIER,
        ]);

        $overrides = isset($input['lang']) ? ['lang' => $input['lang']] : [];
        UserPreference::createDefault($user, $overrides);

        $user = User::find($user->id);
        try {
            $user->createDefaultContents();
        } catch (Exception $e) {
            Bugsnag::notifyException($e);
        }

        return $user;
    }
}
