<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;

use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\EInvoice\Vendor;
use App\Helpers\ResponseFormatter;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Check for Vendor login first
        $vendor = Vendor::where('UserName', $request->username)->first();

        if ($vendor) {
            if ($vendor->Password !== $request->password) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Auth::guard('vendor')->login($vendor);
            auth('api_vendor')->login($vendor);

            $token = JWTAuth::fromUser($vendor);

            // Session::put('token', $token);

            return ResponseFormatter::success([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => Auth::factory()->getTTL() * 60,
                'type' => 'vendor'
            ], 'Login success');
        } else {

            // Fallback to User login
            $user = User::where('username', $request->username)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            if ($user) {

                auth('api')->login($user);

                $token = JWTAuth::fromUser($user);

                // Session::put('token', $token);

                return ResponseFormatter::success([
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => Auth::factory()->getTTL(),
                    'type' => 'user'
                ], 'Login success');
            }
        }


        // Auth::guard('web')->login($vendor);
    }


    public function me()
    {
        if(auth('api')->check()) {
        return response()->json(auth('api')->user());
        } else {
        return response()->json(auth('api_vendor')->user());
        }

    }

    public function logout(Request $request)
    {
        try {
            // Invalidate the token
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json(['message' => 'Successfully logged out'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Failed to logout, please try again'], 500);
        }
    }

    public function refresh()
    {
        return ResponseFormatter::success([
            'access_token' => Auth::guard('vendor')->user(),
            'token_type' => 'Bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => Auth::guard('vendor')->user()
        ], 'Login success');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('api')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
