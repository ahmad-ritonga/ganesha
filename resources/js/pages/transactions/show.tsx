import React, { useState } from 'react';
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
    const [isSyncing, setIsSyncing] = useState(false);
    
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
                color: 'bg-orange-50 text-orange-700 border-orange-200',
                icon: Clock,
            },
            paid: {
                label: 'Pembayaran Berhasil',
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
            },
            failed: {
                label: 'Pembayaran Gagal',
                color: 'bg-red-50 text-red-700 border-red-200',
                icon: XCircle,
            },
            expired: {
                label: 'Pembayaran Kadaluarsa',
                color: 'bg-gray-50 text-gray-700 border-gray-200',
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

    const syncTransaction = async () => {
        setIsSyncing(true);
        try {
            router.post(route('transactions.sync', transaction.id), {}, {
                onSuccess: () => {
                    // Transaction status will be updated automatically by Inertia reload
                },
                onError: (errors) => {
                    console.error('Failed to sync transaction:', errors);
                },
                onFinish: () => {
                    setIsSyncing(false);
                }
            });
        } catch (error) {
            console.error('Sync error:', error);
            setIsSyncing(false);
        }
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

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-b border-blue-100 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Link
                            href={route('transactions.index')}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Riwayat Transaksi
                        </Link>
                        
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                                <Receipt className="w-8 h-8 text-blue-600" />
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Detail Transaksi
                            </h1>
                            
                            <p className="text-lg text-gray-600">
                                Informasi lengkap transaksi {transaction.transaction_code}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Transaction Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Transaction Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Informasi Transaksi</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Kode Transaksi</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-lg font-semibold text-gray-900">{transaction.transaction_code}</p>
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
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${statusConfig.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Jenis Transaksi</label>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                <TypeIcon className="w-4 h-4" />
                                                {typeConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Total Pembayaran</label>
                                        <p className="text-2xl font-bold text-green-600 mt-1">
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
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
                                className="bg-white rounded-xl border border-gray-200 p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Item yang Dibeli</h2>
                                </div>

                                <div className="space-y-4">
                                    {transaction.items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    {item.item_type === 'book' ? (
                                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-blue-600" />
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
                                                <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-green-600">
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
                                className="bg-white rounded-xl border border-gray-200 p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Informasi Pembeli</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Nama</label>
                                        <p className="text-gray-900 font-medium">{transaction.user.name}</p>
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
                                className="bg-white rounded-xl border border-gray-200 p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Smartphone className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Aksi</h3>
                                </div>

                                <div className="space-y-3">
                                    {transaction.payment_status === 'pending' && (
                                        <button
                                            onClick={syncTransaction}
                                            disabled={isSyncing}
                                            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors ${
                                                isSyncing 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                            {isSyncing ? 'Mengecek Status...' : 'Periksa Status Pembayaran'}
                                        </button>
                                    )}

                                    {transaction.payment_status === 'failed' && (
                                        <button
                                            onClick={retryPayment}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Coba Bayar Lagi
                                        </button>
                                    )}

                                    {transaction.payment_status === 'paid' && (
                                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                            Unduh Invoice
                                        </button>
                                    )}

                                    {transaction.midtrans_order_id && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Midtrans Order ID</p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono flex-1 text-gray-900">
                                                    {transaction.midtrans_order_id}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(transaction.midtrans_order_id!)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <Copy className="w-4 h-4" />
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
        </PublicLayout>
    );
}