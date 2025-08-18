<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Chapter extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'book_id',
        'title',
        'slug',
        'chapter_number',
        'content',
        'excerpt',
        'is_free',
        'price',
        'reading_time_minutes',
        'is_published',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_published' => 'boolean',
        'price' => 'decimal:2',
        'chapter_number' => 'integer',
        'reading_time_minutes' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($chapter) {
            if (empty($chapter->slug)) {
                $chapter->slug = Str::slug($chapter->title);
            }

            if (empty($chapter->chapter_number)) {
                $lastChapter = static::where('book_id', $chapter->book_id)
                    ->orderBy('chapter_number', 'desc')
                    ->first();
                $chapter->chapter_number = $lastChapter ? $lastChapter->chapter_number + 1 : 1;
            }

            if (empty($chapter->excerpt) && !empty($chapter->content)) {
                $chapter->excerpt = Str::limit(strip_tags($chapter->content), 300);
            }
        });

        static::updating(function ($chapter) {
            if ($chapter->isDirty('title') && !$chapter->isDirty('slug')) {
                $chapter->slug = Str::slug($chapter->title);
            }

            if ($chapter->isDirty('content') && empty($chapter->excerpt)) {
                $chapter->excerpt = Str::limit(strip_tags($chapter->content), 300);
            }
        });
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ChapterMedia::class)->orderBy('order_index');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ChapterMedia::class)->where('type', 'image')->orderBy('order_index');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(ChapterMedia::class)->where('type', 'video')->orderBy('order_index');
    }

    public function audios(): HasMany
    {
        return $this->hasMany(ChapterMedia::class)->where('type', 'audio')->orderBy('order_index');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ChapterMedia::class)->where('type', 'document')->orderBy('order_index');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_free', true);
    }

    public function scopePaid($query)
    {
        return $query->where('is_free', false);
    }

    public function scopeByBook($query, $bookId)
    {
        return $query->where('book_id', $bookId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('chapter_number');
    }

    public function scopeWithMedia($query)
    {
        return $query->with(['media' => function ($q) {
            $q->orderBy('order_index');
        }]);
    }

    public function scopeWithMediaCount($query)
    {
        return $query->withCount('media');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getFormattedPriceAttribute()
    {
        return $this->price > 0 ? 'Rp ' . number_format($this->price, 0, ',', '.') : 'Gratis';
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

    public function getWordCountAttribute()
    {
        return str_word_count(strip_tags($this->content ?? ''));
    }

    public function getCharacterCountAttribute()
    {
        return strlen(strip_tags($this->content ?? ''));
    }

    public function getPreviousChapterAttribute()
    {
        return static::where('book_id', $this->book_id)
            ->where('chapter_number', '<', $this->chapter_number)
            ->orderBy('chapter_number', 'desc')
            ->first();
    }

    public function getNextChapterAttribute()
    {
        return static::where('book_id', $this->book_id)
            ->where('chapter_number', '>', $this->chapter_number)
            ->orderBy('chapter_number', 'asc')
            ->first();
    }

    public function getIsFirstChapterAttribute()
    {
        return $this->chapter_number === 1;
    }

    public function getIsLastChapterAttribute()
    {
        $lastChapter = static::where('book_id', $this->book_id)
            ->orderBy('chapter_number', 'desc')
            ->first();

        return $this->chapter_number === $lastChapter?->chapter_number;
    }

    public function getMediaCountAttribute()
    {
        return $this->media()->count();
    }

    public function getImageCountAttribute()
    {
        return $this->images()->count();
    }

    public function getVideoCountAttribute()
    {
        return $this->videos()->count();
    }

    public function getAudioCountAttribute()
    {
        return $this->audios()->count();
    }

    public function getDocumentCountAttribute()
    {
        return $this->documents()->count();
    }

    public function getTotalMediaSizeAttribute()
    {
        return $this->media()->sum('file_size') ?? 0;
    }

    public function getFormattedMediaSizeAttribute()
    {
        $bytes = $this->total_media_size;

        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function hasMedia($type = null)
    {
        if ($type) {
            return $this->media()->where('type', $type)->exists();
        }

        return $this->media()->exists();
    }

    public function getFeaturedImageAttribute()
    {
        return $this->images()->first();
    }

    public function canBeAccessedBy($user = null)
    {
        if (!$this->is_published) {
            return false;
        }

        if ($this->is_free) {
            return true;
        }

        // Add your payment/subscription logic here
        // For now, return false for paid chapters
        return false;
    }

    public function addMedia($file, $type, $additionalData = [])
    {
        $fileName = $file->getClientOriginalName();
        $filePath = $file->store("chapters/{$this->id}/media", 'public');
        $fileSize = $file->getSize();

        $nextOrder = $this->media()->max('order_index') + 1;

        return $this->media()->create(array_merge([
            'type' => $type,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $fileSize,
            'order_index' => $nextOrder,
        ], $additionalData));
    }

    public function reorderMedia(array $mediaIds)
    {
        foreach ($mediaIds as $index => $mediaId) {
            $this->media()->where('id', $mediaId)->update(['order_index' => $index + 1]);
        }
    }

    public function deleteAllMedia()
    {
        $this->media()->each(function ($media) {
            $media->delete(); // This will also delete the physical file
        });
    }

    /**
     * Reading Progress relationship
     */
    public function readingProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class);
    }

    public function completedReadings(): HasMany
    {
        return $this->hasMany(ReadingProgress::class)->where('progress_percentage', 100);
    }

    /**
     * Reading Progress methods
     */
    public function getUserProgress($userId)
    {
        return $this->readingProgress()->where('user_id', $userId)->first();
    }

    public function getProgressPercentage($userId): int
    {
        $progress = $this->getUserProgress($userId);
        return $progress ? $progress->progress_percentage : 0;
    }

    public function isCompletedByUser($userId): bool
    {
        return $this->getProgressPercentage($userId) >= 100;
    }

    public function getReadersCount(): int
    {
        return $this->readingProgress()->distinct('user_id')->count('user_id');
    }

    public function getCompletedReadersCount(): int
    {
        return $this->completedReadings()->count();
    }

    public function getAverageReadingTime(): float
    {
        // Based on completed readings and their time to complete
        $completedReadings = $this->completedReadings()
            ->whereNotNull('completed_at')
            ->get();

        if ($completedReadings->isEmpty()) {
            return $this->reading_time_minutes ?? 0;
        }

        // Calculate average time from start to completion
        $totalTime = 0;
        $validReadings = 0;

        foreach ($completedReadings as $reading) {
            $timeToComplete = $reading->created_at->diffInMinutes($reading->completed_at);
            if ($timeToComplete > 0 && $timeToComplete < 300) { // Reasonable reading time (less than 5 hours)
                $totalTime += $timeToComplete;
                $validReadings++;
            }
        }

        return $validReadings > 0 ? round($totalTime / $validReadings, 2) : ($this->reading_time_minutes ?? 0);
    }

    public function getEngagementScore(): float
    {
        $readersCount = $this->getReadersCount();
        $completionRate = $readersCount > 0 ? ($this->getCompletedReadersCount() / $readersCount) * 100 : 0;

        // Score based on readers count and completion rate
        return round(($readersCount * 0.6) + ($completionRate * 0.4), 2);
    }

    public function getReadingStatistics(): array
    {
        return [
            'total_readers' => $this->getReadersCount(),
            'completed_readers' => $this->getCompletedReadersCount(),
            'completion_rate' => $this->getReadersCount() > 0 ?
                round(($this->getCompletedReadersCount() / $this->getReadersCount()) * 100, 2) : 0,
            'average_reading_time' => $this->getAverageReadingTime(),
            'engagement_score' => $this->getEngagementScore(),
        ];
    }
}
