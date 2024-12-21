<?php

namespace App\Http\Controllers\Admin;

use Inertia\Response;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class DashboardController extends Controller
{

    public function index()
    {
        // if (auth('api')->check()) {
        //     $user = auth('api')->user();
        //     dd($user);
        // } else {
        //     $user = auth('api_vendor')->user();
        //     auth('api')->check();
        // }

        // dd($token = JWTAuth::getToken());

        return Inertia('Dashboard');
    }

    public function checkToken()
    {
        return Inertia('CheckApi');
    }
}
