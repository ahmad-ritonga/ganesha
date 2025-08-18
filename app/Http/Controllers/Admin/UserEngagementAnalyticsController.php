<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ReadingProgress;
use App\Models\Transaction;
use App\Models\Review;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class UserEngagementAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Get date range parameters
        $startDate = $request->get('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        // Overall user engagement statistics
        $totalUsers = User::where('role', 'user')->count();
        $activeUsers = ReadingProgress::whereBetween('updated_at', [$startDate, $endDate])
            ->distinct('user_id')
            ->count();
        $newUsers = User::where('role', 'user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // User registration over time (daily)
        $dailyRegistrations = User::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as registrations')
        )
            ->where('role', 'user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'registrations' => (int) $item->registrations,
                ];
            });

        // Daily active users
        $dailyActiveUsers = ReadingProgress::select(
            DB::raw('DATE(updated_at) as date'),
            DB::raw('COUNT(DISTINCT user_id) as active_users')
        )
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(updated_at)'))
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'active_users' => (int) $item->active_users,
                ];
            });

        // User engagement levels
        $engagementLevels = [
            'high' => 0, // Users with >10 reading sessions
            'medium' => 0, // Users with 3-10 reading sessions
            'low' => 0, // Users with 1-2 reading sessions
            'inactive' => 0, // Users with 0 reading sessions
        ];

        $userEngagement = User::where('role', 'user')
            ->get()
            ->map(function ($user) use ($startDate, $endDate) {
                $sessionsCount = ReadingProgress::where('user_id', $user->id)
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count();

                if ($sessionsCount > 10) {
                    return 'high';
                } elseif ($sessionsCount >= 3) {
                    return 'medium';
                } elseif ($sessionsCount >= 1) {
                    return 'low';
                } else {
                    return 'inactive';
                }
            });

        foreach ($userEngagement as $level) {
            $engagementLevels[$level]++;
        }

        // Top engaged users
        $topEngagedUsers = User::select('users.id', 'users.name', 'users.email', 'users.created_at')
            ->where('role', 'user')
            ->get()
            ->map(function ($user) use ($startDate, $endDate) {
                $readingSessions = ReadingProgress::where('user_id', $user->id)
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count();
                $completedReadings = ReadingProgress::where('user_id', $user->id)
                    ->where('progress_percentage', 100)
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->count();
                $reviewsCount = Review::where('user_id', $user->id)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->count();
                $purchasesCount = Transaction::where('user_id', $user->id)
                    ->where('payment_status', 'paid')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'member_since' => $user->created_at->format('Y-m-d'),
                    'reading_sessions' => $readingSessions,
                    'completed_readings' => $completedReadings,
                    'total_time_spent' => 0, // Will calculate from chapter reading_time_minutes if needed
                    'reviews_count' => $reviewsCount,
                    'purchases_count' => $purchasesCount,
                    'engagement_score' => $readingSessions * 2 + $completedReadings * 3 + $reviewsCount * 5 + $purchasesCount * 10,
                ];
            })
            ->sortByDesc('engagement_score')
            ->take(10)
            ->values();        // User activity patterns by hour of day
        $activityPatterns = ReadingProgress::select(
            DB::raw('HOUR(updated_at) as hour'),
            DB::raw('COUNT(DISTINCT user_id) as unique_users'),
            DB::raw('COUNT(*) as total_activities')
        )
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->groupBy(DB::raw('HOUR(updated_at)'))
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => (int) $item->hour,
                    'unique_users' => (int) $item->unique_users,
                    'total_activities' => (int) $item->total_activities,
                ];
            });

        // User retention analysis
        $retentionData = [];
        for ($i = 0; $i < 7; $i++) {
            $cohortDate = Carbon::parse($startDate)->addDays($i)->toDateString();
            $newUsersOnDate = User::where('role', 'user')
                ->whereDate('created_at', $cohortDate)
                ->pluck('id');

            if ($newUsersOnDate->count() > 0) {
                $retention = [];
                for ($j = 1; $j <= 7; $j++) {
                    $retentionDate = Carbon::parse($cohortDate)->addDays($j)->toDateString();
                    $activeUsersOnRetentionDate = ReadingProgress::whereIn('user_id', $newUsersOnDate)
                        ->whereDate('updated_at', $retentionDate)
                        ->distinct('user_id')
                        ->count();

                    $retention["day_$j"] = $newUsersOnDate->count() > 0
                        ? round(($activeUsersOnRetentionDate / $newUsersOnDate->count()) * 100, 1)
                        : 0;
                }

                $retentionData[] = [
                    'cohort_date' => $cohortDate,
                    'cohort_size' => $newUsersOnDate->count(),
                    'retention' => $retention,
                ];
            }
        }

        // User session duration analysis
        $sessionDurations = [
            '0-5 min' => 0,
            '6-15 min' => 0,
            '16-30 min' => 0,
            '31-60 min' => 0,
            '60+ min' => 0,
        ];

        // Since we don't have time_spent_minutes, we'll use chapter reading_time_minutes as approximation
        $readingProgressWithTime = ReadingProgress::with('chapter')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->get();

        foreach ($readingProgressWithTime as $progress) {
            if ($progress->chapter && $progress->chapter->reading_time_minutes) {
                $minutes = $progress->chapter->reading_time_minutes;
                if ($minutes <= 5) $sessionDurations['0-5 min']++;
                elseif ($minutes <= 15) $sessionDurations['6-15 min']++;
                elseif ($minutes <= 30) $sessionDurations['16-30 min']++;
                elseif ($minutes <= 60) $sessionDurations['31-60 min']++;
                else $sessionDurations['60+ min']++;
            }
        }

        // User conversion funnel
        $conversionFunnel = [
            'visitors' => $totalUsers,
            'readers' => ReadingProgress::distinct('user_id')->count(),
            'purchasers' => Transaction::where('payment_status', 'paid')->distinct('user_id')->count(),
            'reviewers' => Review::distinct('user_id')->count(),
        ];

        // Most popular content by user engagement
        $popularContent = Book::with('author')
            ->whereHas('chapters.readingProgress', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('updated_at', [$startDate, $endDate]);
            })
            ->limit(10)
            ->get()
            ->map(function ($book) use ($startDate, $endDate) {
                $uniqueReaders = ReadingProgress::whereHas('chapter', function ($query) use ($book) {
                    $query->where('book_id', $book->id);
                })
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->distinct('user_id')
                    ->count();

                $avgRating = Review::where('book_id', $book->id)->avg('rating');
                $totalReviews = Review::where('book_id', $book->id)->count();

                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author ? $book->author->name : 'Unknown Author',
                    'unique_readers' => $uniqueReaders,
                    'avg_rating' => round($avgRating, 1),
                    'total_reviews' => $totalReviews,
                ];
            })
            ->sortByDesc('unique_readers')
            ->values();

        return Inertia::render('admin/analytics/user-engagement', [
            'analytics' => [
                'overview' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'new_users' => $newUsers,
                    'activity_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 1) : 0,
                ],
                'daily_registrations' => $dailyRegistrations,
                'daily_active_users' => $dailyActiveUsers,
                'engagement_levels' => $engagementLevels,
                'top_engaged_users' => $topEngagedUsers,
                'activity_patterns' => $activityPatterns,
                'retention_data' => $retentionData,
                'session_durations' => $sessionDurations,
                'conversion_funnel' => $conversionFunnel,
                'popular_content' => $popularContent,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
