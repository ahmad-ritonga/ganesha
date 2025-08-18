<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Filter berdasarkan slug (rumpun ilmu)
        if ($request->has('slug') && in_array($request->slug, ['eksakta', 'soshum', 'terapan', 'interdisipliner'])) {
            $query->where('slug', $request->slug);
        }

        $categories = $query->withCount(['publishedBooks as books_count'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Get statistics berdasarkan slug
        $slugStats = Category::selectRaw('
                slug, 
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
            ')
            ->whereIn('slug', ['eksakta', 'soshum', 'terapan', 'interdisipliner'])
            ->groupBy('slug')
            ->get()
            ->keyBy('slug');

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'slug']),
            'slugStats' => $slugStats,
            'slugOptions' => $this->getSlugOptions(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/create', [
            'slugOptions' => $this->getSlugOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|in:eksakta,soshum,terapan,interdisipliner',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category)
    {
        $category->load(['books' => function ($query) {
            $query->published()->latest()->take(10);
        }]);

        $category->loadCount(['books', 'publishedBooks']);

        return Inertia::render('admin/categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $category,
            'slugOptions' => $this->getSlugOptions(),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'in:eksakta,soshum,terapan,interdisipliner',
                // Tidak perlu unique karena slug boleh sama (multiple categories per slug)
            ],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        // Handle image upload - HANYA jika ada file baru yang diupload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            // Store new image
            $validated['image'] = $request->file('image')->store('categories', 'public');
        } else {
            // Jika tidak ada file baru, pertahankan gambar lama
            unset($validated['image']);
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Check if category has books
        if ($category->books()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete category that has books associated with it.']);
        }

        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function toggle(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        return back()->with('success', 'Category status updated successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        $categories = Category::whereIn('id', $request->ids)->get();

        // Check if any category has books
        foreach ($categories as $category) {
            if ($category->books()->count() > 0) {
                return back()->withErrors(['error' => 'Cannot delete categories that have books associated with them.']);
            }
        }

        // Delete images and categories
        foreach ($categories as $category) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
        }

        Category::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' categories deleted successfully.');
    }

    /**
     * Get categories by slug (for API/public)
     */
    public function getBySlug(Request $request)
    {
        $slug = $request->get('slug');

        if (!in_array($slug, ['eksakta', 'soshum', 'terapan', 'interdisipliner'])) {
            return response()->json(['error' => 'Invalid slug'], 400);
        }

        $categories = Category::active()
            ->where('slug', $slug)
            ->withCount(['publishedBooks as books_count'])
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Get all categories grouped by slug (for API/public)
     */
    public function getGroupedBySlug()
    {
        $categories = Category::getGroupedBySlug();
        return response()->json($categories);
    }

    /**
     * Get statistics dashboard
     */
    public function getStats()
    {
        $stats = [
            'total_categories' => Category::count(),
            'active_categories' => Category::active()->count(),
            'total_books' => Category::withCount('books')->get()->sum('books_count'),
            'by_slug' => Category::selectRaw('
                    slug,
                    COUNT(*) as categories_count,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
                ')
                ->groupBy('slug')
                ->get()
                ->keyBy('slug')
        ];

        return response()->json($stats);
    }

    /**
     * Get slug options for forms
     */
    private function getSlugOptions()
    {
        return [
            [
                'value' => 'eksakta',
                'label' => 'Ilmu Eksakta',
                'description' => 'Matematika, Fisika, Kimia, Biologi, dll'
            ],
            [
                'value' => 'soshum',
                'label' => 'Sosial Humaniora',
                'description' => 'Sosiologi, Psikologi, Ekonomi, Hukum, dll'
            ],
            [
                'value' => 'terapan',
                'label' => 'Ilmu Terapan',
                'description' => 'Kedokteran, Teknik, Pertanian, dll'
            ],
            [
                'value' => 'interdisipliner',
                'label' => 'Interdisipliner',
                'description' => 'Bioteknologi, Data Science, AI, dll'
            ]
        ];
    }
}
