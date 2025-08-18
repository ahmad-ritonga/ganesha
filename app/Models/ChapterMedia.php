<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChapterMedia extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'chapter_media';

    protected $fillable = [
        'chapter_id',
        'type',
        'file_path',
        'file_name',
        'file_size',
        'alt_text',
        'caption',
        'order_index',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'order_index' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Disable automatic updated_at since we're using MySQL's ON UPDATE CURRENT_TIMESTAMP
    const UPDATED_AT = null;

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    public function scopeAudios($query)
    {
        return $query->where('type', 'audio');
    }

    public function scopeDocuments($query)
    {
        return $query->where('type', 'document');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    public function getFileSizeFormattedAttribute()
    {
        if (!$this->file_size) {
            return '-';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFileExtensionAttribute()
    {
        return pathinfo($this->file_name, PATHINFO_EXTENSION);
    }

    public function getIsImageAttribute()
    {
        return $this->type === 'image';
    }

    public function getIsVideoAttribute()
    {
        return $this->type === 'video';
    }

    public function getIsAudioAttribute()
    {
        return $this->type === 'audio';
    }

    public function getIsDocumentAttribute()
    {
        return $this->type === 'document';
    }

    public function getMimeTypeAttribute()
    {
        $extension = strtolower($this->file_extension);

        $mimeTypes = [
            // Images
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',

            // Videos
            'mp4' => 'video/mp4',
            'avi' => 'video/x-msvideo',
            'mov' => 'video/quicktime',
            'wmv' => 'video/x-ms-wmv',
            'flv' => 'video/x-flv',
            'webm' => 'video/webm',

            // Audio
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            'aac' => 'audio/aac',
            'm4a' => 'audio/mp4',

            // Documents
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    public function getTypeIconAttribute()
    {
        switch ($this->type) {
            case 'image':
                return 'photo';
            case 'video':
                return 'video';
            case 'audio':
                return 'audio';
            case 'document':
                return 'document';
            default:
                return 'file';
        }
    }

    public function getTypeColorAttribute()
    {
        switch ($this->type) {
            case 'image':
                return 'blue';
            case 'video':
                return 'red';
            case 'audio':
                return 'green';
            case 'document':
                return 'purple';
            default:
                return 'gray';
        }
    }

    public function canBeDisplayedInline()
    {
        return in_array($this->type, ['image', 'video', 'audio']);
    }

    public function isValidImageType()
    {
        $validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        return $this->type === 'image' && in_array(strtolower($this->file_extension), $validExtensions);
    }

    public function isValidVideoType()
    {
        $validExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
        return $this->type === 'video' && in_array(strtolower($this->file_extension), $validExtensions);
    }

    public function isValidAudioType()
    {
        $validExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
        return $this->type === 'audio' && in_array(strtolower($this->file_extension), $validExtensions);
    }

    public function isValidDocumentType()
    {
        $validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
        return $this->type === 'document' && in_array(strtolower($this->file_extension), $validExtensions);
    }

    public static function getValidExtensions($type = null)
    {
        $extensions = [
            'image' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            'video' => ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
            'audio' => ['mp3', 'wav', 'ogg', 'aac', 'm4a'],
            'document' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        ];

        return $type ? $extensions[$type] ?? [] : $extensions;
    }

    public static function getMaxFileSize($type = null)
    {
        $sizes = [
            'image' => 5 * 1024 * 1024,      // 5MB
            'video' => 100 * 1024 * 1024,   // 100MB
            'audio' => 20 * 1024 * 1024,    // 20MB
            'document' => 10 * 1024 * 1024, // 10MB
        ];

        return $type ? $sizes[$type] ?? $sizes['document'] : $sizes;
    }

    public function delete()
    {
        // Delete the actual file when model is deleted
        if (\Storage::disk('public')->exists($this->file_path)) {
            \Storage::disk('public')->delete($this->file_path);
        }

        return parent::delete();
    }
}
