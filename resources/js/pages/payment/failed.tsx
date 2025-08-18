import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle, CreditCard, Home } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

interface Transaction {
    id: string;
    transaction_code: string;
    type: string;
    total_amount: number;
    payment_status: string;
    notes?: string;
    items: Array<{
        id: string;
        item_title: string;
        price: number;
        quantity: number;
        item_type: string;
        item_id: string;
    }>;
}

interface FailedProps {
    transaction: Transaction;
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

export default function Failed({ transaction }: FailedProps) {
    const getFailureReason = () => {
        if (transaction.notes) {
            return transaction.notes;
        }
        
        switch (transaction.payment_status) {
            case 'failed':
                return 'Pembayaran gagal diproses. Silakan coba lagi.';
            case 'expired':
                return 'Waktu pembayaran telah habis.';
            default:
                return 'Terjadi kesalahan dalam proses pembayaran.';
        }
    };

    const getActionText = () => {
        switch (transaction.payment_status) {
            case 'expired':
                return 'Coba Lagi';
            case 'failed':
                return 'Ulangi Pembayaran';
            default:
                return 'Coba Lagi';
        }
    };

    return (
        <PublicLayout>
            <Head title="Pembayaran Gagal" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                        >
                            <XCircle className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold mb-3"
                        >
                            😔 Pembayaran Gagal
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-red-100"
                        >
                            Maaf, pembayaran Anda tidak dapat diproses
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Error Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden mb-8"
                    >
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Detail Masalah
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 mb-6">
                                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <XCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-red-800 mb-2">
                                        {transaction.payment_status === 'expired' ? 'Waktu Pembayaran Habis' : 'Pembayaran Gagal'}
                                    </h3>
                                    <p className="text-red-700">{getFailureReason()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">Kode Transaksi</p>
                                    <p className="font-bold text-gray-800">{transaction.transaction_code}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
                                    <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                                    <p className="font-bold text-orange-600 text-xl">
                                        {formatCurrency(transaction.total_amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transaction Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-8"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Item yang Gagal Dibeli
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-3">
                                {transaction.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.item_title}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.item_type === 'App\\Models\\Book' ? 'Buku Lengkap' : 'Chapter'}
                                            </p>
                                        </div>
                                        <p className="font-bold text-blue-600">{formatCurrency(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        {/* Retry Payment */}
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5" />
                                    {getActionText()}
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Coba lakukan pembayaran sekali lagi dengan metode yang sama.
                                </p>
                                {transaction.items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.item_type === 'App\\Models\\Book' 
                                            ? `/payment/book/${item.item_id}` 
                                            : `/payment/chapter/${item.item_id}`}
                                        className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 mb-2 last:mb-0"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        {getActionText()}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Browse Books */}
                        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <ArrowLeft className="w-5 h-5" />
                                    Kembali Browsing
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Kembali ke halaman buku dan pilih item lain yang menarik.
                                </p>
                                <Link
                                    href="/books"
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Lihat Buku Lain
                                </Link>
                            </div>
                        </div>

                        {/* Home */}
                        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Kembali ke Beranda
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Kembali ke halaman utama dan jelajahi konten menarik lainnya.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    <Home className="w-4 h-4" />
                                    Ke Beranda
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 text-center"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">Butuh Bantuan?</h3>
                        <p className="text-gray-600 mb-4">
                            Jika masalah berlanjut, hubungi tim customer service kami untuk mendapatkan bantuan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@ganesha.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium rounded-xl transition-all duration-200"
                            >
                                Email Support
                            </a>
                            <a
                                href="https://wa.me/+6281234567890"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-200"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
