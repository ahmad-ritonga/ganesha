<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['author', 'category']);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%')
                    ->orWhere('isbn', 'like', '%' . $request->search . '%')
                    ->orWhereHas('author', function ($author) use ($request) {
                        $author->where('name', 'like', '%' . $request->search . '%');
                    });
            });
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('status')) {
            if ($request->status === 'published') {
                $query->where('is_published', true);
            } elseif ($request->status === 'draft') {
                $query->where('is_published', false);
            }
        }

        if ($request->has('featured')) {
            $query->where('is_featured', $request->featured === 'yes');
        }

        $books = $query->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()->get();

        return Inertia::render('admin/books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'featured']),
        ]);
    }

    public function create()
    {
        $categories = Category::active()->get();
        $authors = User::all();

        return Inertia::render('admin/books/create', [
            'categories' => $categories,
            'authors' => $authors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:books,slug',
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'author_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'isbn' => 'nullable|string|max:20|unique:books,isbn',
            'publication_date' => 'nullable|date',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'total_chapters' => 'nullable|integer|min:0',
            'reading_time_minutes' => 'nullable|integer|min:0',
            'language' => 'nullable|string|max:10',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if (!$validated['slug']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        }

        $validated['discount_percentage'] = $validated['discount_percentage'] ?? 0;
        $validated['is_published'] = $validated['is_published'] ?? false;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['language'] = $validated['language'] ?? 'id';

        Book::create($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book created successfully.');
    }

    public function show($id)
    {
        $book = Book::with(['author', 'category'])->findOrFail($id);

        return Inertia::render('admin/books/show', [
            'book' => $book,
        ]);
    }

    public function edit($id)
    {
        $book = Book::findOrFail($id);
        $categories = Category::active()->get();
        $authors = User::all();

        return Inertia::render('admin/books/edit', [
            'book' => $book,
            'categories' => $categories,
            'authors' => $authors,
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('books', 'slug')->ignore($book->id),
            ],
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'author_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'isbn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('books', 'isbn')->ignore($book->id),
            ],
            'publication_date' => 'nullable|date',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'total_chapters' => 'nullable|integer|min:0',
            'reading_time_minutes' => 'nullable|integer|min:0',
            'language' => 'nullable|string|max:10',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if (!$validated['slug']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle cover image upload - HANYA jika ada file baru yang diupload
        if ($request->hasFile('cover_image')) {
            // Delete old cover image if exists
            if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {
                Storage::disk('public')->delete($book->cover_image);
            }
            // Store new cover image
            $validated['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        } else {
            // Jika tidak ada file baru, pertahankan cover image lama
            // Hapus key 'cover_image' dari validated data agar tidak mengupdate field cover_image
            unset($validated['cover_image']);
        }

        $validated['discount_percentage'] = $validated['discount_percentage'] ?? 0;
        $validated['language'] = $validated['language'] ?? 'id';

        $book->update($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book updated successfully.');
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);

        if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {
            Storage::disk('public')->delete($book->cover_image);
        }

        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('success', 'Book deleted successfully.');
    }

    public function togglePublished($id)
    {
        $book = Book::findOrFail($id);
        $book->update(['is_published' => !$book->is_published]);

        return back()->with('success', 'Book publication status updated successfully.');
    }

    public function toggleFeatured($id)
    {
        $book = Book::findOrFail($id);
        $book->update(['is_featured' => !$book->is_featured]);

        return back()->with('success', 'Book featured status updated successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:books,id',
        ]);

        $books = Book::whereIn('id', $request->ids)->get();

        foreach ($books as $book) {
            if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {
                Storage::disk('public')->delete($book->cover_image);
            }
        }

        Book::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' books deleted successfully.');
    }

    public function bulkPublish(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:books,id',
        ]);

        Book::whereIn('id', $request->ids)->update(['is_published' => true]);

        return back()->with('success', count($request->ids) . ' books published successfully.');
    }

    public function bulkUnpublish(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:books,id',
        ]);

        Book::whereIn('id', $request->ids)->update(['is_published' => false]);

        return back()->with('success', count($request->ids) . ' books unpublished successfully.');
    }
}
