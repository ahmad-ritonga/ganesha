import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface TransactionAnalytics {
    total_revenue: number;
    total_transactions: number;
    average_transaction_value: number;
    conversion_rate: number;
    
    // Revenue by period
    daily_revenue: Array<{
        date: string;
        revenue: number;
        transactions: number;
    }>;
    
    monthly_revenue: Array<{
        month: string;
        revenue: number;
        transactions: number;
        growth_rate: number;
    }>;
    
    // Revenue by type
    revenue_by_type: {
        book_purchase: {
            revenue: number;
            transactions: number;
            percentage: number;
        };
        chapter_purchase: {
            revenue: number;
            transactions: number;
            percentage: number;
        };
    };
    
    // Status breakdown
    status_breakdown: Array<{
        status: string;
        count: number;
        percentage: number;
        revenue: number;
    }>;
    
    // Top performing items
    top_books: Array<{
        id: string;
        title: string;
        author: string;
        revenue: number;
        transactions: number;
    }>;
    
    top_chapters: Array<{
        id: string;
        title: string;
        book_title: string;
        revenue: number;
        transactions: number;
    }>;
    
    // Payment methods
    payment_methods: Array<{
        method: string;
        count: number;
        percentage: number;
        revenue: number;
    }>;
    
    // User analytics
    user_analytics: {
        new_customers: number;
        returning_customers: number;
        total_customers: number;
        average_order_value: number;
    };
}

interface AnalyticsProps {
    analytics: TransactionAnalytics;
    period: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Transaksi',
        href: '/admin/transactions',
    },
    {
        title: 'Analytics',
        href: '/admin/transactions/analytics',
    },
];

