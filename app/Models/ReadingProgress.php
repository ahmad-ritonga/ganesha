<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ReadingProgress extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'reading_progress';

    protected $fillable = [
        'user_id',
        'chapter_id',
        'progress_percentage',
        'last_position',
        'completed_at',
    ];

    protected $casts = [
        'progress_percentage' => 'integer',
        'completed_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    // Access book through chapter relationship
    public function getBookAttribute()
    {
        return $this->chapter?->book;
    }

    /**
     * Scopes
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForChapter($query, $chapterId)
    {
        return $query->where('chapter_id', $chapterId);
    }

    public function scopeCompleted($query)
    {
        return $query->where('progress_percentage', 100);
    }

    public function scopeInProgress($query)
    {
        return $query->where('progress_percentage', '>', 0)
            ->where('progress_percentage', '<', 100);
    }

    public function scopeNotStarted($query)
    {
        return $query->where('progress_percentage', 0);
    }

    public function scopeRecentFirst($query)
    {
        return $query->orderBy('updated_at', 'desc');
    }

    public function scopeByProgressRange($query, $min, $max)
    {
        return $query->whereBetween('progress_percentage', [$min, $max]);
    }

    /**
     * Accessors & Mutators
     */
    public function getIsCompletedAttribute(): bool
    {
        return $this->progress_percentage >= 100;
    }

    public function getIsInProgressAttribute(): bool
    {
        return $this->progress_percentage > 0 && $this->progress_percentage < 100;
    }

    public function getIsNotStartedAttribute(): bool
    {
        return $this->progress_percentage === 0;
    }

    public function getProgressStatusAttribute(): string
    {
        if ($this->is_completed) {
            return 'completed';
        } elseif ($this->is_in_progress) {
            return 'in_progress';
        } else {
            return 'not_started';
        }
    }

    public function getFormattedProgressAttribute(): string
    {
        return $this->progress_percentage . '%';
    }

    public function getLastReadAttribute(): string
    {
        if (!$this->updated_at) {
            return 'Belum pernah dibaca';
        }

        return $this->updated_at->diffForHumans();
    }

    public function getCompletedAtFormattedAttribute(): ?string
    {
        return $this->completed_at?->format('d M Y H:i');
    }

    /**
     * Static Methods
     */
    public static function updateProgress($userId, $chapterId, $progressPercentage, $lastPosition = null)
    {
        $progress = static::updateOrCreate(
            [
                'user_id' => $userId,
                'chapter_id' => $chapterId,
            ],
            [
                'progress_percentage' => $progressPercentage,
                'last_position' => $lastPosition,
                'completed_at' => $progressPercentage >= 100 ? Carbon::now() : null,
            ]
        );

        return $progress;
    }

    public static function getUserProgress($userId, $chapterId)
    {
        return static::where('user_id', $userId)
            ->where('chapter_id', $chapterId)
            ->first();
    }

    public static function getUserBookProgress($userId, $bookId)
    {
        return static::whereHas('chapter', function ($query) use ($bookId) {
            $query->where('book_id', $bookId);
        })->where('user_id', $userId)->get();
    }

    public static function getBookCompletionRate($userId, $bookId)
    {
        $chapters = Chapter::where('book_id', $bookId)->pluck('id');
        $totalChapters = $chapters->count();

        if ($totalChapters === 0) {
            return 0;
        }

        $completedChapters = static::whereIn('chapter_id', $chapters)
            ->where('user_id', $userId)
            ->where('progress_percentage', 100)
            ->count();

        return round(($completedChapters / $totalChapters) * 100, 2);
    }

    public static function markAsCompleted($userId, $chapterId)
    {
        return static::updateProgress($userId, $chapterId, 100);
    }

    /**
     * Boot method untuk auto-complete jika progress 100%
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($progress) {
            if ($progress->progress_percentage >= 100 && !$progress->completed_at) {
                $progress->completed_at = Carbon::now();
            } elseif ($progress->progress_percentage < 100) {
                $progress->completed_at = null;
            }
        });
    }
}
