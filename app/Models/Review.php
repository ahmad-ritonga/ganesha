<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'user_id',
        'book_id',
        'rating',
        'review_text',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
    ];

    /**
     * Validation rules
     */
    public static $rules = [
        'rating' => 'required|integer|min:1|max:5',
        'review_text' => 'nullable|string|max:1000',
        'is_approved' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeForBook($query, $bookId)
    {
        return $query->where('book_id', $bookId);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeHighRating($query)
    {
        return $query->where('rating', '>=', 4);
    }

    public function scopeLowRating($query)
    {
        return $query->where('rating', '<=', 2);
    }

    public function scopeWithText($query)
    {
        return $query->whereNotNull('review_text')
            ->where('review_text', '!=', '');
    }

    public function scopeWithoutText($query)
    {
        return $query->whereNull('review_text')
            ->orWhere('review_text', '');
    }

    public function scopeRecentFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeOldestFirst($query)
    {
        return $query->orderBy('created_at', 'asc');
    }

    public function scopeTopRated($query)
    {
        return $query->orderBy('rating', 'desc');
    }

    /**
     * Accessors & Mutators
     */
    public function getRatingStarsAttribute(): string
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    public function getRatingTextAttribute(): string
    {
        $ratings = [
            1 => 'Sangat Buruk',
            2 => 'Buruk',
            3 => 'Cukup',
            4 => 'Bagus',
            5 => 'Sangat Bagus'
        ];

        return $ratings[$this->rating] ?? 'Unknown';
    }

    public function getHasTextAttribute(): bool
    {
        return !empty($this->review_text);
    }

    public function getShortReviewAttribute(): string
    {
        if (!$this->has_text) {
            return '';
        }

        return \Str::limit($this->review_text, 100);
    }

    public function getCreatedAtFormattedAttribute(): string
    {
        return $this->created_at->format('d M Y');
    }

    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    public function getReviewerNameAttribute(): string
    {
        return $this->user->name ?? 'Anonim';
    }

    public function getReviewerInitialsAttribute(): string
    {
        return $this->user?->initials ?? 'A';
    }

    /**
     * Static Methods
     */
    public static function getAverageRating($bookId): float
    {
        return static::approved()
            ->forBook($bookId)
            ->avg('rating') ?? 0;
    }

    public static function getFormattedAverageRating($bookId): string
    {
        $average = static::getAverageRating($bookId);
        return number_format($average, 1);
    }

    public static function getTotalReviews($bookId): int
    {
        return static::approved()->forBook($bookId)->count();
    }

    public static function getRatingDistribution($bookId): array
    {
        $distribution = [];

        for ($i = 1; $i <= 5; $i++) {
            $count = static::approved()
                ->forBook($bookId)
                ->byRating($i)
                ->count();
            $distribution[$i] = $count;
        }

        return $distribution;
    }

    public static function getRatingPercentages($bookId): array
    {
        $distribution = static::getRatingDistribution($bookId);
        $total = array_sum($distribution);

        if ($total === 0) {
            return array_fill_keys([1, 2, 3, 4, 5], 0);
        }

        $percentages = [];
        foreach ($distribution as $rating => $count) {
            $percentages[$rating] = round(($count / $total) * 100, 1);
        }

        return $percentages;
    }

    public static function userHasReviewed($userId, $bookId): bool
    {
        return static::where('user_id', $userId)
            ->where('book_id', $bookId)
            ->exists();
    }

    public static function getUserReview($userId, $bookId)
    {
        return static::where('user_id', $userId)
            ->where('book_id', $bookId)
            ->first();
    }

    public static function createOrUpdateReview($userId, $bookId, $rating, $reviewText = null): self
    {
        return static::updateOrCreate(
            [
                'user_id' => $userId,
                'book_id' => $bookId,
            ],
            [
                'rating' => $rating,
                'review_text' => $reviewText,
                'is_approved' => true, // Auto approve, bisa diubah sesuai kebutuhan
            ]
        );
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-approve reviews (bisa diubah sesuai kebutuhan)
        static::creating(function ($review) {
            if (!isset($review->is_approved)) {
                $review->is_approved = true;
            }
        });
    }
}
