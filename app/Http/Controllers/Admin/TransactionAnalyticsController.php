<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Book;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class TransactionAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', '30d');

        // Calculate date range based on period
        $endDate = Carbon::now();
        $startDate = match ($period) {
            '7d' => $endDate->clone()->subDays(7),
            '30d' => $endDate->clone()->subDays(30),
            '90d' => $endDate->clone()->subDays(90),
            '1y' => $endDate->clone()->subYear(),
            default => $endDate->clone()->subDays(30),
        };

        $analytics = [
            'total_revenue' => $this->getTotalRevenue($startDate, $endDate),
            'total_transactions' => $this->getTotalTransactions($startDate, $endDate),
            'average_transaction_value' => $this->getAverageTransactionValue($startDate, $endDate),
            'conversion_rate' => $this->getConversionRate($startDate, $endDate),

            'daily_revenue' => $this->getDailyRevenue($startDate, $endDate),
            'monthly_revenue' => $this->getMonthlyRevenue($startDate, $endDate),

            'revenue_by_type' => $this->getRevenueByType($startDate, $endDate),
            'status_breakdown' => $this->getStatusBreakdown($startDate, $endDate),

            'top_books' => $this->getTopBooks($startDate, $endDate),
            'top_chapters' => $this->getTopChapters($startDate, $endDate),

            'payment_methods' => $this->getPaymentMethods($startDate, $endDate),
            'user_analytics' => $this->getUserAnalytics($startDate, $endDate),
        ];

        return Inertia::render('admin/transactions/analytics', [
            'analytics' => $analytics,
            'period' => $period,
        ]);
    }

    private function getTotalRevenue($startDate, $endDate)
    {
        return Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');
    }

    private function getTotalTransactions($startDate, $endDate)
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])->count();
    }

    private function getAverageTransactionValue($startDate, $endDate)
    {
        $total = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->avg('total_amount');

        return $total ?? 0;
    }

    private function getConversionRate($startDate, $endDate)
    {
        $totalTransactions = Transaction::whereBetween('created_at', [$startDate, $endDate])->count();
        $paidTransactions = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return $totalTransactions > 0 ? ($paidTransactions / $totalTransactions) * 100 : 0;
    }

    private function getDailyRevenue($startDate, $endDate)
    {
        return Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('Y-m-d'),
                    'revenue' => (float) $item->revenue,
                    'transactions' => $item->transactions,
                ];
            });
    }

    private function getMonthlyRevenue($startDate, $endDate)
    {
        $monthly = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $result = [];
        $previousRevenue = null;

        foreach ($monthly as $item) {
            $growthRate = 0;
            if ($previousRevenue !== null && $previousRevenue > 0) {
                $growthRate = (($item->revenue - $previousRevenue) / $previousRevenue) * 100;
            }

            $result[] = [
                'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                'revenue' => (float) $item->revenue,
                'transactions' => $item->transactions,
                'growth_rate' => $growthRate,
            ];

            $previousRevenue = $item->revenue;
        }

        return $result;
    }

    private function getRevenueByType($startDate, $endDate)
    {
        $bookRevenue = Transaction::where('payment_status', 'paid')
            ->where('type', 'book_purchase')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        $bookTransactions = Transaction::where('payment_status', 'paid')
            ->where('type', 'book_purchase')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $chapterRevenue = Transaction::where('payment_status', 'paid')
            ->where('type', 'chapter_purchase')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        $chapterTransactions = Transaction::where('payment_status', 'paid')
            ->where('type', 'chapter_purchase')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $totalRevenue = $bookRevenue + $chapterRevenue;

        return [
            'book_purchase' => [
                'revenue' => (float) $bookRevenue,
                'transactions' => $bookTransactions,
                'percentage' => $totalRevenue > 0 ? ($bookRevenue / $totalRevenue) * 100 : 0,
            ],
            'chapter_purchase' => [
                'revenue' => (float) $chapterRevenue,
                'transactions' => $chapterTransactions,
                'percentage' => $totalRevenue > 0 ? ($chapterRevenue / $totalRevenue) * 100 : 0,
            ],
        ];
    }

    private function getStatusBreakdown($startDate, $endDate)
    {
        $total = Transaction::whereBetween('created_at', [$startDate, $endDate])->count();

        return Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'payment_status as status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('payment_status')
            ->get()
            ->map(function ($item) use ($total) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                    'percentage' => $total > 0 ? ($item->count / $total) * 100 : 0,
                    'revenue' => (float) $item->revenue,
                ];
            });
    }

    private function getTopBooks($startDate, $endDate)
    {
        $books = TransactionItem::join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('books', 'transaction_items.item_id', '=', 'books.id')
            ->join('users as authors', 'books.author_id', '=', 'authors.id')
            ->where('transactions.payment_status', 'paid')
            ->where('transaction_items.item_type', 'book')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->select(
                'books.id',
                'books.title',
                'authors.name as author',
                DB::raw('SUM(transaction_items.price * transaction_items.quantity) as revenue'),
                DB::raw('SUM(transaction_items.quantity) as transactions')
            )
            ->groupBy('books.id', 'books.title', 'authors.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'author' => $item->author,
                    'revenue' => (float) $item->revenue,
                    'transactions' => $item->transactions,
                ];
            });

        // Return empty array if no data
        return $books->isEmpty() ? [] : $books;
    }

    private function getTopChapters($startDate, $endDate)
    {
        $chapters = TransactionItem::join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('chapters', 'transaction_items.item_id', '=', 'chapters.id')
            ->join('books', 'chapters.book_id', '=', 'books.id')
            ->where('transactions.payment_status', 'paid')
            ->where('transaction_items.item_type', 'chapter')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->select(
                'chapters.id',
                'chapters.title',
                'books.title as book_title',
                DB::raw('SUM(transaction_items.price * transaction_items.quantity) as revenue'),
                DB::raw('SUM(transaction_items.quantity) as transactions')
            )
            ->groupBy('chapters.id', 'chapters.title', 'books.title')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'book_title' => $item->book_title,
                    'revenue' => (float) $item->revenue,
                    'transactions' => $item->transactions,
                ];
            });

        // Return empty array if no data
        return $chapters->isEmpty() ? [] : $chapters;
    }

    private function getPaymentMethods($startDate, $endDate)
    {
        $total = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'payment_method as method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('payment_method')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) use ($total) {
                return [
                    'method' => $item->method ?? 'Unknown',
                    'count' => $item->count,
                    'percentage' => $total > 0 ? ($item->count / $total) * 100 : 0,
                    'revenue' => (float) $item->revenue,
                ];
            });
    }

    private function getUserAnalytics($startDate, $endDate)
    {
        // Get users who made transactions in this period
        $transactionUserIds = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->pluck('user_id')
            ->unique();

        // Get users who made transactions before this period
        $previousUserIds = Transaction::where('payment_status', 'paid')
            ->where('created_at', '<', $startDate)
            ->pluck('user_id')
            ->unique();

        $newCustomers = $transactionUserIds->diff($previousUserIds)->count();
        $returningCustomers = $transactionUserIds->intersect($previousUserIds)->count();
        $totalCustomers = $transactionUserIds->count();

        $averageOrderValue = Transaction::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->avg('total_amount') ?? 0;

        return [
            'new_customers' => $newCustomers,
            'returning_customers' => $returningCustomers,
            'total_customers' => $totalCustomers,
            'average_order_value' => (float) $averageOrderValue,
        ];
    }
}
