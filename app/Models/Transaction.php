<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Transaction extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'user_id',
        'transaction_code',
        'type',
        'total_amount',
        'payment_method',
        'payment_status',
        'midtrans_order_id',
        'midtrans_transaction_id',
        'paid_at',
        'expired_at',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (empty($transaction->transaction_code)) {
                $transaction->transaction_code = self::generateTransactionCode();
            }

            if (empty($transaction->expired_at)) {
                $transaction->expired_at = Carbon::now()->addMinutes(15); // 15 minutes expiry
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(UserPurchase::class);
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }

    public function scopeExpired($query)
    {
        return $query->where('payment_status', 'expired');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecentFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function getFormattedAmountAttribute()
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Menunggu Pembayaran',
            'paid' => 'Berhasil',
            'failed' => 'Gagal',
            'expired' => 'Kadaluarsa',
        ];

        return $labels[$this->payment_status] ?? $this->payment_status;
    }

    public function getStatusColorAttribute()
    {
        $colors = [
            'pending' => 'yellow',
            'paid' => 'green',
            'failed' => 'red',
            'expired' => 'gray',
        ];

        return $colors[$this->payment_status] ?? 'gray';
    }

    public function getTypeLabel()
    {
        return $this->type === 'book_purchase' ? 'Pembelian Buku' : 'Pembelian Chapter';
    }

    public function isPending()
    {
        return $this->payment_status === 'pending';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }

    public function isFailed()
    {
        return $this->payment_status === 'failed';
    }

    public function isExpired()
    {
        return $this->payment_status === 'expired' ||
            ($this->isPending() && $this->expired_at && $this->expired_at->isPast());
    }

    public function canBePaid()
    {
        return $this->isPending() && !$this->isExpired();
    }

    public function markAsPaid($midtransTransactionId = null)
    {
        $this->update([
            'payment_status' => 'paid',
            'paid_at' => Carbon::now(),
            'midtrans_transaction_id' => $midtransTransactionId,
        ]);

        // Create user purchases
        $this->createUserPurchases();
    }

    public function markAsFailed($notes = null)
    {
        $this->update([
            'payment_status' => 'failed',
            'notes' => $notes,
        ]);
    }

    public function markAsExpired()
    {
        $this->update([
            'payment_status' => 'expired',
        ]);
    }

    public function createUserPurchases()
    {
        foreach ($this->items as $item) {
            UserPurchase::updateOrCreate([
                'user_id' => $this->user_id,
                'purchasable_type' => $item->item_type,
                'purchasable_id' => $item->item_id,
            ], [
                'transaction_id' => $this->id,
                'purchased_at' => $this->paid_at ?? Carbon::now(),
            ]);
        }
    }

    public function addItem($itemType, $itemId, $itemTitle, $price, $quantity = 1)
    {
        return $this->items()->create([
            'item_type' => $itemType,
            'item_id' => $itemId,
            'item_title' => $itemTitle,
            'price' => $price,
            'quantity' => $quantity,
        ]);
    }

    public function calculateTotal()
    {
        $total = $this->items()->sum(\DB::raw('price * quantity'));
        $this->update(['total_amount' => $total]);
        return $total;
    }

    public function getRemainingTimeAttribute()
    {
        if (!$this->expired_at || !$this->isPending()) {
            return null;
        }

        $remaining = $this->expired_at->diffInSeconds(Carbon::now(), false);

        if ($remaining <= 0) {
            return 0;
        }

        return $remaining;
    }

    public function getFormattedRemainingTimeAttribute()
    {
        $seconds = $this->remaining_time;

        if ($seconds === null || $seconds <= 0) {
            return 'Expired';
        }

        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;

        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    public static function generateTransactionCode()
    {
        $prefix = 'TXN';
        $date = Carbon::now()->format('Ymd');
        $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $code = $prefix . $date . $random;

        // Ensure uniqueness
        while (self::where('transaction_code', $code)->exists()) {
            $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $code = $prefix . $date . $random;
        }

        return $code;
    }

    public function getMidtransPayload()
    {
        return [
            'transaction_details' => [
                'order_id' => $this->midtrans_order_id ?: $this->transaction_code,
                'gross_amount' => (int) $this->total_amount,
            ],
            'payment_type' => 'qris',
            'enabled_payments' => ['qris'],
            'customer_details' => [
                'first_name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ],
            'item_details' => $this->items->map(function ($item) {
                return [
                    'id' => $item->item_id,
                    'price' => (int) $item->price,
                    'quantity' => $item->quantity,
                    'name' => $item->item_title,
                    'category' => $item->item_type,
                ];
            })->toArray(),
            'custom_expiry' => [
                'expiry_duration' => 15,
                'unit' => 'minute',
            ],
        ];
    }
}
