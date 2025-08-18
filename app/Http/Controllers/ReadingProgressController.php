<?php

namespace App\Http\Controllers;

use App\Models\ReadingProgress;
use App\Models\Chapter;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReadingProgressController extends Controller
{
    /**
     * Display reading progress for authenticated user
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's reading progress with related data
        $progressData = ReadingProgress::with(['chapter.book'])
            ->forUser($user->id)
            ->recentFirst()
            ->paginate(10);

        // Get reading statistics
        $stats = [
            'total_chapters_read' => ReadingProgress::forUser($user->id)->completed()->count(),
            'chapters_in_progress' => ReadingProgress::forUser($user->id)->inProgress()->count(),
            'total_books_completed' => $this->getCompletedBooksCount($user->id),
            'total_reading_time' => $this->getTotalReadingTime($user->id),
        ];

        return Inertia::render('user/reading-progress/index', [
            'progressData' => $progressData,
            'stats' => $stats,
        ]);
    }

    /**
     * Update reading progress for a chapter
     */
    public function update(Request $request, Chapter $chapter)
    {
        $request->validate([
            'progress_percentage' => 'required|integer|min:0|max:100',
            'last_position' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Check if user has access to this chapter
        if (!$user->canAccessChapter($chapter)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke chapter ini'
            ], 403);
        }

        $progress = ReadingProgress::updateProgress(
            $user->id,
            $chapter->id,
            $request->progress_percentage,
            $request->last_position
        );

        return response()->json([
            'success' => true,
            'progress' => $progress,
            'message' => 'Progress berhasil diperbarui'
        ]);
    }

    /**
     * Get reading progress for a specific chapter
     */
    public function show(Chapter $chapter)
    {
        $user = Auth::user();

        $progress = ReadingProgress::getUserProgress($user->id, $chapter->id);

        return response()->json([
            'progress' => $progress,
        ]);
    }

    /**
     * Get book completion statistics
     */
    public function bookStats(Book $book)
    {
        $user = Auth::user();

        $completionRate = ReadingProgress::getBookCompletionRate($user->id, $book->id);
        $bookProgress = ReadingProgress::getUserBookProgress($user->id, $book->id);

        $stats = [
            'completion_rate' => $completionRate,
            'total_chapters' => $book->chapters()->count(),
            'completed_chapters' => $bookProgress->where('progress_percentage', 100)->count(),
            'in_progress_chapters' => $bookProgress->where('progress_percentage', '>', 0)->where('progress_percentage', '<', 100)->count(),
            'chapters_progress' => $bookProgress->keyBy('chapter_id'),
        ];

        return response()->json($stats);
    }

    /**
     * Mark chapter as completed
     */
    public function markCompleted(Chapter $chapter)
    {
        $user = Auth::user();

        if (!$user->canAccessChapter($chapter)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke chapter ini'
            ], 403);
        }

        $progress = ReadingProgress::markAsCompleted($user->id, $chapter->id);

        return response()->json([
            'success' => true,
            'progress' => $progress,
            'message' => 'Chapter ditandai sebagai selesai'
        ]);
    }

    /**
     * Get reading analytics for user
     */
    public function analytics()
    {
        $user = Auth::user();

        // Monthly reading progress
        $monthlyProgress = ReadingProgress::forUser($user->id)
            ->selectRaw('MONTH(completed_at) as month, YEAR(completed_at) as year, COUNT(*) as completed_chapters')
            ->whereNotNull('completed_at')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Reading streaks
        $recentActivity = ReadingProgress::forUser($user->id)
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->limit(30)
            ->get();

        // Most read categories
        $categoryStats = ReadingProgress::with(['chapter.book.category'])
            ->forUser($user->id)
            ->completed()
            ->get()
            ->groupBy('chapter.book.category.name')
            ->map(function ($items) {
                return $items->count();
            })
            ->sortDesc()
            ->take(5);

        return Inertia::render('user/reading-progress/analytics', [
            'monthlyProgress' => $monthlyProgress,
            'recentActivity' => $recentActivity,
            'categoryStats' => $categoryStats,
        ]);
    }

    /**
     * Private helper methods
     */
    private function getCompletedBooksCount($userId)
    {
        $books = Book::with('chapters')->get();
        $completedCount = 0;

        foreach ($books as $book) {
            $completionRate = ReadingProgress::getBookCompletionRate($userId, $book->id);
            if ($completionRate >= 100) {
                $completedCount++;
            }
        }

        return $completedCount;
    }

    private function getTotalReadingTime($userId)
    {
        $completedChapters = ReadingProgress::with('chapter')
            ->forUser($userId)
            ->completed()
            ->get();

        return $completedChapters->sum('chapter.reading_time_minutes');
    }
}
