<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Str;

class Book extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'author_id',
        'category_id',
        'isbn',
        'publication_date',
        'price',
        'discount_percentage',
        'is_published',
        'is_featured',
        'total_chapters',
        'reading_time_minutes',
        'language',
        'tags',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'publication_date' => 'date',
        'tags' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($book) {
            if (empty($book->slug)) {
                $book->slug = Str::slug($book->title);
            }
        });

        static::updating(function ($book) {
            if ($book->isDirty('title') && !$book->isDirty('slug')) {
                $book->slug = Str::slug($book->title);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('chapter_number');
    }

    public function publishedChapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->where('is_published', true)->orderBy('chapter_number');
    }

    public function freeChapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->where('is_free', true)->where('is_published', true)->orderBy('chapter_number');
    }

    public function paidChapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->where('is_free', false)->where('is_published', true)->orderBy('chapter_number');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    public function scopeWithChaptersCount($query)
    {
        return $query->withCount('chapters');
    }

    public function scopeWithPublishedChaptersCount($query)
    {
        return $query->withCount('publishedChapters');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getDiscountedPriceAttribute()
    {
        if ($this->discount_percentage > 0) {
            return $this->price - ($this->price * $this->discount_percentage / 100);
        }
        return $this->price;
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getFormattedDiscountedPriceAttribute()
    {
        return 'Rp ' . number_format($this->discounted_price, 0, ',', '.');
    }

    public function getCoverImageUrlAttribute()
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return asset('assets/images/default-book-cover.png');
    }

    public function getReadingTimeFormattedAttribute()
    {
        if ($this->reading_time_minutes < 60) {
            return $this->reading_time_minutes . ' menit';
        }

        $hours = floor($this->reading_time_minutes / 60);
        $minutes = $this->reading_time_minutes % 60;

        if ($minutes > 0) {
            return $hours . ' jam ' . $minutes . ' menit';
        }

        return $hours . ' jam';
    }

    public function getActualChapterCountAttribute()
    {
        return $this->chapters()->count();
    }

    public function getPublishedChapterCountAttribute()
    {
        return $this->publishedChapters()->count();
    }

    public function getFreeChapterCountAttribute()
    {
        return $this->freeChapters()->count();
    }

    public function getPaidChapterCountAttribute()
    {
        return $this->paidChapters()->count();
    }

    public function getTotalReadingTimeAttribute()
    {
        return $this->chapters()->sum('reading_time_minutes');
    }

    public function updateTotalChapters()
    {
        $this->update(['total_chapters' => $this->actual_chapter_count]);
    }

    public function updateReadingTime()
    {
        $this->update(['reading_time_minutes' => $this->total_reading_time]);
    }

    public function hasFreePreviews()
    {
        return $this->freeChapters()->exists();
    }

    public function getFirstChapter()
    {
        return $this->chapters()->orderBy('chapter_number')->first();
    }

    public function getLastChapter()
    {
        return $this->chapters()->orderBy('chapter_number', 'desc')->first();
    }

    /**
     * Review relationships
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    /**
     * Reading Progress through chapters
     */
    public function readingProgress(): HasManyThrough
    {
        return $this->hasManyThrough(ReadingProgress::class, Chapter::class);
    }

    /**
     * Review methods
     */
    public function getAverageRating(): float
    {
        return Review::getAverageRating($this->id);
    }

    public function getFormattedAverageRating(): string
    {
        return Review::getFormattedAverageRating($this->id);
    }

    public function getTotalReviews(): int
    {
        return Review::getTotalReviews($this->id);
    }

    public function getRatingDistribution(): array
    {
        return Review::getRatingDistribution($this->id);
    }

    public function getRatingPercentages(): array
    {
        return Review::getRatingPercentages($this->id);
    }

    public function getReviewStats(): array
    {
        return [
            'average_rating' => $this->getAverageRating(),
            'formatted_average_rating' => $this->getFormattedAverageRating(),
            'total_reviews' => $this->getTotalReviews(),
            'rating_distribution' => $this->getRatingDistribution(),
            'rating_percentages' => $this->getRatingPercentages(),
        ];
    }

    /**
     * Reading Progress methods
     */
    public function getCompletionRateForUser($userId): float
    {
        return ReadingProgress::getBookCompletionRate($userId, $this->id);
    }

    public function getUserProgress($userId)
    {
        return ReadingProgress::getUserBookProgress($userId, $this->id);
    }

    public function getReadingStatistics(): array
    {
        $totalChapters = $this->chapters()->count();
        $totalReaders = $this->readingProgress()
            ->distinct('user_id')
            ->count('user_id');

        $completedReaders = $this->readingProgress()
            ->selectRaw('user_id, COUNT(*) as completed_chapters')
            ->where('progress_percentage', 100)
            ->groupBy('user_id')
            ->having('completed_chapters', '=', $totalChapters)
            ->count();

        $averageCompletionRate = $this->readingProgress()
            ->avg('progress_percentage') ?? 0;

        return [
            'total_readers' => $totalReaders,
            'completed_readers' => $completedReaders,
            'average_completion_rate' => round($averageCompletionRate, 2),
            'completion_percentage' => $totalReaders > 0 ? round(($completedReaders / $totalReaders) * 100, 2) : 0,
        ];
    }

    public function getMostReadChapters($limit = 5)
    {
        return $this->chapters()
            ->withCount(['readingProgress as readers_count'])
            ->orderBy('readers_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getPopularityScore(): float
    {
        $reviewsWeight = 0.4;
        $readersWeight = 0.4;
        $completionWeight = 0.2;

        $reviews = $this->getTotalReviews();
        $averageRating = $this->getAverageRating();
        $readingStats = $this->getReadingStatistics();

        $reviewScore = ($reviews * $averageRating) / 5; // Normalize to 0-reviews scale
        $readerScore = $readingStats['total_readers'];
        $completionScore = $readingStats['completion_percentage'];

        return ($reviewScore * $reviewsWeight) +
            ($readerScore * $readersWeight) +
            ($completionScore * $completionWeight);
    }
}
