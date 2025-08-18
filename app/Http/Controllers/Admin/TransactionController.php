<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'items']);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('transaction_code', 'like', '%' . $request->search . '%')
                    ->orWhere('midtrans_order_id', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', function ($user) use ($request) {
                        $user->where('name', 'like', '%' . $request->search . '%')
                            ->orWhere('email', 'like', '%' . $request->search . '%');
                    });
            });
        }

        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->recentFirst()
            ->paginate(15)
            ->withQueryString();

        // Get statistics
        $stats = [
            'total_transactions' => Transaction::count(),
            'pending_transactions' => Transaction::pending()->count(),
            'paid_transactions' => Transaction::paid()->count(),
            'failed_transactions' => Transaction::failed()->count(),
            'expired_transactions' => Transaction::expired()->count(),
            'total_revenue' => Transaction::paid()->sum('total_amount'),
            'today_revenue' => Transaction::paid()->whereDate('paid_at', Carbon::today())->sum('total_amount'),
            'this_month_revenue' => Transaction::paid()->whereMonth('paid_at', Carbon::now()->month)->sum('total_amount'),
        ];

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'type', 'date_from', 'date_to']),
        ]);
    }

    public function show($transactionId)
    {
        $transaction = Transaction::with(['user', 'items', 'purchases'])
            ->findOrFail($transactionId);

        return Inertia::render('admin/transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    public function analytics(Request $request)
    {
        $period = $request->get('period', 'month'); // day, week, month, year

        $dateFormat = match ($period) {
            'day' => '%Y-%m-%d %H:00:00',
            'week' => '%Y-%m-%d',
            'month' => '%Y-%m-%d',
            'year' => '%Y-%m',
        };

        $startDate = match ($period) {
            'day' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
        };

        // Revenue analytics
        $revenueData = Transaction::selectRaw("
                DATE_FORMAT(paid_at, '{$dateFormat}') as period,
                SUM(total_amount) as revenue,
                COUNT(*) as transaction_count
            ")
            ->where('payment_status', 'paid')
            ->where('paid_at', '>=', $startDate)
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Transaction status distribution
        $statusDistribution = Transaction::selectRaw('
                payment_status,
                COUNT(*) as count,
                SUM(total_amount) as total_amount
            ')
            ->where('created_at', '>=', $startDate)
            ->groupBy('payment_status')
            ->get();

        // Payment type distribution
        $typeDistribution = Transaction::selectRaw('
                type,
                COUNT(*) as count,
                SUM(total_amount) as total_amount
            ')
            ->where('payment_status', 'paid')
            ->where('paid_at', '>=', $startDate)
            ->groupBy('type')
            ->get();

        // Top users by spending
        $topUsers = Transaction::selectRaw('
                user_id,
                SUM(total_amount) as total_spent,
                COUNT(*) as transaction_count
            ')
            ->with('user:id,name,email')
            ->where('payment_status', 'paid')
            ->where('paid_at', '>=', $startDate)
            ->groupBy('user_id')
            ->orderBy('total_spent', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('admin/transactions/analytics', [
            'revenueData' => $revenueData,
            'statusDistribution' => $statusDistribution,
            'typeDistribution' => $typeDistribution,
            'topUsers' => $topUsers,
            'period' => $period,
        ]);
    }

    public function export(Request $request)
    {
        $query = Transaction::with(['user', 'items']);

        // Apply same filters as index
        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->recentFirst()->get();

        $filename = 'transactions_' . Carbon::now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'Transaction Code',
                'User Name',
                'User Email',
                'Type',
                'Total Amount',
                'Payment Status',
                'Payment Method',
                'Midtrans Order ID',
                'Created At',
                'Paid At',
                'Items'
            ]);

            foreach ($transactions as $transaction) {
                $items = $transaction->items->pluck('item_title')->implode('; ');

                fputcsv($file, [
                    $transaction->transaction_code,
                    $transaction->user->name,
                    $transaction->user->email,
                    $transaction->type,
                    $transaction->total_amount,
                    $transaction->payment_status,
                    $transaction->payment_method,
                    $transaction->midtrans_order_id,
                    $transaction->created_at->format('Y-m-d H:i:s'),
                    $transaction->paid_at ? $transaction->paid_at->format('Y-m-d H:i:s') : '',
                    $items
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
