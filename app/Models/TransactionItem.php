<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TransactionItem extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'transaction_id',
        'item_type',
        'item_id',
        'item_title',
        'price',
        'quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    // Disable updated_at timestamp
    const UPDATED_AT = null;

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function getItemAttribute()
    {
        if ($this->item_type === 'book') {
            return Book::find($this->item_id);
        } elseif ($this->item_type === 'chapter') {
            return Chapter::find($this->item_id);
        }

        return null;
    }

    public function getSubtotalAttribute()
    {
        return $this->price * $this->quantity;
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getFormattedSubtotalAttribute()
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    public function getItemTypeLabelAttribute()
    {
        return $this->item_type === 'book' ? 'Buku' : 'Chapter';
    }

    public function scopeBooks($query)
    {
        return $query->where('item_type', 'book');
    }

    public function scopeChapters($query)
    {
        return $query->where('item_type', 'chapter');
    }

    public function scopeForItem($query, $itemType, $itemId)
    {
        return $query->where('item_type', $itemType)->where('item_id', $itemId);
    }

    public function isBook()
    {
        return $this->item_type === 'book';
    }

    public function isChapter()
    {
        return $this->item_type === 'chapter';
    }

    public function getItemUrl()
    {
        if ($this->isBook()) {
            return route('books.show', $this->item_id);
        } elseif ($this->isChapter()) {
            $chapter = $this->item;
            return $chapter ? route('chapters.show', [$chapter->book_id, $chapter->id]) : null;
        }

        return null;
    }

    public function getItemDescription()
    {
        $item = $this->item;

        if (!$item) {
            return 'Item tidak ditemukan';
        }

        if ($this->isBook()) {
            return "Buku oleh {$item->author->name}";
        } elseif ($this->isChapter()) {
            return "Chapter dari buku {$item->book->title}";
        }

        return '';
    }
}
