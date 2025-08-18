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
    ArrowLeft,
    Download,
    CreditCard,
    BookOpen,
    FileText,
    Calendar,
    User,
    Smartphone,
    Copy,
    ExternalLink
} from 'lucide-react';

interface TransactionItem {
    id: string;
    item_title: string;
    price: number;
    quantity: number;
    item_type: string;
    item_id: string;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface Transaction {
    id: string;
    transaction_code: string;
    type: string;
    total_amount: number;
    payment_status: string;
    payment_method?: string;
    created_at: string;
    paid_at?: string;
    expired_at?: string;
    notes?: string;
    midtrans_order_id?: string;
    midtrans_transaction_id?: string;
    items: TransactionItem[];
    user: User;
}

interface TransactionShowProps {
    transaction: Transaction;
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

export default function TransactionShow({ transaction, auth }: TransactionShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: {
                label: 'Menunggu Pembayaran',
                color: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200',
                bgColor: 'from-orange-400 to-amber-400',
                icon: Clock,
            },
            paid: {
                label: 'Pembayaran Berhasil',
                color: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
                bgColor: 'from-emerald-400 to-green-400',
                icon: CheckCircle,
            },
            failed: {
                label: 'Pembayaran Gagal',
                color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200',
                bgColor: 'from-red-400 to-rose-400',
                icon: XCircle,
            },
            expired: {
                label: 'Pembayaran Kadaluarsa',
                color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200',
                bgColor: 'from-gray-400 to-slate-400',
                icon: XCircle,
            },
        };
        return configs[status as keyof typeof configs] || configs.failed;
    };

    const getTypeConfig = (type: string) => {
        return type === 'book_purchase' 
            ? { label: 'Pembelian Buku Lengkap', icon: BookOpen }
            : { label: 'Pembelian Chapter', icon: FileText };
    };

    const retryPayment = () => {
        router.post(route('transactions.retry', transaction.id));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const statusConfig = getStatusConfig(transaction.payment_status);
    const typeConfig = getTypeConfig(transaction.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    return (
        <PublicLayout title={`Transaksi ${transaction.transaction_code}`}>
            <Head title={`Transaksi ${transaction.transaction_code}`} />

            {/* Background Gradient */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <Link
                                href={route('transactions.index')}
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Riwayat Transaksi
                            </Link>
                            
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className={`p-3 bg-gradient-to-r ${statusConfig.bgColor} rounded-2xl shadow-lg`}>
                                    <Receipt className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Detail Transaksi
                                </h1>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Transaction Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Transaction Summary */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Informasi Transaksi</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Kode Transaksi</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-lg font-bold text-gray-900">{transaction.transaction_code}</p>
                                                <button
                                                    onClick={() => copyToClipboard(transaction.transaction_code)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Status</label>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border ${statusConfig.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Jenis Transaksi</label>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                                                    <TypeIcon className="w-4 h-4" />
                                                    {typeConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Total Pembayaran</label>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                                                {formatCurrency(transaction.total_amount)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Tanggal Transaksi</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <p className="text-gray-900">{formatDate(transaction.created_at)}</p>
                                            </div>
                                        </div>

                                        {transaction.paid_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Tanggal Pembayaran</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <p className="text-gray-900">{formatDate(transaction.paid_at)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {transaction.notes && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                            <label className="text-sm font-medium text-gray-600">Catatan</label>
                                            <p className="text-gray-900 mt-1">{transaction.notes}</p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Items List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Item yang Dibeli</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {transaction.items.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg">
                                                        {item.item_type === 'book' ? (
                                                            <BookOpen className="w-4 h-4 text-white" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{item.item_title}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {item.item_type === 'book' ? 'Buku Lengkap' : 'Chapter'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{formatCurrency(item.price)}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                {formatCurrency(transaction.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Action Panel */}
                            <div className="space-y-6">
                                {/* Customer Info */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Informasi Pembeli</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Nama</label>
                                            <p className="text-gray-900 font-semibold">{transaction.user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email</label>
                                            <p className="text-gray-900">{transaction.user.email}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Payment Actions */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                            <Smartphone className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Aksi</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {transaction.payment_status === 'failed' && (
                                            <button
                                                onClick={retryPayment}
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Coba Bayar Lagi
                                            </button>
                                        )}

                                        {transaction.payment_status === 'paid' && (
                                            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                                <Download className="w-4 h-4" />
                                                Unduh Invoice
                                            </button>
                                        )}

                                        {transaction.midtrans_order_id && (
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-2">Midtrans Order ID</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                                        {transaction.midtrans_order_id}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(transaction.midtrans_order_id!)}
                                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
