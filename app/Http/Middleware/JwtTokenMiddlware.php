<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;

class JwtTokenMiddlware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Attempt to authenticate the user with JWT
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                // If no user is found, redirect to login
                return redirect()->route('login');
            }
        } catch (JWTException $e) {
            // Handle token exceptions
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                // Token is expired
                return redirect()->route('login')->with('error', 'Token has expired');
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                // Token is invalid
                return redirect()->route('login')->with('error', 'Token is invalid');
            } else {
                // Token is absent
                return redirect()->route('login')->with('error', 'Authorization token not found');
            }
        }

        // Continue with the request
        return $next($request);
    }
    
}
