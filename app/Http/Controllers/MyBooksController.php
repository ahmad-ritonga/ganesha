<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\UserPurchase;
use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MyBooksController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Get user's purchased books AND chapters with progress - using explicit relationships
        $bookPurchases = UserPurchase::where('user_id', $user->id)
            ->where('purchasable_type', 'book')
            ->active()
            ->with(['transaction'])
            ->orderBy('purchased_at', 'desc')
            ->get();

        $chapterPurchases = UserPurchase::where('user_id', $user->id)
            ->where('purchasable_type', 'chapter')
            ->active()
            ->with(['transaction'])
            ->orderBy('purchased_at', 'desc')
            ->get();

        // Log debug info
        Log::info('MyBooks Debug', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'book_purchases' => $bookPurchases->count(),
            'chapter_purchases' => $chapterPurchases->count(),
            'all_user_purchases_count' => UserPurchase::where('user_id', $user->id)->count(),
            'all_book_purchases_count' => UserPurchase::where('purchasable_type', 'book')->count(),
        ]);

        // If user has no purchases, but there are purchases in the system, 
        // and user is admin, show a sample for demo purposes
        if ($bookPurchases->isEmpty() && $user->role === 'admin') {
            $samplePurchases = UserPurchase::where('purchasable_type', 'book')
                ->active()
                ->with(['transaction'])
                ->orderBy('purchased_at', 'desc')
                ->take(3) // Show max 3 sample purchases
                ->get();

            if ($samplePurchases->isNotEmpty()) {
                Log::info('MyBooks: Showing sample purchases for admin', [
                    'user_id' => $user->id,
                    'sample_count' => $samplePurchases->count()
                ]);
                $bookPurchases = $samplePurchases;
            }
        }

        $processedBookPurchases = $bookPurchases->map(function ($purchase) use ($user) {
            // Get book directly from Book model
            $book = Book::with(['author', 'category', 'chapters' => function ($chapterQuery) {
                $chapterQuery->where('is_published', true);
            }])->find($purchase->purchasable_id);

            if (!$book) return null;            // Calculate reading progress using the loaded chapters
            $totalChapters = $book->chapters->count();
            $readChapters = ReadingProgress::where('user_id', $user->id)
                ->whereIn('chapter_id', $book->chapters->pluck('id'))
                ->where('progress_percentage', 100)
                ->count();

            $progressPercentage = $totalChapters > 0 ? round(($readChapters / $totalChapters) * 100) : 0;

            // Get last read date - optimized query
            $lastReadProgress = ReadingProgress::where('user_id', $user->id)
                ->whereIn('chapter_id', $book->chapters->pluck('id'))
                ->orderBy('updated_at', 'desc')
                ->first();

            return [
                'id' => $purchase->id,
                'book' => [
                    'id' => $book->id,
                    'title' => $book->title,
                    'slug' => $book->slug,
                    'description' => $book->description,
                    'cover_image' => $book->cover_image,
                    'author' => [
                        'id' => $book->author->id,
                        'name' => $book->author->name,
                        'email' => $book->author->email,
                    ],
                    'category' => [
                        'id' => $book->category->id,
                        'name' => $book->category->name,
                        'slug' => $book->category->slug,
                    ],
                    'price' => $book->price,
                    'discount_percentage' => $book->discount_percentage,
                    'is_featured' => $book->is_featured,
                    'total_chapters' => $totalChapters,
                    'reading_time_minutes' => $book->reading_time_minutes,
                    'language' => $book->language,
                    'tags' => $book->tags ?? [],
                ],
                'purchased_at' => $purchase->purchased_at->toISOString(),
                'expires_at' => $purchase->expires_at?->toISOString(),
                'progress_percentage' => $progressPercentage,
                'last_read_at' => $lastReadProgress?->updated_at->toISOString(),
                'chapters_read' => $readChapters,
            ];
        })
            ->filter()
            ->values();

        // Process chapter purchases - create pseudo book entries
        $processedChapterPurchases = $chapterPurchases->map(function ($purchase) use ($user) {
            // Get chapter and its book
            $chapter = \App\Models\Chapter::with(['book.author', 'book.category'])->find($purchase->purchasable_id);

            if (!$chapter || !$chapter->book) return null;

            $book = $chapter->book;

            // Calculate reading progress for this specific chapter
            $readingProgress = ReadingProgress::where('user_id', $user->id)
                ->where('chapter_id', $chapter->id)
                ->first();

            $progressPercentage = $readingProgress ? $readingProgress->progress_percentage : 0;

            return [
                'id' => $purchase->id,
                'is_chapter_purchase' => true, // Flag to distinguish from book purchases
                'chapter' => [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'chapter_number' => $chapter->chapter_number,
                ],
                'book' => [
                    'id' => $book->id,
                    'title' => $book->title,
                    'slug' => $book->slug,
                    'description' => $book->description,
                    'cover_image' => $book->cover_image,
                    'author' => [
                        'id' => $book->author->id,
                        'name' => $book->author->name,
                        'email' => $book->author->email,
                    ],
                    'category' => [
                        'id' => $book->category->id,
                        'name' => $book->category->name,
                        'slug' => $book->category->slug,
                    ],
                    'price' => $book->price,
                    'discount_percentage' => $book->discount_percentage,
                    'is_featured' => $book->is_featured,
                    'total_chapters' => $book->chapters()->where('is_published', true)->count(),
                    'reading_time_minutes' => $book->reading_time_minutes,
                    'language' => $book->language,
                    'tags' => $book->tags ?? [],
                ],
                'purchased_at' => $purchase->purchased_at->toISOString(),
                'expires_at' => $purchase->expires_at?->toISOString(),
                'progress_percentage' => $progressPercentage,
                'last_read_at' => $readingProgress?->updated_at->toISOString(),
                'chapters_read' => $progressPercentage === 100 ? 1 : 0,
            ];
        })
            ->filter()
            ->values();

        // Combine both book and chapter purchases, sorted by purchase date
        $allPurchases = $processedBookPurchases->concat($processedChapterPurchases)
            ->sortByDesc('purchased_at')
            ->values();

        // Calculate stats
        $totalBooks = $processedBookPurchases->count();
        $totalChapters = $processedChapterPurchases->count();
        $totalChaptersRead = ReadingProgress::where('user_id', $user->id)
            ->where('progress_percentage', 100)
            ->count();

        $booksCompleted = $processedBookPurchases->where('progress_percentage', 100)->count();
        $chaptersCompleted = $processedChapterPurchases->where('progress_percentage', 100)->count();

        // Calculate total reading time from completed chapters
        $totalReadingTime = ReadingProgress::where('user_id', $user->id)
            ->where('progress_percentage', 100)
            ->join('chapters', 'reading_progress.chapter_id', '=', 'chapters.id')
            ->sum('chapters.reading_time_minutes');

        $stats = [
            'total_books' => $totalBooks,
            'total_chapters' => $totalChapters,
            'total_chapters_read' => $totalChaptersRead,
            'total_reading_time' => $totalReadingTime ?: 0,
            'books_completed' => $booksCompleted,
            'chapters_completed' => $chaptersCompleted,
        ];

        return Inertia::render('my-books/index', [
            'purchases' => $allPurchases,
            'stats' => $stats,
        ]);
    }
}
