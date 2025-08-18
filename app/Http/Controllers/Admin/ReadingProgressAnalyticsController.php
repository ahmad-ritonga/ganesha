<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReadingProgress;
use App\Models\User;
use App\Models\Book;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReadingProgressAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Get date range parameters
        $startDate = $request->get('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        // Overall reading statistics
        $totalReadingProgress = ReadingProgress::count();
        $completedReadings = ReadingProgress::where('progress_percentage', 100)->count();
        $averageProgress = ReadingProgress::avg('progress_percentage');
        $activeReaders = ReadingProgress::whereBetween('updated_at', [$startDate, $endDate])
            ->distinct('user_id')
            ->count('user_id');

        // Reading progress over time (daily for last 30 days)
        $dailyProgress = ReadingProgress::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as new_readings'),
            DB::raw('SUM(CASE WHEN progress_percentage = 100 THEN 1 ELSE 0 END) as completions')
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'new_readings' => (int) $item->new_readings,
                    'completions' => (int) $item->completions,
                ];
            });

        // Progress distribution by percentage ranges
        $progressDistribution = [
            '0-20%' => ReadingProgress::whereBetween('progress_percentage', [0, 20])->count(),
            '21-40%' => ReadingProgress::whereBetween('progress_percentage', [21, 40])->count(),
            '41-60%' => ReadingProgress::whereBetween('progress_percentage', [41, 60])->count(),
            '61-80%' => ReadingProgress::whereBetween('progress_percentage', [61, 80])->count(),
            '81-99%' => ReadingProgress::whereBetween('progress_percentage', [81, 99])->count(),
            '100%' => ReadingProgress::where('progress_percentage', 100)->count(),
        ];

        // Top books by reading activity
        $topBooksByReadings = Book::with('author')
            ->whereHas('chapters.readingProgress')
            ->withCount(['chapters as reading_sessions_count' => function ($query) {
                $query->join('reading_progress', 'chapters.id', '=', 'reading_progress.chapter_id');
            }])
            ->orderBy('reading_sessions_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($book) {
                $totalReadings = ReadingProgress::whereHas('chapter', function ($query) use ($book) {
                    $query->where('book_id', $book->id);
                })->count();

                $completedReadings = ReadingProgress::whereHas('chapter', function ($query) use ($book) {
                    $query->where('book_id', $book->id);
                })->where('progress_percentage', 100)->count();

                $averageProgress = ReadingProgress::whereHas('chapter', function ($query) use ($book) {
                    $query->where('book_id', $book->id);
                })->avg('progress_percentage');

                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author ? $book->author->name : 'Unknown Author',
                    'total_readings' => $totalReadings,
                    'completed_readings' => $completedReadings,
                    'completion_rate' => $totalReadings > 0 ? round(($completedReadings / $totalReadings) * 100, 1) : 0,
                    'average_progress' => round($averageProgress, 1),
                ];
            });

        // Chapter-level analytics
        $chapterAnalytics = Chapter::with('book')
            ->whereHas('readingProgress')
            ->withCount('readingProgress as total_readings')
            ->orderBy('total_readings', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($chapter) {
                $totalReadings = $chapter->total_readings;
                $completedReadings = ReadingProgress::where('chapter_id', $chapter->id)
                    ->where('progress_percentage', 100)->count();

                return [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'book_title' => $chapter->book->title,
                    'book_id' => $chapter->book_id,
                    'total_readings' => $totalReadings,
                    'completed_readings' => $completedReadings,
                    'completion_rate' => $totalReadings > 0 ? round(($completedReadings / $totalReadings) * 100, 1) : 0,
                    'reading_time_minutes' => $chapter->reading_time_minutes ?? 0,
                ];
            });

        // Reading patterns by hour of day
        $readingPatterns = ReadingProgress::select(
            DB::raw('HOUR(updated_at) as hour'),
            DB::raw('COUNT(*) as activity_count')
        )
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->groupBy(DB::raw('HOUR(updated_at)'))
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => (int) $item->hour,
                    'activity_count' => (int) $item->activity_count,
                ];
            });

        // Average reading speed (chapters per day for active readers)
        $readingSpeed = ReadingProgress::select('user_id')
            ->where('progress_percentage', 100)
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->groupBy('user_id')
            ->get()
            ->map(function ($item) use ($startDate, $endDate) {
                $completedChapters = ReadingProgress::where('user_id', $item->user_id)
                    ->where('progress_percentage', 100)
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count();

                $daysDiff = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;

                return [
                    'user_id' => $item->user_id,
                    'chapters_per_day' => round($completedChapters / $daysDiff, 2),
                ];
            });

        $averageReadingSpeed = $readingSpeed->avg('chapters_per_day');

        // Recent reading activity
        $recentActivity = ReadingProgress::with(['user', 'chapter.book'])
            ->orderBy('updated_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($progress) {
                return [
                    'id' => $progress->id,
                    'user' => [
                        'id' => $progress->user->id,
                        'name' => $progress->user->name,
                        'email' => $progress->user->email,
                    ],
                    'book' => [
                        'id' => $progress->chapter->book->id,
                        'title' => $progress->chapter->book->title,
                        'author' => $progress->chapter->book->author ? $progress->chapter->book->author->name : 'Unknown Author',
                    ],
                    'chapter' => [
                        'id' => $progress->chapter->id,
                        'title' => $progress->chapter->title,
                    ],
                    'progress_percentage' => $progress->progress_percentage,
                    'reading_time_minutes' => $progress->chapter->reading_time_minutes ?? 0,
                    'updated_at' => $progress->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('admin/analytics/reading-progress', [
            'analytics' => [
                'overview' => [
                    'total_reading_progress' => $totalReadingProgress,
                    'completed_readings' => $completedReadings,
                    'completion_rate' => $totalReadingProgress > 0 ? round(($completedReadings / $totalReadingProgress) * 100, 1) : 0,
                    'average_progress' => round($averageProgress, 1),
                    'active_readers' => $activeReaders,
                    'average_reading_speed' => round($averageReadingSpeed, 2),
                ],
                'daily_progress' => $dailyProgress,
                'progress_distribution' => $progressDistribution,
                'top_books' => $topBooksByReadings,
                'chapter_analytics' => $chapterAnalytics,
                'reading_patterns' => $readingPatterns,
                'recent_activity' => $recentActivity,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
