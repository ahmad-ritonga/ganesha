<?php

// app/Http/Controllers/CategoryController.php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request)
    {
        $slug = $request->get('slug');

        $query = Category::active()->withCount(['publishedBooks as books_count']);

        if ($slug && in_array($slug, ['eksakta', 'soshum', 'terapan', 'interdisipliner'])) {
            $query->bySlug($slug);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $categories = $query->orderBy('name')->paginate(12)->withQueryString();

        // Get statistics by slug
        $slugStats = Category::selectRaw('
                slug,
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
            ')
            ->groupBy('slug')
            ->get()
            ->keyBy('slug');

        return Inertia::render('user/categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['slug', 'search']),
            'slugStats' => $slugStats,
            'currentSlug' => $slug,
        ]);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category)
    {
        $category->loadCount(['books', 'publishedBooks']);

        return Inertia::render('user/categories/show', [
            'category' => $category,
        ]);
    }

    /**
     * Get categories for navbar dropdown
     */
    public function getForNavbar()
    {
        $categories = Category::getForNavbar();

        return response()->json($categories);
    }
}
