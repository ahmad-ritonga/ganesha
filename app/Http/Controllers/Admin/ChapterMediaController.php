<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\ChapterMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChapterMediaController extends Controller
{
    public function index($bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::with(['media' => function ($query) {
            $query->orderBy('order_index');
        }])->where('book_id', $bookId)->findOrFail($chapterId);

        return Inertia::render('admin/chapters/media/index', [
            'book' => $book,
            'chapter' => $chapter,
            'media' => $chapter->media,
        ]);
    }

    public function store(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|max:102400', // 100MB max
            'type' => 'required|in:image,video,audio,document',
            'alt_text.*' => 'nullable|string|max:255',
            'caption.*' => 'nullable|string|max:1000',
        ]);

        $type = $request->type;
        $validExtensions = ChapterMedia::getValidExtensions($type);
        $maxFileSize = ChapterMedia::getMaxFileSize($type);

        $uploadedMedia = [];
        $errors = [];

        foreach ($request->file('files') as $index => $file) {
            $fileName = $file->getClientOriginalName();
            $fileExtension = strtolower($file->getClientOriginalExtension());
            $fileSize = $file->getSize();

            // Validate file extension
            if (!in_array($fileExtension, $validExtensions)) {
                $errors[] = "File {$fileName}: Format tidak didukung untuk {$type}";
                continue;
            }

            // Validate file size
            if ($fileSize > $maxFileSize) {
                $maxSizeMB = round($maxFileSize / 1024 / 1024, 2);
                $errors[] = "File {$fileName}: Ukuran melebihi batas maksimal {$maxSizeMB}MB";
                continue;
            }

            try {
                $filePath = $file->store("chapters/{$chapter->id}/media", 'public');
                $nextOrder = $chapter->media()->max('order_index') + 1;

                $media = $chapter->media()->create([
                    'type' => $type,
                    'file_path' => $filePath,
                    'file_name' => $fileName,
                    'file_size' => $fileSize,
                    'alt_text' => $request->input("alt_text.{$index}"),
                    'caption' => $request->input("caption.{$index}"),
                    'order_index' => $nextOrder + $index,
                ]);

                $uploadedMedia[] = $media;
            } catch (\Exception $e) {
                $errors[] = "File {$fileName}: Gagal mengupload - " . $e->getMessage();
            }
        }

        $message = count($uploadedMedia) . ' file berhasil diupload';
        if (!empty($errors)) {
            $message .= '. Errors: ' . implode(', ', $errors);
        }

        return back()->with('success', $message);
    }

    public function show($bookId, $chapterId, $mediaId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $media = ChapterMedia::where('chapter_id', $chapterId)->findOrFail($mediaId);

        return Inertia::render('admin/chapters/media/show', [
            'book' => $book,
            'chapter' => $chapter,
            'media' => $media,
        ]);
    }

    public function update(Request $request, $bookId, $chapterId, $mediaId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $media = ChapterMedia::where('chapter_id', $chapterId)->findOrFail($mediaId);

        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:1000',
            'order_index' => 'nullable|integer|min:0',
        ]);

        $media->update($request->only(['alt_text', 'caption', 'order_index']));

        return back()->with('success', 'Media berhasil diperbarui');
    }

    public function destroy($bookId, $chapterId, $mediaId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $media = ChapterMedia::where('chapter_id', $chapterId)->findOrFail($mediaId);

        $fileName = $media->file_name;
        $media->delete(); // This will also delete the physical file

        return back()->with('success', "Media '{$fileName}' berhasil dihapus");
    }

    public function download($bookId, $chapterId, $mediaId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $media = ChapterMedia::where('chapter_id', $chapterId)->findOrFail($mediaId);

        if (!Storage::disk('public')->exists($media->file_path)) {
            abort(404, 'File tidak ditemukan');
        }

        return Storage::disk('public')->download($media->file_path, $media->file_name);
    }

    public function reorder(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $request->validate([
            'media' => 'required|array',
            'media.*.id' => 'required|exists:chapter_media,id',
            'media.*.order_index' => 'required|integer|min:0',
        ]);

        foreach ($request->media as $mediaData) {
            ChapterMedia::where('id', $mediaData['id'])
                ->where('chapter_id', $chapterId)
                ->update(['order_index' => $mediaData['order_index']]);
        }

        return back()->with('success', 'Urutan media berhasil diperbarui');
    }

    public function bulkDelete(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapter_media,id',
        ]);

        $media = ChapterMedia::where('chapter_id', $chapterId)
            ->whereIn('id', $request->ids)
            ->get();

        foreach ($media as $item) {
            $item->delete(); // This will delete both DB record and physical file
        }

        return back()->with('success', count($request->ids) . ' media berhasil dihapus');
    }

    public function bulkUpdateType(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapter_media,id',
            'type' => 'required|in:image,video,audio,document',
        ]);

        $updated = ChapterMedia::where('chapter_id', $chapterId)
            ->whereIn('id', $request->ids)
            ->update(['type' => $request->type]);

        return back()->with('success', "{$updated} media berhasil diubah tipenya ke {$request->type}");
    }

    public function getByType($bookId, $chapterId, $type)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        if (!in_array($type, ['image', 'video', 'audio', 'document'])) {
            abort(404, 'Tipe media tidak valid');
        }

        $media = $chapter->media()->where('type', $type)->orderBy('order_index')->get();

        return response()->json([
            'media' => $media,
            'count' => $media->count(),
            'total_size' => $media->sum('file_size'),
        ]);
    }

    public function uploadToEditor(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB for editor uploads
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileExtension = strtolower($file->getClientOriginalExtension());

        // Determine file type based on extension
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $type = in_array($fileExtension, $imageExtensions) ? 'image' : 'document';

        try {
            $filePath = $file->store("chapters/{$chapter->id}/editor", 'public');
            $nextOrder = $chapter->media()->max('order_index') + 1;

            $media = $chapter->media()->create([
                'type' => $type,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_size' => $file->getSize(),
                'order_index' => $nextOrder,
                'alt_text' => 'Uploaded via editor',
            ]);

            return response()->json([
                'success' => true,
                'file_url' => $media->file_url,
                'media_id' => $media->id,
                'file_name' => $fileName,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload file: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getStats($bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $stats = [
            'total_media' => $chapter->media_count,
            'images' => $chapter->image_count,
            'videos' => $chapter->video_count,
            'audios' => $chapter->audio_count,
            'documents' => $chapter->document_count,
            'total_size' => $chapter->total_media_size,
            'formatted_size' => $chapter->formatted_media_size,
        ];

        return response()->json($stats);
    }

    public function replaceFile(Request $request, $bookId, $chapterId, $mediaId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $media = ChapterMedia::where('chapter_id', $chapterId)->findOrFail($mediaId);

        $request->validate([
            'file' => 'required|file|max:102400', // 100MB max
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileExtension = strtolower($file->getClientOriginalExtension());
        $fileSize = $file->getSize();

        $validExtensions = ChapterMedia::getValidExtensions($media->type);
        $maxFileSize = ChapterMedia::getMaxFileSize($media->type);

        // Validate file extension
        if (!in_array($fileExtension, $validExtensions)) {
            return back()->withErrors(['file' => "Format file tidak didukung untuk {$media->type}"]);
        }

        // Validate file size
        if ($fileSize > $maxFileSize) {
            $maxSizeMB = round($maxFileSize / 1024 / 1024, 2);
            return back()->withErrors(['file' => "Ukuran file melebihi batas maksimal {$maxSizeMB}MB"]);
        }

        try {
            // Delete old file
            if (Storage::disk('public')->exists($media->file_path)) {
                Storage::disk('public')->delete($media->file_path);
            }

            // Upload new file
            $filePath = $file->store("chapters/{$chapter->id}/media", 'public');

            // Update media record
            $media->update([
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_size' => $fileSize,
            ]);

            return back()->with('success', 'File berhasil diganti');
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Gagal mengganti file: ' . $e->getMessage()]);
        }
    }
}
