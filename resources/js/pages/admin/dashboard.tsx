import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type Book, type Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    BookOpen, 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    Star,
    Eye,
    CheckCircle,
    BarChart3
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardStats {
    users: {
        total: number;
        growth: number;
        verified: number;
        new_this_month: number;
    };
    books: {
        total: number;
        published: number;
        growth: number;
        new_this_month: number;
    };
    transactions: {
        total: number;
        paid: number;
        revenue: number;
        revenue_this_month: number;
        revenue_growth: number;
    };
    content: {
        categories: number;
        chapters: number;
        published_chapters: number;
        reviews: number;
        average_rating: number;
    };
    engagement: {
        reading_progress: number;
        completed_chapters: number;
        completion_rate: number;
    };
}

interface DashboardProps {
    stats: DashboardStats;
    recentUsers: User[];
    recentBooks: (Book & { author: User })[];
    recentTransactions: (Transaction & { user: User })[];
}

export default function Dashboard({ stats, recentUsers, recentBooks, recentTransactions }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
        );
    };

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            {/* Main Content Container with proper padding */}
            <div className="flex-1 p-6 lg:p-8 bg-gray-50 dark:bg-neutral-900 overflow-auto">
                <div className="max-w-full space-y-8">
                    
                    {/* Dashboard Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Selamat datang kembali! Berikut adalah ringkasan aktivitas sistem Anda.
                        </p>
                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Pengguna
                                </CardTitle>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.users.total.toLocaleString()}
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    {getGrowthIcon(stats.users.growth)}
                                    <span className={getGrowthColor(stats.users.growth)}>
                                        {stats.users.growth >= 0 ? '+' : ''}{stats.users.growth}%
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">dari bulan lalu</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Buku
                                </CardTitle>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.books.total.toLocaleString()}
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    {getGrowthIcon(stats.books.growth)}
                                    <span className={getGrowthColor(stats.books.growth)}>
                                        {stats.books.growth >= 0 ? '+' : ''}{stats.books.growth}%
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">dari bulan lalu</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Pendapatan
                                </CardTitle>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(stats.transactions.revenue)}
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    {getGrowthIcon(stats.transactions.revenue_growth)}
                                    <span className={getGrowthColor(stats.transactions.revenue_growth)}>
                                        {stats.transactions.revenue_growth >= 0 ? '+' : ''}{stats.transactions.revenue_growth}%
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">dari bulan lalu</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Rating Rata-rata
                                </CardTitle>
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.content.average_rating}/5
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Dari {stats.content.reviews} review
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Konten
                                    </CardTitle>
                                    <CardDescription className="text-gray-500 dark:text-gray-400">
                                        Statistik konten platform
                                    </CardDescription>
                                </div>
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Kategori:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.content.categories}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Chapter:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.content.chapters}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Buku Terbit:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.books.published}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Engagement
                                    </CardTitle>
                                    <CardDescription className="text-gray-500 dark:text-gray-400">
                                        Aktivitas pengguna
                                    </CardDescription>
                                </div>
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                    <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress Baca:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.engagement.reading_progress}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Chapter Selesai:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.engagement.completed_chapters}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tingkat Selesai:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.engagement.completion_rate}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Transaksi
                                    </CardTitle>
                                    <CardDescription className="text-gray-500 dark:text-gray-400">
                                        Ringkasan transaksi
                                    </CardDescription>
                                </div>
                                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.transactions.total}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Berhasil:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {stats.transactions.paid}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-neutral-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Bulan Ini:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(stats.transactions.revenue_this_month)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Recent Users */}
                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Pengguna Terbaru
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    5 pengguna yang baru bergabung
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                {user.avatar_url ? (
                                                    <img 
                                                        src={user.avatar_url} 
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium text-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </div>
                                            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-100 dark:border-neutral-700">
                                        <Link 
                                            href="/admin/users"
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Lihat semua pengguna →
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Books */}
                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Buku Terbaru
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    5 buku yang baru ditambahkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBooks.map((book) => (
                                        <div key={book.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-600 rounded flex items-center justify-center flex-shrink-0">
                                                {book.cover_image ? (
                                                    <img 
                                                        src={book.cover_image} 
                                                        alt={book.title}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {book.title}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    oleh {book.author.name} • {formatDate(book.created_at)}
                                                </div>
                                            </div>
                                            <Badge variant={book.is_published ? 'default' : 'secondary'}>
                                                {book.is_published ? 'Terbit' : 'Draft'}
                                            </Badge>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-100 dark:border-neutral-700">
                                        <Link 
                                            href="/admin/books"
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Lihat semua buku →
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions */}
                        <Card className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Transaksi Terbaru
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    5 transaksi berhasil terbaru
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {transaction.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {transaction.transaction_code} • {formatDate(transaction.created_at)}
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(transaction.total_amount)}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-100 dark:border-neutral-700">
                                        <Link 
                                            href="/admin/transactions"
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Lihat semua transaksi →
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}