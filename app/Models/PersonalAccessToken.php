<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class PersonalAccessToken extends Model implements HasAbilities
{

    protected $connection = 'mysql';

    protected $table = 'personal_access_tokens';

    protected $guarded = [];

    protected $casts = [
        'abilities' => 'json', // Ensure `abilities` is cast to JSON
        'expires_at' => 'datetime',
    ];

    /**
     * Get the tokenable model that the token belongs to.
     */
    public function tokenable()
    {
        return $this->morphTo('tokenable', 'tokenable_type', 'tokenable_id');
    }

    /**
     * Determine if the token has a given ability.
     */
    public function can($ability)
    {
        return in_array('*', $this->abilities) || in_array($ability, $this->abilities);
    }

    /**
     * Determine if the token is missing a given ability.
     */
    public function cant($ability)
    {
        return !$this->can($ability);
    }
}
