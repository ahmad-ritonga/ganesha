<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\CustomResetPasswordNotification;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUlids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'avatar_url',
        'initials'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get books authored by this user
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'author_id');
    }

    /**
     * Get user transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get user purchases
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(UserPurchase::class);
    }

    /**
     * Get active purchases
     */
    public function activePurchases(): HasMany
    {
        return $this->hasMany(UserPurchase::class)->active();
    }

    /**
     * Get purchased books
     */
    public function purchasedBooks(): HasMany
    {
        return $this->hasMany(UserPurchase::class)->where('purchasable_type', 'book')->active();
    }

    /**
     * Get purchased chapters
     */
    public function purchasedChapters(): HasMany
    {
        return $this->hasMany(UserPurchase::class)->where('purchasable_type', 'chapter')->active();
    }

    /**
     * Get only published books authored by this user
     */
    public function publishedBooks(): HasMany
    {
        return $this->hasMany(Book::class, 'author_id')->where('is_published', true);
    }

    /**
     * Scope to get authors (both admin and user roles)
     */
    public function scopeAuthors($query)
    {
        return $query->where('role', 'admin')->orWhere('role', 'user');
    }

    /**
     * Scope to get only admin users
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope to get only regular users
     */
    public function scopeUsers($query)
    {
        return $query->where('role', 'user');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is regular user
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Get the user's avatar URL
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar && Storage::disk('public')->exists($this->avatar)) {
            return asset('storage/' . $this->avatar);
        }

        // Default avatar using UI Avatars service with user's initials
        $initials = $this->getInitials();
        $backgroundColor = $this->role === 'admin' ? '10b981' : '06b6d4'; // Green for admin, cyan for user

        return "https://ui-avatars.com/api/?name=" . urlencode($initials) .
            "&color=ffffff&background={$backgroundColor}&size=200&font-size=0.6&rounded=true";
    }

    /**
     * Get user's initials for default avatar
     */
    public function getInitials(): string
    {
        $names = explode(' ', trim($this->name));
        $initials = '';

        foreach ($names as $name) {
            if (!empty($name)) {
                $initials .= strtoupper(substr($name, 0, 1));
                if (strlen($initials) >= 2) break; // Limit to 2 characters max
            }
        }

        return $initials ?: 'U';
    }

    /**
     * Get initials attribute
     */
    public function getInitialsAttribute(): string
    {
        return $this->getInitials();
    }

    // Purchase-related methods

    /**
     * Check if user has purchased an item
     */
    public function hasPurchased($itemType, $itemId): bool
    {
        return UserPurchase::hasUserPurchased($this->id, $itemType, $itemId);
    }

    /**
     * Get user purchase for an item
     */
    public function getPurchase($itemType, $itemId)
    {
        return UserPurchase::getUserPurchase($this->id, $itemType, $itemId);
    }

    /**
     * Check if user has purchased a book
     */
    public function hasPurchasedBook($bookId): bool
    {
        return $this->hasPurchased('book', $bookId);
    }

    /**
     * Check if user has purchased a chapter
     */
    public function hasPurchasedChapter($chapterId): bool
    {
        return $this->hasPurchased('chapter', $chapterId);
    }

    /**
     * Get list of purchased chapter IDs for a specific book
     */
    public function getPurchasedChapterIds($bookId): array
    {
        return UserPurchase::where('user_id', $this->id)
            ->where('purchasable_type', 'chapter')
            ->whereHas('chapter', function ($query) use ($bookId) {
                $query->where('book_id', $bookId);
            })
            ->pluck('purchasable_id')
            ->toArray();
    }

    /**
     * Check if user can access a chapter
     */
    public function canAccessChapter(Chapter $chapter): bool
    {
        // If chapter is free, allow access
        if ($chapter->is_free) {
            return true;
        }

        // If user purchased the entire book, allow access to all chapters
        if ($this->hasPurchasedBook($chapter->book_id)) {
            return true;
        }

        // If user purchased this specific chapter, allow access
        if ($this->hasPurchasedChapter($chapter->id)) {
            return true;
        }

        // If user is admin, allow access
        if ($this->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Check if user can access a book
     */
    public function canAccessBook(Book $book): bool
    {
        // If user purchased the book, allow access
        if ($this->hasPurchasedBook($book->id)) {
            return true;
        }

        // If user is admin, allow access
        if ($this->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Get purchased books with reading progress
     */
    public function getPurchasedBooksWithProgress()
    {
        return $this->purchasedBooks()
            ->with(['purchasable.chapters'])
            ->get()
            ->map(function ($purchase) {
                $book = $purchase->purchasable;
                $totalChapters = $book->chapters->count();
                $accessibleChapters = $book->chapters->filter(function ($chapter) {
                    return $this->canAccessChapter($chapter);
                })->count();

                return [
                    'purchase' => $purchase,
                    'book' => $book,
                    'progress' => $totalChapters > 0 ? ($accessibleChapters / $totalChapters) * 100 : 0,
                    'accessible_chapters' => $accessibleChapters,
                    'total_chapters' => $totalChapters,
                ];
            });
    }

    /**
     * Get pending transactions
     */
    public function getPendingTransactions()
    {
        return $this->transactions()->pending()->recentFirst()->get();
    }

    /**
     * Get completed transactions
     */
    public function getCompletedTransactions()
    {
        return $this->transactions()->paid()->recentFirst()->get();
    }

    /**
     * Get total amount spent by user
     */
    public function getTotalSpent(): float
    {
        return $this->transactions()->paid()->sum('total_amount');
    }

    /**
     * Get formatted total spent attribute
     */
    public function getFormattedTotalSpentAttribute(): string
    {
        return 'Rp ' . number_format($this->getTotalSpent(), 0, ',', '.');
    }

    /**
     * Create a new transaction for the user
     */
    public function createTransaction($type, $items = [])
    {
        $transaction = $this->transactions()->create([
            'type' => $type,
            'total_amount' => 0,
            'payment_method' => 'qris',
        ]);

        foreach ($items as $item) {
            $transaction->addItem(
                $item['type'],
                $item['id'],
                $item['title'],
                $item['price'],
                $item['quantity'] ?? 1
            );
        }

        $transaction->calculateTotal();

        return $transaction;
    }

    /**
     * Purchase a book
     */
    public function purchaseBook(Book $book)
    {
        // Check if already purchased
        if ($this->hasPurchasedBook($book->id)) {
            throw new \Exception('Book sudah dibeli sebelumnya');
        }

        $price = $book->discount_percentage > 0 ? $book->discounted_price : $book->price;

        return $this->createTransaction('book_purchase', [[
            'type' => 'book',
            'id' => $book->id,
            'title' => $book->title,
            'price' => $price,
        ]]);
    }

    /**
     * Purchase a chapter
     */
    public function purchaseChapter(Chapter $chapter)
    {
        // Check if already purchased
        if ($this->hasPurchasedChapter($chapter->id)) {
            throw new \Exception('Chapter sudah dibeli sebelumnya');
        }

        // Check if already has access via book purchase
        if ($this->hasPurchasedBook($chapter->book_id)) {
            throw new \Exception('Anda sudah memiliki akses melalui pembelian buku');
        }

        return $this->createTransaction('chapter_purchase', [[
            'type' => 'chapter',
            'id' => $chapter->id,
            'title' => $chapter->title,
            'price' => $chapter->price,
        ]]);
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }

    /**
     * Reading Progress relationships
     */
    public function readingProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class);
    }

    public function completedChapters(): HasMany
    {
        return $this->hasMany(ReadingProgress::class)->where('progress_percentage', 100);
    }

    public function chaptersInProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class)
            ->where('progress_percentage', '>', 0)
            ->where('progress_percentage', '<', 100);
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
     * Reading Progress methods
     */
    public function getReadingProgressForChapter($chapterId)
    {
        return $this->readingProgress()->where('chapter_id', $chapterId)->first();
    }

    public function getBookProgress($bookId)
    {
        return $this->readingProgress()
            ->whereHas('chapter', function ($query) use ($bookId) {
                $query->where('book_id', $bookId);
            })
            ->with('chapter')
            ->get();
    }

    public function getReadingStats()
    {
        $totalChaptersRead = $this->completedChapters()->count();
        $chaptersInProgress = $this->chaptersInProgress()->count();
        $totalReadingTime = $this->completedChapters()
            ->with('chapter')
            ->get()
            ->sum('chapter.reading_time_minutes');

        return [
            'total_chapters_read' => $totalChaptersRead,
            'chapters_in_progress' => $chaptersInProgress,
            'total_reading_time_minutes' => $totalReadingTime,
            'total_reading_time_formatted' => $this->formatReadingTime($totalReadingTime),
        ];
    }

    private function formatReadingTime($minutes)
    {
        if ($minutes < 60) {
            return $minutes . ' menit';
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($remainingMinutes > 0) {
            return $hours . ' jam ' . $remainingMinutes . ' menit';
        }

        return $hours . ' jam';
    }

    /**
     * Review methods
     */
    public function hasReviewedBook($bookId): bool
    {
        return $this->reviews()->where('book_id', $bookId)->exists();
    }

    public function getReviewForBook($bookId)
    {
        return $this->reviews()->where('book_id', $bookId)->first();
    }

    public function getReviewStats()
    {
        return [
            'total_reviews' => $this->reviews()->count(),
            'approved_reviews' => $this->approvedReviews()->count(),
            'average_rating_given' => round($this->reviews()->avg('rating'), 2),
            'reviews_with_text' => $this->reviews()->whereNotNull('review_text')->count(),
        ];
    }

    /**
     * Author submission relationships
     */
    public function authorSubmissions(): HasMany
    {
        return $this->hasMany(AuthorSubmission::class);
    }

    public function authorSubscriptions(): HasMany
    {
        return $this->hasMany(UserAuthorSubscription::class);
    }

    public function activeAuthorSubscription()
    {
        return $this->authorSubscriptions()->active()->first();
    }

    public function hasActiveAuthorSubscription(): bool
    {
        return $this->authorSubscriptions()->active()->exists();
    }

    public function canSubmitBooks(): bool
    {
        $subscription = $this->activeAuthorSubscription();
        return $subscription && $subscription->canSubmitMoreBooks();
    }

    public function getAuthorStats()
    {
        $submissions = $this->authorSubmissions();

        return [
            'total_submissions' => $submissions->count(),
            'pending_submissions' => $submissions->where('status', 'pending')->count(),
            'approved_submissions' => $submissions->where('status', 'approved')->count(),
            'published_books' => $submissions->where('status', 'published')->count(),
            'rejected_submissions' => $submissions->where('status', 'rejected')->count(),
            'has_active_subscription' => $this->hasActiveAuthorSubscription(),
            'can_submit_books' => $this->canSubmitBooks(),
        ];
    }
}
