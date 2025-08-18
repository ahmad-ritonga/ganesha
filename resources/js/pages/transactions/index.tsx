import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
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
                color: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200',
                icon: Clock,
            },
            paid: {
                label: 'Berhasil',
                color: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
                icon: CheckCircle,
            },
            failed: {
                label: 'Gagal',
                color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200',
                icon: XCircle,
            },
            expired: {
                label: 'Kadaluarsa',
                color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200',
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

            {/* Background Gradient */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 text-center"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                    <Receipt className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Riwayat Transaksi
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Kelola dan pantau seluruh riwayat pembelian buku dan chapter Anda dengan mudah
                            </p>
                        </motion.div>

                        {/* Statistics Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        >
                            <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-100">Total Transaksi</p>
                                        <p className="text-2xl font-bold">{transactions.total}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-emerald-100" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Transaksi Berhasil</p>
                                        <p className="text-2xl font-bold">
                                            {transactions.data.filter(t => t.payment_status === 'paid').length}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-purple-100" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100">Menunggu Pembayaran</p>
                                        <p className="text-2xl font-bold">
                                            {transactions.data.filter(t => t.payment_status === 'pending').length}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-100" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                    <Filter className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-semibold text-gray-800">Filter Transaksi</span>
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
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-2 border ${
                                                        isActive 
                                                            ? config.color + ' shadow-lg' 
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
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-2 border ${
                                                        isActive 
                                                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200 shadow-lg' 
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
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center"
                                >
                                    <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <Receipt className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Belum ada transaksi
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Anda belum memiliki riwayat transaksi apapun. Mulai jelajahi dan beli buku favorit Anda!
                                    </p>
                                    <Link
                                        href={route('books.index')}
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
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
                                            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                                            <CreditCard className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {transaction.transaction_code}
                                                        </h3>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border ${statusConfig.color}`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                            {statusConfig.label}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                                                            <TypeIcon className="w-4 h-4" />
                                                            {typeConfig.label}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(transaction.created_at)}
                                                    </div>
                                                    
                                                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                        {formatCurrency(transaction.total_amount)}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex flex-col gap-3">
                                                    <Link
                                                        href={route('transactions.show', transaction.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Detail
                                                    </Link>
                                                    
                                                    {transaction.payment_status === 'failed' && (
                                                        <button
                                                            onClick={() => retryPayment(transaction.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                            Coba Lagi
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Transaction Items */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Item yang dibeli:</p>
                                                <div className="space-y-1">
                                                    {transaction.items.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
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
                                className="mt-12 flex justify-center"
                            >
                                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
                                    {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={route('transactions.index', { ...filters, page })}
                                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all transform hover:scale-105 ${
                                                page === transactions.current_page
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
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
            </div>
        </PublicLayout>
    );
}
