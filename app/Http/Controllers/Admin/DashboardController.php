<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Transaction;
use App\Models\Review;
use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Get current date for calculations
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();

        // User statistics
        $totalUsers = User::count();
        $usersLastMonth = User::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();
        $usersThisMonth = User::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();
        $usersGrowth = $usersLastMonth > 0 ?
            (($usersThisMonth - $usersLastMonth) / $usersLastMonth) * 100 : 100;

        // Book statistics
        $totalBooks = Book::count();
        $publishedBooks = Book::where('is_published', true)->count();
        $booksLastMonth = Book::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();
        $booksThisMonth = Book::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();
        $booksGrowth = $booksLastMonth > 0 ?
            (($booksThisMonth - $booksLastMonth) / $booksLastMonth) * 100 : 100;

        // Transaction statistics
        $totalTransactions = Transaction::count();
        $paidTransactions = Transaction::where('payment_status', 'paid')->count();
        $totalRevenue = Transaction::where('payment_status', 'paid')->sum('total_amount');
        $revenueThisMonth = Transaction::where('payment_status', 'paid')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('total_amount');
        $revenueLastMonth = Transaction::where('payment_status', 'paid')
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->sum('total_amount');
        $revenueGrowth = $revenueLastMonth > 0 ?
            (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100 : 100;

        // Chapter statistics  
        $totalChapters = Chapter::count();
        $publishedChapters = Chapter::where('is_published', true)->count();

        // Review statistics
        $totalReviews = Review::count();
        $averageRating = Review::avg('rating') ?? 0;

        // Reading progress statistics
        $totalReadingProgress = ReadingProgress::count();
        $completedChapters = ReadingProgress::where('progress_percentage', 100)->count();

        // Recent activities
        $recentUsers = User::latest()->limit(5)->get();
        $recentBooks = Book::with('author')->latest()->limit(5)->get();
        $recentTransactions = Transaction::with('user')
            ->where('payment_status', 'paid')
            ->latest()
            ->limit(5)
            ->get();

        // Statistics summary
        $stats = [
            'users' => [
                'total' => $totalUsers,
                'growth' => round($usersGrowth, 1),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'new_this_month' => $usersThisMonth,
            ],
            'books' => [
                'total' => $totalBooks,
                'published' => $publishedBooks,
                'growth' => round($booksGrowth, 1),
                'new_this_month' => $booksThisMonth,
            ],
            'transactions' => [
                'total' => $totalTransactions,
                'paid' => $paidTransactions,
                'revenue' => $totalRevenue,
                'revenue_this_month' => $revenueThisMonth,
                'revenue_growth' => round($revenueGrowth, 1),
            ],
            'content' => [
                'categories' => Category::count(),
                'chapters' => $totalChapters,
                'published_chapters' => $publishedChapters,
                'reviews' => $totalReviews,
                'average_rating' => round($averageRating, 1),
            ],
            'engagement' => [
                'reading_progress' => $totalReadingProgress,
                'completed_chapters' => $completedChapters,
                'completion_rate' => $totalReadingProgress > 0 ?
                    round(($completedChapters / $totalReadingProgress) * 100, 1) : 0,
            ],
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentBooks' => $recentBooks,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
