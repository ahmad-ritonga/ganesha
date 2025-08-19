<?php

// app/Http/Middleware/ShareGlobalData.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareGlobalData
{
    public function handle(Request $request, Closure $next)
    {
        // Share only essential global data
        // Categories will be loaded dynamically by navbar component
        Inertia::share([
            // Add other global data here if needed
        ]);

        return $next($request);
    }
}
