import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import { 
    Receipt, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Eye, 
    RefreshCw,
    Filter,
    BookOpen,
    FileText,
    CreditCard,
    Calendar,
    TrendingUp
} from 'lucide-react';

interface TransactionItem {
    id: string;
    item_title: string;
    price: number;
    quantity: number;
    item_type: string;
}

interface Transaction {
    id: string;
    transaction_code: string;
    type: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    items: TransactionItem[];
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface TransactionsIndexProps {
    transactions: PaginatedTransactions;
    filters: {
        status?: string;
        type?: string;
    };
    auth: {
        user: any;
    };
}

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function TransactionsIndex({ transactions, filters, auth }: TransactionsIndexProps) {
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [isAutoSyncing, setIsAutoSyncing] = useState(false);
    
    // Auto-sync pending transactions on page load
    useEffect(() => {
        const pendingTransactions = transactions.data.filter(t => t.payment_status === 'pending');
        if (pendingTransactions.length > 0) {
            autoSyncPendingTransactions();
        }
    }, []);

    const autoSyncPendingTransactions = async () => {
        setIsAutoSyncing(true);
        try {
            const response = await axios.post(route('transactions.sync-pending'));
            
            if (response.data.success && response.data.updated > 0) {
                // Some transactions were updated, reload the page
                router.reload();
            }
        } catch (error) {
            console.error('Auto sync error:', error);
            // Fail silently for auto-sync
        } finally {
            setIsAutoSyncing(false);
        }
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: {
                label: 'Menunggu',
                color: 'bg-orange-50 text-orange-700 border-orange-200',
                icon: Clock,
            },
            paid: {
                label: 'Berhasil',
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
            },
            failed: {
                label: 'Gagal',
                color: 'bg-red-50 text-red-700 border-red-200',
                icon: XCircle,
            },
            expired: {
                label: 'Kadaluarsa',
                color: 'bg-gray-50 text-gray-700 border-gray-200',
                icon: XCircle,
            },
        };
        return configs[status as keyof typeof configs] || configs.failed;
    };

    const getTypeConfig = (type: string) => {
        return type === 'book_purchase' 
            ? { label: 'Buku Lengkap', icon: BookOpen }
            : { label: 'Chapter', icon: FileText };
    };

    const syncAllTransactions = async () => {
        setIsSyncingAll(true);
        try {
            const response = await axios.post(route('transactions.sync-all'));
            
            if (response.data.success) {
                // Success: reload the page to show updated transaction statuses
                router.reload();
            } else {
                console.error('Sync failed:', response.data.message);
                alert('Gagal memeriksa status pembayaran: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Sync all error:', error);
            alert('Terjadi kesalahan saat memeriksa status pembayaran');
        } finally {
            setIsSyncingAll(false);
        }
    };

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters };
        if (newFilters[key as keyof typeof filters] === value) {
            delete newFilters[key as keyof typeof filters];
        } else {
            newFilters[key as keyof typeof filters] = value;
        }
        
        router.get(route('transactions.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const retryPayment = (transactionId: string) => {
        router.post(route('transactions.retry', transactionId));
    };

    return (
        <PublicLayout title="Riwayat Transaksi">
            <Head title="Riwayat Transaksi" />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-b border-blue-100 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                            <Receipt className="w-8 h-8 text-blue-600" />
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Riwayat Transaksi
                        </h1>
                        
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                            Kelola dan pantau seluruh riwayat pembelian buku dan chapter Anda dengan mudah
                        </p>
                        
                        {/* Auto-sync Status */}
                        {isAutoSyncing && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Memeriksa status pembayaran otomatis...
                            </div>
                        )}
                        
                        {/* Auto-sync Info */}
                        <div className="text-sm text-gray-500 mb-6">
                            💡 Status pembayaran diperbarui otomatis setiap 30 menit
                        </div>
                        
                        {/* Sync All Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={syncAllTransactions}
                                disabled={isSyncingAll || isAutoSyncing}
                                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${
                                    isSyncingAll || isAutoSyncing
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                <RefreshCw className={`w-4 h-4 ${isSyncingAll || isAutoSyncing ? 'animate-spin' : ''}`} />
                                {isAutoSyncing 
                                    ? 'Memeriksa Otomatis...' 
                                    : isSyncingAll 
                                    ? 'Memeriksa Status...' 
                                    : 'Periksa Semua Status Pembayaran'
                                }
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Statistics Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100">
                                    <TrendingUp className="w-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{transactions.total}</div>
                                    <div className="text-sm text-gray-500">Total Transaksi</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100">
                                    <CheckCircle className="w-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {transactions.data.filter(t => t.payment_status === 'paid').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Transaksi Berhasil</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-orange-100">
                                    <Clock className="w-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {transactions.data.filter(t => t.payment_status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Menunggu Pembayaran</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Filter className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Filter Transaksi</span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Status filters */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Status Pembayaran</p>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'paid', 'failed', 'expired'].map((status) => {
                                        const config = getStatusConfig(status);
                                        const Icon = config.icon;
                                        const isActive = filters.status === status;
                                        
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleFilter('status', status)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${
                                                    isActive 
                                                        ? config.color 
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {config.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Type filters */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Jenis Pembelian</p>
                                <div className="flex flex-wrap gap-2">
                                    {['book_purchase', 'chapter_purchase'].map((type) => {
                                        const config = getTypeConfig(type);
                                        const Icon = config.icon;
                                        const isActive = filters.type === type;
                                        
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => handleFilter('type', type)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${
                                                    isActive 
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {config.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transactions List */}
                    <div className="space-y-6">
                        {transactions.data.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl border border-gray-200 p-12 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Receipt className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Belum ada transaksi
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Anda belum memiliki riwayat transaksi apapun. Mulai jelajahi dan beli buku favorit Anda!
                                </p>
                                <Link
                                    href={route('books.index')}
                                    className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Jelajahi Buku Sekarang
                                </Link>
                            </motion.div>
                        ) : (
                            transactions.data.map((transaction, index) => {
                                const statusConfig = getStatusConfig(transaction.payment_status);
                                const typeConfig = getTypeConfig(transaction.type);
                                const StatusIcon = statusConfig.icon;
                                const TypeIcon = typeConfig.icon;
                                
                                return (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {transaction.transaction_code}
                                                    </h3>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${statusConfig.color}`}>
                                                        <StatusIcon className="w-4 h-4" />
                                                        {statusConfig.label}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                        <TypeIcon className="w-4 h-4" />
                                                        {typeConfig.label}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(transaction.created_at)}
                                                </div>
                                                
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(transaction.total_amount)}
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-col gap-3">
                                                <Link
                                                    href={route('transactions.show', transaction.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>
                                                
                                                {transaction.payment_status === 'failed' && (
                                                    <button
                                                        onClick={() => retryPayment(transaction.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                        Coba Lagi
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Transaction Items */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Item yang dibeli:</p>
                                            <div className="space-y-1">
                                                {transaction.items.slice(0, 2).map((item, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        {item.item_title} - {formatCurrency(item.price)}
                                                    </p>
                                                ))}
                                                {transaction.items.length > 2 && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                        +{transaction.items.length - 2} item lainnya
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {transactions.last_page > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                                {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={route('transactions.index', { ...filters, page })}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            page === transactions.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}