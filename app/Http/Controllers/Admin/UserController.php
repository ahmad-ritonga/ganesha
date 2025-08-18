<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Review;
use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by registration date
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by status (verified email)
        if ($request->has('verified')) {
            if ($request->verified === 'yes') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->verified === 'no') {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get user statistics
        $stats = [
            'total_users' => User::count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'new_users_this_month' => User::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'active_users_this_month' => User::whereHas('transactions', function ($q) {
                $q->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year);
            })->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'verified' => $request->verified,
            ],
        ]);
    }

    public function show(User $user)
    {
        // Load relationships
        $user->load(['transactions' => function ($query) {
            $query->latest()->limit(5);
        }, 'reviews' => function ($query) {
            $query->latest()->limit(5);
        }]);

        // Get user statistics
        $stats = [
            'total_transactions' => $user->transactions()->count(),
            'total_spent' => $user->transactions()
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'total_reviews' => $user->reviews()->count(),
            'books_purchased' => $user->transactions()
                ->where('payment_status', 'paid')
                ->where('type', 'book_purchase')
                ->count(),
            'chapters_purchased' => $user->transactions()
                ->where('payment_status', 'paid')
                ->where('type', 'chapter_purchase')
                ->count(),
            'reading_progress_count' => ReadingProgress::where('user_id', $user->id)->count(),
            'completed_chapters' => ReadingProgress::where('user_id', $user->id)
                ->where('progress_percentage', 100)
                ->count(),
        ];

        // Get monthly activity data (last 6 months)
        $monthlyActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlyActivity[] = [
                'month' => $date->format('M Y'),
                'transactions' => $user->transactions()
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'spending' => $user->transactions()
                    ->where('payment_status', 'paid')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->sum('total_amount'),
            ];
        }

        // Get recent reading progress
        $recentProgress = ReadingProgress::where('user_id', $user->id)
            ->with(['chapter.book'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'stats' => $stats,
            'monthlyActivity' => $monthlyActivity,
            'recentProgress' => $recentProgress,
        ]);
    }

    public function toggleRole(User $user)
    {
        $newRole = $user->role === 'admin' ? 'user' : 'admin';
        $user->update(['role' => $newRole]);

        return back()->with('success', "Role pengguna berhasil diubah menjadi {$newRole}");
    }

    public function destroy(User $user)
    {
        // Prevent deleting self
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri');
        }

        // Prevent deleting other admins (optional security measure)
        if ($user->role === 'admin') {
            return back()->with('error', 'Tidak dapat menghapus akun admin lain');
        }

        $user->delete();

        return back()->with('success', 'Pengguna berhasil dihapus');
    }
}
