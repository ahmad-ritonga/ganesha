<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserPurchase extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'user_id',
        'purchasable_type',
        'purchasable_id',
        'transaction_id',
        'purchased_at',
        'expires_at',
    ];

    protected $casts = [
        'purchased_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Disable updated_at timestamp
    const UPDATED_AT = null;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function getPurchasableAttribute()
    {
        if ($this->purchasable_type === 'book') {
            return Book::find($this->purchasable_id);
        } elseif ($this->purchasable_type === 'chapter') {
            return Chapter::find($this->purchasable_id);
        }

        return null;
    }

    public function scopeBooks($query)
    {
        return $query->where('purchasable_type', 'book');
    }

    public function scopeChapters($query)
    {
        return $query->where('purchasable_type', 'chapter');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', Carbon::now());
        });
    }

    public function scopeExpired($query)
    {
        return $query->whereNotNull('expires_at')
            ->where('expires_at', '<=', Carbon::now());
    }

    public function scopeRecentFirst($query)
    {
        return $query->orderBy('purchased_at', 'desc');
    }

    public function isBook()
    {
        return $this->purchasable_type === 'book';
    }

    public function isChapter()
    {
        return $this->purchasable_type === 'chapter';
    }

    public function isActive()
    {
        return $this->expires_at === null || $this->expires_at->isFuture();
    }

    public function isExpired()
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function getRemainingDaysAttribute()
    {
        if ($this->expires_at === null) {
            return null; // Permanent access
        }

        return $this->expires_at->diffInDays(Carbon::now(), false);
    }

    public function getFormattedExpiryAttribute()
    {
        if ($this->expires_at === null) {
            return 'Permanent';
        }

        if ($this->isExpired()) {
            return 'Expired';
        }

        $days = $this->remaining_days;

        if ($days < 1) {
            $hours = $this->expires_at->diffInHours(Carbon::now());
            return "Expires in {$hours} hours";
        }

        return "Expires in {$days} days";
    }

    public function getPurchasableTypeLabelAttribute()
    {
        return $this->purchasable_type === 'book' ? 'Buku' : 'Chapter';
    }

    public function getPurchasableTitleAttribute()
    {
        $item = $this->purchasable;
        return $item ? $item->title : 'Item tidak ditemukan';
    }

    public function getPurchasableUrlAttribute()
    {
        if ($this->isBook()) {
            return route('books.show', $this->purchasable_id);
        } elseif ($this->isChapter()) {
            $chapter = $this->purchasable;
            return $chapter ? route('chapters.show', [$chapter->book_id, $chapter->id]) : null;
        }

        return null;
    }

    public static function hasUserPurchased($userId, $itemType, $itemId)
    {
        return self::where('user_id', $userId)
            ->where('purchasable_type', $itemType)
            ->where('purchasable_id', $itemId)
            ->active()
            ->exists();
    }

    public static function getUserPurchase($userId, $itemType, $itemId)
    {
        return self::where('user_id', $userId)
            ->where('purchasable_type', $itemType)
            ->where('purchasable_id', $itemId)
            ->active()
            ->first();
    }

    public static function getUserPurchasedBooks($userId)
    {
        return self::with('purchasable')
            ->where('user_id', $userId)
            ->where('purchasable_type', 'book')
            ->active()
            ->recentFirst()
            ->get();
    }

    public static function getUserPurchasedChapters($userId)
    {
        return self::with('purchasable')
            ->where('user_id', $userId)
            ->where('purchasable_type', 'chapter')
            ->active()
            ->recentFirst()
            ->get();
    }

    public static function createPurchase($userId, $itemType, $itemId, $transactionId, $expiresAt = null)
    {
        return self::updateOrCreate([
            'user_id' => $userId,
            'purchasable_type' => $itemType,
            'purchasable_id' => $itemId,
        ], [
            'transaction_id' => $transactionId,
            'purchased_at' => Carbon::now(),
            'expires_at' => $expiresAt,
        ]);
    }
}
