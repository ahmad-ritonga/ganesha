<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ChapterController extends Controller
{
    public function index(Request $request, $bookId)
    {
        $book = Book::with(['author', 'category'])->findOrFail($bookId);

        $query = Chapter::with(['book'])->where('book_id', $bookId);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status')) {
            if ($request->status === 'published') {
                $query->where('is_published', true);
            } elseif ($request->status === 'draft') {
                $query->where('is_published', false);
            }
        }

        if ($request->has('type')) {
            if ($request->type === 'free') {
                $query->where('is_free', true);
            } elseif ($request->type === 'paid') {
                $query->where('is_free', false);
            }
        }

        $chapters = $query->orderBy('chapter_number')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/chapters/index', [
            'book' => $book,
            'chapters' => $chapters,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create($bookId)
    {
        $book = Book::with(['author', 'category'])->findOrFail($bookId);

        $nextChapterNumber = Chapter::where('book_id', $bookId)
            ->max('chapter_number') + 1;

        return Inertia::render('admin/chapters/create', [
            'book' => $book,
            'nextChapterNumber' => $nextChapterNumber,
        ]);
    }

    public function store(Request $request, $bookId)
    {
        $book = Book::findOrFail($bookId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('chapters')->where(function ($query) use ($bookId) {
                    return $query->where('book_id', $bookId);
                }),
            ],
            'chapter_number' => [
                'nullable',
                'integer',
                'min:1',
                Rule::unique('chapters')->where(function ($query) use ($bookId) {
                    return $query->where('book_id', $bookId);
                }),
            ],
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:500',
            'is_free' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'reading_time_minutes' => 'nullable|integer|min:0',
            'is_published' => 'boolean',
        ]);

        $validated['book_id'] = $bookId;

        if (!$validated['slug']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (!isset($validated['chapter_number'])) {
            $validated['chapter_number'] = Chapter::where('book_id', $bookId)
                ->max('chapter_number') + 1;
        }

        if (!$validated['excerpt'] && $validated['content']) {
            $validated['excerpt'] = Str::limit(strip_tags($validated['content']), 300);
        }

        if (!isset($validated['reading_time_minutes']) && $validated['content']) {
            $wordCount = str_word_count(strip_tags($validated['content']));
            $validated['reading_time_minutes'] = max(1, ceil($wordCount / 200));
        }

        $validated['price'] = $validated['price'] ?? 0;
        $validated['is_free'] = $validated['is_free'] ?? false;
        $validated['is_published'] = $validated['is_published'] ?? true;

        $chapter = Chapter::create($validated);

        // Update book chapter count and reading time
        $book->updateTotalChapters();
        $book->updateReadingTime();

        return redirect()->route('admin.books.chapters.index', $bookId)
            ->with('success', 'Chapter created successfully.');
    }

    public function show($bookId, $chapterId)
    {
        $book = Book::with(['author', 'category'])->findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        return Inertia::render('admin/chapters/show', [
            'book' => $book,
            'chapter' => $chapter,
        ]);
    }

    public function edit($bookId, $chapterId)
    {
        $book = Book::with(['author', 'category'])->findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        return Inertia::render('admin/chapters/edit', [
            'book' => $book,
            'chapter' => $chapter,
        ]);
    }

    public function update(Request $request, $bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('chapters')->where(function ($query) use ($bookId) {
                    return $query->where('book_id', $bookId);
                })->ignore($chapter->id),
            ],
            'chapter_number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('chapters')->where(function ($query) use ($bookId) {
                    return $query->where('book_id', $bookId);
                })->ignore($chapter->id),
            ],
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:500',
            'is_free' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'reading_time_minutes' => 'nullable|integer|min:0',
            'is_published' => 'boolean',
        ]);

        if (!$validated['slug']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (!$validated['excerpt'] && $validated['content']) {
            $validated['excerpt'] = Str::limit(strip_tags($validated['content']), 300);
        }

        if (!isset($validated['reading_time_minutes']) && $validated['content']) {
            $wordCount = str_word_count(strip_tags($validated['content']));
            $validated['reading_time_minutes'] = max(1, ceil($wordCount / 200));
        }

        $validated['price'] = $validated['price'] ?? 0;

        $chapter->update($validated);

        // Update book reading time
        $book->updateReadingTime();

        return redirect()->route('admin.books.chapters.index', $bookId)
            ->with('success', 'Chapter updated successfully.');
    }

    public function destroy($bookId, $chapterId)
    {
        $book = Book::findOrFail($bookId);
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);

        $chapter->delete();

        // Update book chapter count and reading time
        $book->updateTotalChapters();
        $book->updateReadingTime();

        return redirect()->route('admin.books.chapters.index', $bookId)
            ->with('success', 'Chapter deleted successfully.');
    }

    public function togglePublished($bookId, $chapterId)
    {
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $chapter->update(['is_published' => !$chapter->is_published]);

        return back()->with('success', 'Chapter publication status updated successfully.');
    }

    public function toggleFree($bookId, $chapterId)
    {
        $chapter = Chapter::where('book_id', $bookId)->findOrFail($chapterId);
        $chapter->update([
            'is_free' => !$chapter->is_free,
            'price' => $chapter->is_free ? 0 : $chapter->price
        ]);

        return back()->with('success', 'Chapter access type updated successfully.');
    }

    public function reorder(Request $request, $bookId)
    {
        $request->validate([
            'chapters' => 'required|array',
            'chapters.*.id' => 'required|exists:chapters,id',
            'chapters.*.chapter_number' => 'required|integer|min:1',
        ]);

        foreach ($request->chapters as $chapterData) {
            Chapter::where('id', $chapterData['id'])
                ->where('book_id', $bookId)
                ->update(['chapter_number' => $chapterData['chapter_number']]);
        }

        return back()->with('success', 'Chapters reordered successfully.');
    }

    public function bulkDelete(Request $request, $bookId)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapters,id',
        ]);

        $book = Book::findOrFail($bookId);

        Chapter::where('book_id', $bookId)
            ->whereIn('id', $request->ids)
            ->delete();

        // Update book chapter count and reading time
        $book->updateTotalChapters();
        $book->updateReadingTime();

        return back()->with('success', count($request->ids) . ' chapters deleted successfully.');
    }

    public function bulkPublish(Request $request, $bookId)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapters,id',
        ]);

        Chapter::where('book_id', $bookId)
            ->whereIn('id', $request->ids)
            ->update(['is_published' => true]);

        return back()->with('success', count($request->ids) . ' chapters published successfully.');
    }

    public function bulkUnpublish(Request $request, $bookId)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapters,id',
        ]);

        Chapter::where('book_id', $bookId)
            ->whereIn('id', $request->ids)
            ->update(['is_published' => false]);

        return back()->with('success', count($request->ids) . ' chapters unpublished successfully.');
    }

    public function bulkSetFree(Request $request, $bookId)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapters,id',
        ]);

        Chapter::where('book_id', $bookId)
            ->whereIn('id', $request->ids)
            ->update(['is_free' => true, 'price' => 0]);

        return back()->with('success', count($request->ids) . ' chapters set as free successfully.');
    }

    public function bulkSetPaid(Request $request, $bookId)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chapters,id',
            'price' => 'required|numeric|min:0',
        ]);

        Chapter::where('book_id', $bookId)
            ->whereIn('id', $request->ids)
            ->update(['is_free' => false, 'price' => $request->price]);

        return back()->with('success', count($request->ids) . ' chapters set as paid successfully.');
    }
}
