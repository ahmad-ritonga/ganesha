<?php

// app/Http/Middleware/ShareGlobalData.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ShareGlobalData
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Get categories data
            $categories = Category::getForNavbar();

            // Debug logging
            Log::info('ShareGlobalData: Categories loaded', [
                'count' => count($categories),
                'slugs' => array_keys($categories)
            ]);

            // Share categories grouped by slug untuk navbar
            Inertia::share([
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            Log::error('ShareGlobalData failed: ' . $e->getMessage());

            // Fallback to empty array
            Inertia::share([
                'categories' => [],
            ]);
        }

        return $next($request);
    }
}
