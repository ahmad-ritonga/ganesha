<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display all reviews for admin
     */
    public function index(Request $request): Response
    {
        $query = Review::with(['user', 'book.author']);

        // Apply filters
        if ($request->filled('status')) {
            if ($request->status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approved', false);
            }
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('book_id')) {
            $query->where('book_id', $request->book_id);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                    ->orWhereHas('book', function ($bookQuery) use ($search) {
                        $bookQuery->where('title', 'like', "%{$search}%");
                    })
                    ->orWhere('review_text', 'like', "%{$search}%");
            });
        }

        // Sort by latest first
        $query->orderBy('created_at', 'desc');

        $reviews = $query->paginate(15)->through(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'review_text' => $review->review_text,
                'is_approved' => $review->is_approved,
                'created_at' => $review->created_at,
                'updated_at' => $review->updated_at,
                'rating_text' => $review->rating_text,
                'rating_stars' => $review->rating_stars,
                'created_at_formatted' => $review->created_at_formatted,
                'created_at_human' => $review->created_at_human,
                'has_text' => $review->has_text,
                'short_review' => $review->short_review,
                'user' => [
                    'id' => $review->user->id,
                    'name' => $review->user->name,
                    'email' => $review->user->email,
                    'avatar_url' => $review->user->avatar_url,
                    'initials' => $review->user->initials,
                ],
                'book' => [
                    'id' => $review->book->id,
                    'title' => $review->book->title,
                    'slug' => $review->book->slug,
                    'cover_image' => $review->book->cover_image,
                    'author' => $review->book->author ? [
                        'id' => $review->book->author->id,
                        'name' => $review->book->author->name,
                    ] : null,
                ],
            ];
        });

        // Calculate statistics
        $stats = [
            'total_reviews' => Review::count(),
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'approved_reviews' => Review::where('is_approved', true)->count(),
            'average_rating' => round(Review::where('is_approved', true)->avg('rating') ?: 0, 2),
            'reviews_today' => Review::whereDate('created_at', today())->count(),
            'reviews_this_week' => Review::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'reviews_this_month' => Review::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        // Get filter options
        $books = Book::select('id', 'title')->orderBy('title')->get();
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['status', 'rating', 'book_id', 'user_id', 'search']),
            'books' => $books,
            'users' => $users,
        ]);
    }

    /**
     * Show review details
     */
    public function show(Review $review): Response
    {
        $review->load(['user', 'book.author', 'book.category']);

        $reviewData = [
            'id' => $review->id,
            'rating' => $review->rating,
            'review_text' => $review->review_text,
            'is_approved' => $review->is_approved,
            'created_at' => $review->created_at,
            'updated_at' => $review->updated_at,
            'rating_text' => $review->rating_text,
            'rating_stars' => $review->rating_stars,
            'created_at_formatted' => $review->created_at_formatted,
            'created_at_human' => $review->created_at_human,
            'has_text' => $review->has_text,
            'user' => [
                'id' => $review->user->id,
                'name' => $review->user->name,
                'email' => $review->user->email,
                'avatar_url' => $review->user->avatar_url,
                'role' => $review->user->role,
                'created_at' => $review->user->created_at,
            ],
            'book' => [
                'id' => $review->book->id,
                'title' => $review->book->title,
                'slug' => $review->book->slug,
                'description' => $review->book->description,
                'cover_image' => $review->book->cover_image,
                'price' => $review->book->price,
                'formatted_price' => $review->book->formatted_price,
                'author' => $review->book->author ? [
                    'id' => $review->book->author->id,
                    'name' => $review->book->author->name,
                ] : null,
                'category' => $review->book->category ? [
                    'id' => $review->book->category->id,
                    'name' => $review->book->category->name,
                ] : null,
            ],
        ];

        // Get related reviews from same user
        $userReviews = Review::with('book')
            ->where('user_id', $review->user_id)
            ->where('id', '!=', $review->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($rel) {
                return [
                    'id' => $rel->id,
                    'rating' => $rel->rating,
                    'review_text' => $rel->review_text ? \Str::limit($rel->review_text, 100) : null,
                    'is_approved' => $rel->is_approved,
                    'created_at' => $rel->created_at,
                    'book' => [
                        'id' => $rel->book->id,
                        'title' => $rel->book->title,
                    ],
                ];
            });

        // Get other reviews for same book
        $bookReviews = Review::with('user')
            ->where('book_id', $review->book_id)
            ->where('id', '!=', $review->id)
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($rel) {
                return [
                    'id' => $rel->id,
                    'rating' => $rel->rating,
                    'review_text' => $rel->review_text ? \Str::limit($rel->review_text, 100) : null,
                    'created_at' => $rel->created_at,
                    'user' => [
                        'id' => $rel->user->id,
                        'name' => $rel->user->name,
                    ],
                ];
            });

        return Inertia::render('admin/reviews/show', [
            'review' => $reviewData,
            'user_reviews' => $userReviews,
            'book_reviews' => $bookReviews,
        ]);
    }

    /**
     * Approve a review
     */
    public function approve(Review $review)
    {
        $review->update(['is_approved' => true]);

        return redirect()->back()->with('success', 'Review berhasil disetujui');
    }

    /**
     * Reject a review
     */
    public function reject(Review $review)
    {
        $review->update(['is_approved' => false]);

        return redirect()->back()->with('success', 'Review berhasil ditolak');
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->back()->with('success', 'Review berhasil dihapus');
    }

    /**
     * Bulk approve reviews
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:reviews,id',
        ]);

        $count = Review::whereIn('id', $request->ids)->update(['is_approved' => true]);

        return redirect()->back()->with('success', "{$count} review berhasil disetujui");
    }

    /**
     * Bulk reject reviews
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:reviews,id',
        ]);

        $count = Review::whereIn('id', $request->ids)->update(['is_approved' => false]);

        return redirect()->back()->with('success', "{$count} review berhasil ditolak");
    }

    /**
     * Bulk delete reviews
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:reviews,id',
        ]);

        $count = Review::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', "{$count} review berhasil dihapus");
    }

    /**
     * Get review analytics data
     */
    public function analytics(Request $request)
    {
        $timeRange = $request->get('range', '30d');

        // Determine date range
        $startDate = match ($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '1y' => now()->subYear(),
            default => now()->subDays(30),
        };

        // Reviews over time
        $reviewsOverTime = Review::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Rating distribution
        $ratingDistribution = Review::selectRaw('rating, COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->where('is_approved', true)
            ->groupBy('rating')
            ->orderBy('rating')
            ->get();

        // Top rated books
        $topRatedBooks = DB::table('reviews')
            ->join('books', 'reviews.book_id', '=', 'books.id')
            ->select(
                'books.id',
                'books.title',
                DB::raw('AVG(reviews.rating) as avg_rating'),
                DB::raw('COUNT(reviews.id) as review_count')
            )
            ->where('reviews.is_approved', true)
            ->where('reviews.created_at', '>=', $startDate)
            ->groupBy('books.id', 'books.title')
            ->having('review_count', '>=', 3) // Minimum 3 reviews
            ->orderBy('avg_rating', 'desc')
            ->limit(10)
            ->get();

        // Most active reviewers
        $activeReviewers = DB::table('reviews')
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(reviews.id) as review_count'),
                DB::raw('AVG(reviews.rating) as avg_rating')
            )
            ->where('reviews.created_at', '>=', $startDate)
            ->groupBy('users.id', 'users.name')
            ->orderBy('review_count', 'desc')
            ->limit(10)
            ->get();

        // Review approval rate
        $approvalStats = Review::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN is_approved = 0 THEN 1 ELSE 0 END) as pending
            ')
            ->where('created_at', '>=', $startDate)
            ->first();

        return response()->json([
            'reviews_over_time' => $reviewsOverTime,
            'rating_distribution' => $ratingDistribution,
            'top_rated_books' => $topRatedBooks,
            'active_reviewers' => $activeReviewers,
            'approval_stats' => $approvalStats,
            'time_range' => $timeRange,
        ]);
    }

    /**
     * Export reviews data
     */
    public function export(Request $request)
    {
        $query = Review::with(['user', 'book']);

        // Apply same filters as index
        if ($request->filled('status')) {
            if ($request->status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approved', false);
            }
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('book_id')) {
            $query->where('book_id', $request->book_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                    ->orWhereHas('book', function ($bookQuery) use ($search) {
                        $bookQuery->where('title', 'like', "%{$search}%");
                    })
                    ->orWhere('review_text', 'like', "%{$search}%");
            });
        }

        $reviews = $query->orderBy('created_at', 'desc')->get();

        // Prepare CSV data
        $csvData = [];
        $csvData[] = [
            'ID',
            'User',
            'Email',
            'Book',
            'Rating',
            'Review Text',
            'Status',
            'Created At',
            'Updated At'
        ];

        foreach ($reviews as $review) {
            $csvData[] = [
                $review->id,
                $review->user->name,
                $review->user->email,
                $review->book->title,
                $review->rating,
                $review->review_text ?: '',
                $review->is_approved ? 'Approved' : 'Pending',
                $review->created_at->format('Y-m-d H:i:s'),
                $review->updated_at->format('Y-m-d H:i:s'),
            ];
        }

        // Generate CSV content
        $output = fopen('php://temp', 'r+');
        foreach ($csvData as $row) {
            fputcsv($output, $row);
        }
        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        // Return CSV download
        $filename = 'reviews_export_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    /**
     * Get review moderation queue
     */
    public function moderationQueue()
    {
        $pendingReviews = Review::with(['user', 'book'])
            ->where('is_approved', false)
            ->orderBy('created_at', 'asc')
            ->limit(50)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'created_at' => $review->created_at,
                    'rating_text' => $review->rating_text,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'email' => $review->user->email,
                    ],
                    'book' => [
                        'id' => $review->book->id,
                        'title' => $review->book->title,
                    ],
                ];
            });

        return response()->json([
            'pending_reviews' => $pendingReviews,
            'count' => $pendingReviews->count(),
        ]);
    }

    /**
     * Get review trends data
     */
    public function trends(Request $request)
    {
        $timeRange = $request->get('range', '30d');

        $startDate = match ($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '1y' => now()->subYear(),
            default => now()->subDays(30),
        };

        // Daily review counts
        $dailyReviews = Review::selectRaw('
                DATE(created_at) as date,
                COUNT(*) as total_reviews,
                AVG(rating) as avg_rating,
                SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved_reviews
            ')
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Category performance
        $categoryPerformance = DB::table('reviews')
            ->join('books', 'reviews.book_id', '=', 'books.id')
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->select(
                'categories.name as category_name',
                DB::raw('COUNT(reviews.id) as review_count'),
                DB::raw('AVG(reviews.rating) as avg_rating')
            )
            ->where('reviews.created_at', '>=', $startDate)
            ->where('reviews.is_approved', true)
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('review_count', 'desc')
            ->get();

        // User engagement levels
        $userEngagement = DB::table('reviews')
            ->selectRaw('
                user_id,
                COUNT(*) as review_count,
                CASE 
                    WHEN COUNT(*) >= 10 THEN "High"
                    WHEN COUNT(*) >= 5 THEN "Medium"
                    ELSE "Low"
                END as engagement_level
            ')
            ->where('created_at', '>=', $startDate)
            ->groupBy('user_id')
            ->get()
            ->groupBy('engagement_level')
            ->map(function ($users) {
                return $users->count();
            });

        return response()->json([
            'daily_reviews' => $dailyReviews,
            'category_performance' => $categoryPerformance,
            'user_engagement' => $userEngagement,
            'time_range' => $timeRange,
        ]);
    }

    /**
     * Get review content analysis
     */
    public function contentAnalysis()
    {
        // Review length analysis
        $reviewLengths = Review::selectRaw('
                CASE 
                    WHEN CHAR_LENGTH(review_text) = 0 OR review_text IS NULL THEN "No Text"
                    WHEN CHAR_LENGTH(review_text) <= 50 THEN "Short"
                    WHEN CHAR_LENGTH(review_text) <= 200 THEN "Medium"
                    ELSE "Long"
                END as length_category,
                COUNT(*) as count
            ')
            ->groupBy('length_category')
            ->get();

        // Most common words in reviews (simplified version)
        $reviewsWithText = Review::whereNotNull('review_text')
            ->where('review_text', '!=', '')
            ->where('is_approved', true)
            ->pluck('review_text');

        // Basic word frequency (you might want to use a more sophisticated NLP library)
        $allWords = [];
        foreach ($reviewsWithText as $text) {
            $words = str_word_count(strtolower($text), 1);
            foreach ($words as $word) {
                if (strlen($word) > 3) { // Filter out short words
                    $allWords[] = $word;
                }
            }
        }
        $wordFrequency = array_count_values($allWords);
        arsort($wordFrequency);
        $topWords = array_slice($wordFrequency, 0, 20, true);

        // Sentiment analysis (basic version based on rating)
        $sentimentAnalysis = Review::selectRaw('
                CASE 
                    WHEN rating >= 4 THEN "Positive"
                    WHEN rating = 3 THEN "Neutral"
                    ELSE "Negative"
                END as sentiment,
                COUNT(*) as count
            ')
            ->where('is_approved', true)
            ->groupBy('sentiment')
            ->get();

        return response()->json([
            'review_lengths' => $reviewLengths,
            'top_words' => $topWords,
            'sentiment_analysis' => $sentimentAnalysis,
        ]);
    }

    /**
     * Auto-moderate reviews based on criteria
     */
    public function autoModerate(Request $request)
    {
        $request->validate([
            'criteria' => 'required|array',
            'criteria.min_rating' => 'nullable|integer|min:1|max:5',
            'criteria.max_rating' => 'nullable|integer|min:1|max:5',
            'criteria.min_length' => 'nullable|integer|min:0',
            'criteria.auto_approve_verified_users' => 'boolean',
        ]);

        $criteria = $request->criteria;
        $query = Review::where('is_approved', false);

        // Apply auto-moderation rules
        $approvedCount = 0;
        $rejectedCount = 0;

        $pendingReviews = $query->get();

        foreach ($pendingReviews as $review) {
            $shouldApprove = true;
            $shouldReject = false;

            // Check minimum rating
            if (isset($criteria['min_rating']) && $review->rating < $criteria['min_rating']) {
                $shouldReject = true;
            }

            // Check maximum rating (suspicious if too high)
            if (isset($criteria['max_rating']) && $review->rating > $criteria['max_rating']) {
                $shouldReject = true;
            }

            // Check minimum length
            if (isset($criteria['min_length']) && strlen($review->review_text) < $criteria['min_length']) {
                $shouldApprove = false;
            }

            // Auto-approve verified users
            if ($criteria['auto_approve_verified_users'] && $review->user->email_verified_at) {
                $shouldApprove = true;
                $shouldReject = false;
            }

            // Apply moderation decision
            if ($shouldReject) {
                $review->update(['is_approved' => false]);
                $rejectedCount++;
            } elseif ($shouldApprove) {
                $review->update(['is_approved' => true]);
                $approvedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'approved_count' => $approvedCount,
            'rejected_count' => $rejectedCount,
            'message' => "Auto-moderation completed: {$approvedCount} approved, {$rejectedCount} rejected"
        ]);
    }

    /**
     * Get detailed review statistics for dashboard
     */
    public function dashboardStats()
    {
        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        $stats = [
            'total_reviews' => Review::count(),
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'approved_reviews' => Review::where('is_approved', true)->count(),
            'today_reviews' => Review::where('created_at', '>=', $today)->count(),
            'week_reviews' => Review::where('created_at', '>=', $thisWeek)->count(),
            'month_reviews' => Review::where('created_at', '>=', $thisMonth)->count(),
            'average_rating' => round(Review::where('is_approved', true)->avg('rating') ?: 0, 2),
            'rating_distribution' => Review::where('is_approved', true)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->orderBy('rating')
                ->pluck('count', 'rating'),
            'recent_reviews' => Review::with(['user', 'book'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'review_text' => $review->review_text ? \Str::limit($review->review_text, 100) : null,
                        'is_approved' => $review->is_approved,
                        'created_at' => $review->created_at,
                        'user' => [
                            'name' => $review->user->name,
                        ],
                        'book' => [
                            'title' => $review->book->title,
                        ],
                    ];
                }),
        ];

        return response()->json($stats);
    }
}
