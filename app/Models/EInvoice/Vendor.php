<?php

namespace App\Models\EInvoice;

use Laravel\Sanctum\HasApiTokens;
use App\Models\PersonalAccessToken;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
class Vendor extends Authenticatable implements JWTSubject
{

    // protected $connection = 'sqlsrv';

    protected $table = 'vendors';

    protected $fillable = [
        'UserName',
        'Password'
    ];

    protected $primaryKey = 'Id';

    protected $hidden = [
        'Password'
    ];

    protected $guard = 'vendor';


    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
