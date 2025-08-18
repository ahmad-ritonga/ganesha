import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

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

    const handleRetry = () => {
        // Router to retry payment
        window.location.href = route('transactions.retry', transaction.id);
    };

    return (
        <>
            <Head title="Pembayaran Gagal" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <XCircle className="w-12 h-12 text-red-600" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Pembayaran Gagal
                        </h1>
                        <p className="text-gray-600">
                            Maaf, terjadi kesalahan dalam proses pembayaran.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
                    >
                        <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Kode Transaksi</p>
                                <p className="font-medium">{transaction.transaction_code}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="w-3 h-3" />
                                    {transaction.payment_status === 'expired' ? 'Kadaluarsa' : 'Gagal'}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Total Pembayaran</p>
                                <p className="font-bold text-gray-900 text-lg">
                                    {formatCurrency(transaction.total_amount)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Item</h3>
                            <div className="space-y-2">
                                {transaction.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.item_title}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.item_type === 'App\\Models\\Book' ? 'Buku Lengkap' : 'Chapter'}
                                            </p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-red-50 rounded-lg border border-red-200 p-6 mb-6"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-900 mb-2">Alasan Kegagalan</h3>
                                <p className="text-red-800 text-sm">
                                    {getFailureReason()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={handleRetry}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Coba Lagi
                        </button>
                        
                        <Link
                            href={route('books.index')}
                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Katalog
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <p className="text-sm text-gray-500">
                            Masih mengalami masalah? {' '}
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Hubungi customer service
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