export default function TransactionAnalytics({ analytics, period = '30d' }: AnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatPercentage = (num: number) => {
        return `${num.toFixed(1)}%`;
    };

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        window.location.href = `/admin/transactions/analytics?period=${newPeriod}`;
    };

    const getStatusColor = (status: string) => {
        const colors = {
            paid: 'green',
            pending: 'yellow',
            failed: 'red',
            expired: 'gray',
        };
        return colors[status as keyof typeof colors] || 'gray';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Transaksi" />
            
            <div className="w-full">
                <div className="flex flex-col gap-4 lg:gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Transaksi</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Analisis mendalam tentang performa transaksi dan pendapatan
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="7d">7 Hari Terakhir</option>
                            <option value="30d">30 Hari Terakhir</option>
                            <option value="90d">90 Hari Terakhir</option>
                            <option value="1y">1 Tahun Terakhir</option>
                        </select>
                        <Link
                            href="/admin/transactions"
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
                        >
                            Kembali ke Transaksi
                        </Link>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <div className="flex items-center">
                            <div className="p-2 lg:p-3 rounded-full bg-green-100 dark:bg-green-900">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Pendapatan</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{formatCurrency(analytics.total_revenue)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <div className="flex items-center">
                            <div className="p-2 lg:p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Transaksi</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{formatNumber(analytics.total_transactions)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <div className="flex items-center">
                            <div className="p-2 lg:p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Rata-rata Transaksi</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{formatCurrency(analytics.average_transaction_value)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <div className="flex items-center">
                            <div className="p-2 lg:p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Conversion Rate</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{formatPercentage(analytics.conversion_rate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue by Type */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Pendapatan Berdasarkan Tipe</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm lg:text-base">Pembelian Buku</h3>
                                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{formatNumber(analytics.revenue_by_type.book_purchase.transactions)} transaksi</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(analytics.revenue_by_type.book_purchase.revenue)}
                                    </div>
                                    <div className="text-xs lg:text-sm text-blue-600 dark:text-blue-400">
                                        {formatPercentage(analytics.revenue_by_type.book_purchase.percentage)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm lg:text-base">Pembelian Chapter</h3>
                                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{formatNumber(analytics.revenue_by_type.chapter_purchase.transactions)} transaksi</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(analytics.revenue_by_type.chapter_purchase.revenue)}
                                    </div>
                                    <div className="text-xs lg:text-sm text-purple-600 dark:text-purple-400">
                                        {formatPercentage(analytics.revenue_by_type.chapter_purchase.percentage)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Status Transaksi</h2>
                        <div className="space-y-3">
                            {analytics.status_breakdown.map((status, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <div className={`w-3 h-3 rounded-full bg-${getStatusColor(status.status)}-500 mr-3 flex-shrink-0`}></div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize truncate">
                                            {status.status}
                                        </span>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {formatNumber(status.count)} ({formatPercentage(status.percentage)})
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {formatCurrency(status.revenue)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Analytics */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Analytics Pengguna</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                                {formatNumber(analytics.user_analytics.new_customers)}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">Pelanggan Baru</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {formatNumber(analytics.user_analytics.returning_customers)}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">Pelanggan Kembali</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {formatNumber(analytics.user_analytics.total_customers)}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">Total Pelanggan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg lg:text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {formatCurrency(analytics.user_analytics.average_order_value)}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">Rata-rata Order</div>
                        </div>
                    </div>
                </div>

                {/* Top Performing Items */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                    {/* Top Books */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Buku Terlaris</h2>
                        {analytics.top_books.length > 0 ? (
                            <div className="space-y-3 lg:space-y-4">
                                {analytics.top_books.map((book, index) => (
                                    <div key={book.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mr-2 lg:mr-3 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs lg:text-sm truncate">{book.title}</h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">by {book.author}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-3">
                                            <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(book.revenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatNumber(book.transactions)} terjual
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 lg:py-8">
                                <svg className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="mt-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400">Belum ada data penjualan buku</p>
                            </div>
                        )}
                    </div>

                    {/* Top Chapters */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Chapter Terlaris</h2>
                        {analytics.top_chapters.length > 0 ? (
                            <div className="space-y-3 lg:space-y-4">
                                {analytics.top_chapters.map((chapter, index) => (
                                    <div key={chapter.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold text-purple-600 dark:text-purple-400 mr-2 lg:mr-3 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs lg:text-sm truncate">{chapter.title}</h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">dari {chapter.book_title}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-3">
                                            <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(chapter.revenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatNumber(chapter.transactions)} terjual
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 lg:py-8">
                                <svg className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400">Belum ada data penjualan chapter</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Metode Pembayaran</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {analytics.payment_methods.map((method, index) => (
                            <div key={index} className="p-3 lg:p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm lg:text-base truncate">{method.method}</h3>
                                    <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 ml-2">{formatPercentage(method.percentage)}</span>
                                </div>
                                <div className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {formatCurrency(method.revenue)}
                                </div>
                                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                                    {formatNumber(method.count)} transaksi
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Revenue Trend */}
                {analytics.monthly_revenue.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 lg:p-6">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">Tren Pendapatan Bulanan</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-neutral-600">
                                        <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Bulan</th>
                                        <th className="text-right py-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Pendapatan</th>
                                        <th className="text-right py-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Transaksi</th>
                                        <th className="text-right py-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Pertumbuhan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.monthly_revenue.map((month, index) => (
                                        <tr key={index} className="border-b border-gray-100 dark:border-neutral-700">
                                            <td className="py-3 text-xs lg:text-sm text-gray-900 dark:text-gray-100">{month.month}</td>
                                            <td className="py-3 text-xs lg:text-sm text-right text-gray-900 dark:text-gray-100">{formatCurrency(month.revenue)}</td>
                                            <td className="py-3 text-xs lg:text-sm text-right text-gray-900 dark:text-gray-100 hidden sm:table-cell">{formatNumber(month.transactions)}</td>
                                            <td className={`py-3 text-xs lg:text-sm text-right ${month.growth_rate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {month.growth_rate >= 0 ? '+' : ''}{formatPercentage(month.growth_rate)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </AppLayout>
    );
}
