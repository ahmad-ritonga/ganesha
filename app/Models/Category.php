<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'rumpun_display_name',
        'image_url'
    ];

    protected static function boot()
    {
        parent::boot();

        // Hapus auto slug generation karena sekarang slug adalah pilihan manual
        // static::creating(function ($category) {
        //     if (empty($category->slug)) {
        //         $category->slug = Str::slug($category->name);
        //     }
        // });

        // static::updating(function ($category) {
        //     if ($category->isDirty('name') && !$category->isDirty('slug')) {
        //         $category->slug = Str::slug($category->name);
        //     }
        // });
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function publishedBooks(): HasMany
    {
        return $this->hasMany(Book::class)->where('is_published', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithBooksCount($query)
    {
        return $query->withCount('books');
    }

    public function scopeWithPublishedBooksCount($query)
    {
        return $query->withCount('publishedBooks');
    }

    /**
     * Scope untuk filter berdasarkan slug
     */
    public function scopeBySlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }

    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Get display name untuk rumpun berdasarkan slug
     */
    public function getRumpunDisplayNameAttribute()
    {
        $rumpunNames = [
            'eksakta' => 'Ilmu Eksakta',
            'soshum' => 'Sosial Humaniora',
            'terapan' => 'Ilmu Terapan',
            'interdisipliner' => 'Interdisipliner',
        ];

        return $rumpunNames[$this->slug] ?? $this->name;
    }

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }

        // Default image berdasarkan slug (rumpun)
        $defaultImages = [
            'eksakta' => '/assets/images/categories/eksakta-default.jpg',
            'soshum' => '/assets/images/categories/soshum-default.jpg',
            'terapan' => '/assets/images/categories/terapan-default.jpg',
            'interdisipliner' => '/assets/images/categories/interdisipliner-default.jpg',
        ];

        return $defaultImages[$this->slug] ?? asset('assets/images/default-category.png');
    }

    /**
     * Static method untuk get categories grouped by slug (rumpun)
     */
    public static function getGroupedBySlug($activeOnly = true)
    {
        $query = self::query();

        if ($activeOnly) {
            $query->active();
        }

        $categories = $query->withCount(['publishedBooks as books_count'])
            ->orderBy('name')
            ->get();

        return $categories->groupBy('slug');
    }

    /**
     * Get categories untuk navbar dropdown
     */
    public static function getForNavbar()
    {
        return cache()->remember('navbar_categories', 7200, function () { // Increase cache to 2 hours
            try {
                $categories = self::active()
                    ->withCount(['publishedBooks as books_count'])
                    ->orderBy('name')
                    ->get();

                $grouped = $categories->groupBy('slug');

                // Convert to array structure for frontend
                $result = [
                    'eksakta' => $grouped->get('eksakta', collect())->values()->toArray(),
                    'soshum' => $grouped->get('soshum', collect())->values()->toArray(),
                    'terapan' => $grouped->get('terapan', collect())->values()->toArray(),
                    'interdisipliner' => $grouped->get('interdisipliner', collect())->values()->toArray(),
                ];

                return $result;
            } catch (\Exception $e) {
                Log::error('getForNavbar failed: ' . $e->getMessage());
                return [
                    'eksakta' => [],
                    'soshum' => [],
                    'terapan' => [],
                    'interdisipliner' => [],
                ];
            }
        });
    }

    /**
     * Clear navbar cache
     */
    public static function clearNavbarCache()
    {
        cache()->forget('navbar_categories');
    }

    /**
     * Override save method untuk clear cache
     */
    public function save(array $options = [])
    {
        $result = parent::save($options);
        self::clearNavbarCache();
        return $result;
    }

    /**
     * Override delete method untuk clear cache
     */
    public function delete()
    {
        $result = parent::delete();
        self::clearNavbarCache();
        return $result;
    }
}
