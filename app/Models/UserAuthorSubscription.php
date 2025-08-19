<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAuthorSubscription extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'plan_id',
        'transaction_id',
        'submissions_used',
        'starts_at',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(AuthorSubscriptionPlan::class, 'plan_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            });
    }

    public function isActive(): bool
    {
        return $this->status === 'active'
            && $this->starts_at <= now()
            && ($this->expires_at === null || $this->expires_at >= now());
    }

    public function canSubmitMoreBooks(): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        return $this->submissions_used < $this->plan->max_submissions;
    }

    public function incrementSubmissionsUsed(): void
    {
        $this->increment('submissions_used');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'active' => 'Aktif',
            'expired' => 'Berakhir',
            'cancelled' => 'Dibatalkan',
            'pending' => 'Menunggu Pembayaran',
            default => 'Unknown'
        };
    }
}
