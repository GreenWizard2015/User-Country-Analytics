<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ErrorsAsJsonMiddleware
{
    /**
     * Handle an incoming request. If the request is invalid, return the errors as JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // 'Catch' ValidationException and return the errors as JSON
        if (!empty($response->exception)) {
            if ($response->exception instanceof \Illuminate\Validation\ValidationException) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $response->exception->errors(),
                ], 422);
            }
        }

        return $response;
    }
}
