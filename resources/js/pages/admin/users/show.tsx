import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type Transaction } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    User as UserIcon, 
    Mail, 
    Shield, 
    Calendar, 
    DollarSign, 
    BookOpen, 
    Star,
    TrendingUp,
    Activity,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface UserStats {
    total_transactions: number;
    total_spent: number;
    total_reviews: number;
    books_purchased: number;
    chapters_purchased: number;
    reading_progress_count: number;
    completed_chapters: number;
}

interface MonthlyActivity {
    month: string;
    transactions: number;
    spending: number;
}

interface ReadingProgress {
    id: string;
    chapter: {
        id: string;
        title: string;
        book: {
            id: string;
            title: string;
        };
    };
    progress_percentage: number;
    is_completed: boolean;
    updated_at: string;
}

interface AdminUsersShowProps {
    user: User & {
        transactions: Transaction[];
        reviews: any[];
    };
    stats: UserStats;
    monthlyActivity: MonthlyActivity[];
    recentProgress: ReadingProgress[];
}

export default function AdminUsersShow({ user, stats, monthlyActivity, recentProgress }: AdminUsersShowProps) {
    const [deleteDialog, setDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Manajemen Pengguna',
            href: '/admin/users',
        },
        {
            title: user.name,
            href: `/admin/users/${user.id}`,
        },
    ];

    const toggleRole = () => {
        router.patch(`/admin/users/${user.id}/toggle-role`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleDelete = () => {
        setDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/users/${user.id}`, {
            onSuccess: () => {
                router.visit('/admin/users');
            }
        });
        setDeleteDialog(false);
    };

    const getRoleColor = (role: string) => {
        return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role: string) => {
        return role === 'admin' ? 'Admin' : 'User';
    };

    const getVerificationBadge = (emailVerifiedAt: string | null | undefined) => {
        return emailVerifiedAt ? (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Terverifikasi
            </span>
        ) : (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Belum Verifikasi
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatShortDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengguna - ${user.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pengguna</h1>
                    <Link
                        href="/admin/users"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pengguna
                    </Link>
                </div>

                {/* User Profile Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    {user.avatar_url ? (
                                        <img 
                                            src={user.avatar_url} 
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-8 w-8 text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            <Shield className="h-3 w-3 mr-1" />
                                            {getRoleLabel(user.role)}
                                        </span>
                                        {getVerificationBadge(user.email_verified_at)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleRole}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Ubah Role
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                >
                                    Hapus Pengguna
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Bergabung</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{formatShortDate(user.created_at)}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Terakhir Update</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{formatShortDate(user.updated_at)}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">ID Pengguna</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">{user.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_transactions}</p>
                                <p className="text-xs text-gray-500">Total: {formatCurrency(stats.total_spent)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Buku & Chapter</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.books_purchased + stats.chapters_purchased}</p>
                                <p className="text-xs text-gray-500">{stats.books_purchased} Buku, {stats.chapters_purchased} Chapter</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Review</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_reviews}</p>
                                <p className="text-xs text-gray-500">Total review diberikan</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress Baca</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed_chapters}</p>
                                <p className="text-xs text-gray-500">Dari {stats.reading_progress_count} chapter</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaksi Terbaru</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">5 transaksi terakhir pengguna ini</p>
                            {user.transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {user.transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-700 pb-2">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{transaction.transaction_code}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatShortDate(transaction.created_at)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.total_amount)}</div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    transaction.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                    transaction.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {transaction.payment_status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <Link
                                            href="/admin/transactions"
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Lihat Semua Transaksi
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Belum ada transaksi
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reading Progress */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Progress Membaca</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Aktivitas membaca terbaru</p>
                            {recentProgress.length > 0 ? (
                                <div className="space-y-4">
                                    {recentProgress.map((progress) => (
                                        <div key={progress.id} className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-700 pb-2">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-gray-900 dark:text-white">{progress.chapter.title}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    {progress.chapter.book.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatShortDate(progress.updated_at)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {progress.progress_percentage}%
                                                </div>
                                                {progress.is_completed && (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        Selesai
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Belum ada aktivitas membaca
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Activity Chart */}
                {monthlyActivity.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Aktivitas Bulanan</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Transaksi dan pengeluaran dalam 6 bulan terakhir</p>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                {monthlyActivity.map((activity, index) => (
                                    <div key={index} className="text-center p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.month}</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{activity.transactions}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {formatCurrency(activity.spending)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus pengguna "{user.name}"? 
                                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data pengguna secara permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialog(false)}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>
                                Hapus Pengguna
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}