<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['author', 'category'])
            ->where('is_published', true);

        // Filter by search term
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($authorQuery) use ($search) {
                        $authorQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $categoryParam = $request->input('category');
            $query->whereHas('category', function ($categoryQuery) use ($categoryParam) {
                // Check if the parameter is an ID (ULID format) or slug
                if (strlen($categoryParam) === 26 && ctype_alnum($categoryParam)) {
                    // Assume it's a ULID (26 characters alphanumeric)
                    $categoryQuery->where('id', $categoryParam);
                } else {
                    // Assume it's a slug
                    $categoryQuery->where('slug', $categoryParam);
                }
            });
        }

        // Filter by featured
        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Sort
        $sortBy = $request->input('sort', 'latest');
        switch ($sortBy) {
            case 'title':
                $query->orderBy('title');
                break;
            case 'author':
                $query->join('users', 'books.author_id', '=', 'users.id')
                    ->orderBy('users.name')
                    ->select('books.*');
                break;
            case 'price_low':
                $query->orderBy('price');
                break;
            case 'price_high':
                $query->orderByDesc('price');
                break;
            case 'featured':
                $query->orderByDesc('is_featured')->orderByDesc('created_at');
                break;
            case 'latest':
            default:
                $query->orderByDesc('publication_date')->orderByDesc('created_at');
                break;
        }

        $books = $query->paginate(12)->withQueryString();

        // Transform cover_image to full URL
        $books->getCollection()->transform(function ($book) {
            if ($book->cover_image) {
                // Check if cover_image is already a full URL (external)
                if (filter_var($book->cover_image, FILTER_VALIDATE_URL)) {
                    // Keep external URL as is
                    $book->cover_image = $book->cover_image;
                } else {
                    // Convert local path to full URL
                    $book->cover_image = asset('storage/' . $book->cover_image);
                }
            }
            return $book;
        });

        // Get categories for filters
        $categories = Category::where('is_active', true)
            ->withCount(['books' => function ($query) {
                $query->where('is_published', true);
            }])
            ->having('books_count', '>', 0)
            ->orderBy('name')
            ->get();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'featured', 'min_price', 'max_price', 'sort']),
        ]);
    }

    public function show(Book $book)
    {
        // Only show published books
        if (!$book->is_published) {
            abort(404);
        }

        $book->load(['author', 'category', 'chapters' => function ($query) {
            $query->where('is_published', true)->orderBy('chapter_number');
        }]);

        // Check if user has purchased this book
        $userHasPurchased = false;
        $userPurchasedChapters = [];
        if (Auth::check()) {
            $userHasPurchased = Auth::user()->hasPurchasedBook($book->id);
            $userPurchasedChapters = Auth::user()->getPurchasedChapterIds($book->id);
        }        // Get related books from same category and author
        $relatedBooks = Book::with(['author', 'category'])
            ->where('is_published', true)
            ->where('id', '!=', $book->id)
            ->where(function ($query) use ($book) {
                $query->where('category_id', $book->category_id)
                    ->orWhere('author_id', $book->author_id);
            })
            ->orderByRaw('CASE WHEN category_id = ? THEN 1 ELSE 2 END', [$book->category_id])
            ->orderByRaw('CASE WHEN author_id = ? THEN 1 ELSE 2 END', [$book->author_id])
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->limit(8)
            ->get();

        // Transform cover_image for book and related books
        if ($book->cover_image) {
            if (filter_var($book->cover_image, FILTER_VALIDATE_URL)) {
                // Keep external URL as is
                $book->cover_image = $book->cover_image;
            } else {
                // Convert local path to full URL
                $book->cover_image = asset('storage/' . $book->cover_image);
            }
        }

        $relatedBooks->transform(function ($relatedBook) {
            if ($relatedBook->cover_image) {
                if (filter_var($relatedBook->cover_image, FILTER_VALIDATE_URL)) {
                    $relatedBook->cover_image = $relatedBook->cover_image;
                } else {
                    $relatedBook->cover_image = asset('storage/' . $relatedBook->cover_image);
                }
            }
            return $relatedBook;
        });

        return Inertia::render('books/show', [
            'book' => $book,
            'relatedBooks' => $relatedBooks,
            'userHasPurchased' => $userHasPurchased,
            'userPurchasedChapters' => $userPurchasedChapters,
        ]);
    }

    public function readChapter(Book $book, $chapterId)
    {
        // Only show published books
        if (!$book->is_published) {
            abort(404);
        }

        // Find the chapter
        $chapter = $book->chapters()->where('id', $chapterId)
            ->where('is_published', true)
            ->firstOrFail();

        // Check if user can access this chapter
        $canAccess = false;

        if ($chapter->is_free) {
            $canAccess = true;
        } elseif (Auth::check()) {
            // Check if user has purchased the book or the specific chapter
            $user = Auth::user();
            $canAccess = $user->hasPurchasedBook($book->id) || $user->hasPurchasedChapter($chapter->id);
        }

        if (!$canAccess) {
            return redirect()->route('books.show', $book)->with('error', 'Anda perlu membeli buku atau chapter ini untuk mengaksesnya.');
        }

        $book->load(['author', 'category']);

        // Get previous and next chapters
        $previousChapter = $book->chapters()
            ->where('is_published', true)
            ->where('chapter_number', '<', $chapter->chapter_number)
            ->orderByDesc('chapter_number')
            ->first();

        $nextChapter = $book->chapters()
            ->where('is_published', true)
            ->where('chapter_number', '>', $chapter->chapter_number)
            ->orderBy('chapter_number')
            ->first();

        return Inertia::render('books/reader', [
            'book' => $book,
            'chapter' => $chapter,
            'previousChapter' => $previousChapter,
            'nextChapter' => $nextChapter,
        ]);
    }
}
