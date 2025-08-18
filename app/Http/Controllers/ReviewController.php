<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display user's reviews
     */
    public function index(): Response
    {
        $user = Auth::user();

        $reviews = Review::with(['book.author', 'book.category'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'is_approved' => $review->is_approved,
                    'created_at' => $review->created_at,
                    'updated_at' => $review->updated_at,
                    'book' => [
                        'id' => $review->book->id,
                        'title' => $review->book->title,
                        'slug' => $review->book->slug,
                        'cover_image' => $review->book->cover_image,
                        'author' => $review->book->author ? [
                            'id' => $review->book->author->id,
                            'name' => $review->book->author->name,
                        ] : null,
                        'category' => $review->book->category ? [
                            'id' => $review->book->category->id,
                            'name' => $review->book->category->name,
                        ] : null,
                    ],
                    'rating_text' => $review->rating_text,
                    'created_at_formatted' => $review->created_at_formatted,
                    'created_at_human' => $review->created_at_human,
                ];
            });

        return Inertia::render('user/reviews/index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Display reviews for a specific book (public endpoint)
     */
    public function bookReviews(Request $request, Book $book)
    {
        $reviews = Review::with('user')
            ->where('book_id', $book->id)
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'created_at' => $review->created_at,
                    'rating_text' => $review->rating_text,
                    'created_at_formatted' => $review->created_at_formatted,
                    'created_at_human' => $review->created_at_human,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'initials' => $review->user->initials,
                        'avatar_url' => $review->user->avatar_url,
                    ],
                ];
            });

        $stats = [
            'average_rating' => Review::getFormattedAverageRating($book->id),
            'total_reviews' => Review::getTotalReviews($book->id),
            'rating_distribution' => Review::getRatingDistribution($book->id),
            'rating_percentages' => Review::getRatingPercentages($book->id),
        ];

        $userReview = null;
        if (Auth::check()) {
            $userReview = Review::getUserReview(Auth::id(), $book->id);
            if ($userReview) {
                $userReview = [
                    'id' => $userReview->id,
                    'rating' => $userReview->rating,
                    'review_text' => $userReview->review_text,
                    'is_approved' => $userReview->is_approved,
                    'created_at' => $userReview->created_at,
                    'rating_text' => $userReview->rating_text,
                ];
            }
        }

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
            'user_review' => $userReview,
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request, Book $book)
    {
        $user = Auth::user();

        // Check if user has purchased the book or is admin
        if (!$user->hasPurchasedBook($book->id) && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus membeli buku ini untuk memberikan review'
            ], 403);
        }

        // Check if user already reviewed this book
        if (Review::userHasReviewed($user->id, $book->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan review untuk buku ini'
            ], 422);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'user_id' => $user->id,
            'book_id' => $book->id,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
            'is_approved' => true, // Auto approve, bisa diubah sesuai kebutuhan
        ]);

        $review->load('user');

        // Format response
        $reviewData = [
            'id' => $review->id,
            'rating' => $review->rating,
            'review_text' => $review->review_text,
            'is_approved' => $review->is_approved,
            'created_at' => $review->created_at,
            'rating_text' => $review->rating_text,
            'created_at_formatted' => $review->created_at_formatted,
            'user' => [
                'id' => $review->user->id,
                'name' => $review->user->name,
                'initials' => $review->user->initials,
            ],
        ];

        return response()->json([
            'success' => true,
            'review' => $reviewData,
            'message' => 'Review berhasil ditambahkan'
        ]);
    }

    /**
     * Update an existing review
     */
    public function update(Request $request, Review $review)
    {
        $user = Auth::user();

        // Check if user owns this review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat mengedit review ini'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $request->rating,
            'review_text' => $request->review_text,
            // Reset approval status jika diubah (opsional)
            // 'is_approved' => false,
        ]);

        $review->load('user');

        // Format response
        $reviewData = [
            'id' => $review->id,
            'rating' => $review->rating,
            'review_text' => $review->review_text,
            'is_approved' => $review->is_approved,
            'created_at' => $review->created_at,
            'updated_at' => $review->updated_at,
            'rating_text' => $review->rating_text,
            'created_at_formatted' => $review->created_at_formatted,
            'user' => [
                'id' => $review->user->id,
                'name' => $review->user->name,
                'initials' => $review->user->initials,
            ],
        ];

        return response()->json([
            'success' => true,
            'review' => $reviewData,
            'message' => 'Review berhasil diperbarui'
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review)
    {
        $user = Auth::user();

        // Check if user owns this review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus review ini'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil dihapus'
        ]);
    }

    /**
     * Get user's review statistics
     */
    public function userStats()
    {
        $user = Auth::user();

        $totalReviews = Review::where('user_id', $user->id)->count();
        $approvedReviews = Review::where('user_id', $user->id)
            ->where('is_approved', true)
            ->count();
        $averageRating = Review::where('user_id', $user->id)->avg('rating');
        $reviewsWithText = Review::where('user_id', $user->id)
            ->whereNotNull('review_text')
            ->where('review_text', '!=', '')
            ->count();

        // Rating distribution
        $ratingDistribution = Review::where('user_id', $user->id)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        // Fill missing ratings with 0
        for ($i = 1; $i <= 5; $i++) {
            if (!isset($ratingDistribution[$i])) {
                $ratingDistribution[$i] = 0;
            }
        }
        ksort($ratingDistribution);

        $stats = [
            'total_reviews' => $totalReviews,
            'approved_reviews' => $approvedReviews,
            'pending_reviews' => $totalReviews - $approvedReviews,
            'average_rating_given' => $averageRating ? round($averageRating, 2) : 0,
            'reviews_with_text' => $reviewsWithText,
            'rating_distribution' => $ratingDistribution,
        ];

        return response()->json($stats);
    }

    /**
     * Get book review statistics (public endpoint)
     */
    public function bookStats(Book $book)
    {
        $stats = [
            'average_rating' => Review::getFormattedAverageRating($book->id),
            'total_reviews' => Review::getTotalReviews($book->id),
            'rating_distribution' => Review::getRatingDistribution($book->id),
            'rating_percentages' => Review::getRatingPercentages($book->id),
        ];

        return response()->json($stats);
    }

    /**
     * Check if user can review a book
     */
    public function canReview(Book $book)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'can_review' => false,
                'reason' => 'not_authenticated'
            ]);
        }

        // Check if user has purchased the book
        if (!$user->hasPurchasedBook($book->id) && !$user->isAdmin()) {
            return response()->json([
                'can_review' => false,
                'reason' => 'not_purchased'
            ]);
        }

        // Check if user already reviewed
        if (Review::userHasReviewed($user->id, $book->id)) {
            return response()->json([
                'can_review' => false,
                'reason' => 'already_reviewed'
            ]);
        }

        return response()->json([
            'can_review' => true,
            'reason' => null
        ]);
    }

    /**
     * Get user's review for a specific book
     */
    public function getUserBookReview(Book $book)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['review' => null]);
        }

        $review = Review::getUserReview($user->id, $book->id);

        if (!$review) {
            return response()->json(['review' => null]);
        }

        return response()->json([
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'review_text' => $review->review_text,
                'is_approved' => $review->is_approved,
                'created_at' => $review->created_at,
                'rating_text' => $review->rating_text,
            ]
        ]);
    }

    /**
     * Get recent reviews from user
     */
    public function recentReviews(int $limit = 5)
    {
        $user = Auth::user();

        $reviews = Review::with(['book'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text ? \Str::limit($review->review_text, 100) : null,
                    'is_approved' => $review->is_approved,
                    'created_at' => $review->created_at,
                    'book' => [
                        'id' => $review->book->id,
                        'title' => $review->book->title,
                        'slug' => $review->book->slug,
                        'cover_image' => $review->book->cover_image,
                    ],
                ];
            });

        return response()->json(['reviews' => $reviews]);
    }
}
