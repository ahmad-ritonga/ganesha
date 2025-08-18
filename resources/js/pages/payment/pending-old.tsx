import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, Eye, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface Transaction {
    id: string;
    transaction_code: string;
    type: string;
    total_amount: number;
    payment_status: string;
    expired_at: string;
    items: Array<{
        id: string;
        item_title: string;
        price: number;
        quantity: number;
        item_type: string;
        item_id: string;
    }>;
}

interface PendingProps {
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

export default function Pending({ transaction }: PendingProps) {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(transaction.payment_status);

    // Calculate remaining time
    useEffect(() => {
        const calculateRemainingTime = () => {
            const expiredAt = new Date(transaction.expired_at);
            const now = new Date();
            const remaining = Math.max(0, expiredAt.getTime() - now.getTime());
            setTimeRemaining(Math.floor(remaining / 1000));
            
            // If expired, refresh the page
            if (remaining <= 0 && currentStatus === 'pending') {
                checkPaymentStatus();
            }
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [transaction.expired_at, currentStatus]);

    // Auto check payment status every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStatus === 'pending') {
                checkPaymentStatus();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [currentStatus]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const checkPaymentStatus = async () => {
        setIsCheckingStatus(true);
        try {
            const response = await axios.get(route('payment.status', transaction.id));
            
            if (response.data.status !== 'pending') {
                // Redirect based on new status
                switch (response.data.status) {
                    case 'paid':
                        router.get(route('payment.success', transaction.id));
                        break;
                    case 'failed':
                    case 'expired':
                        router.get(route('payment.failed', transaction.id));
                        break;
                }
            } else {
                setCurrentStatus(response.data.status);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const isExpired = timeRemaining === 0;

    return (
        <>
            <Head title="Menunggu Pembayaran" />
            
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
                            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Clock className="w-12 h-12 text-orange-600" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Menunggu Pembayaran
                        </h1>
                        <p className="text-gray-600">
                            Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat.
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
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    <Clock className="w-3 h-3" />
                                    Menunggu Pembayaran
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Total Pembayaran</p>
                                <p className="font-bold text-orange-600 text-lg">
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

                    {/* Timer and Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-orange-50 rounded-lg border border-orange-200 p-6 mb-6"
                    >
                        <div className="text-center">
                            <h3 className="font-medium text-orange-900 mb-4">Waktu Pembayaran</h3>
                            
                            {timeRemaining !== null && (
                                <>
                                    {isExpired ? (
                                        <div className="text-red-500">
                                            <p className="text-xl font-bold mb-2">00:00</p>
                                            <p className="text-sm">Waktu pembayaran telah habis</p>
                                        </div>
                                    ) : (
                                        <div className="text-orange-600">
                                            <p className="text-3xl font-bold mb-2">
                                                {formatTime(timeRemaining)}
                                            </p>
                                            <p className="text-sm">Sisa waktu pembayaran</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6"
                    >
                        <h3 className="font-medium text-blue-900 mb-3">Instruksi Pembayaran</h3>
                        <ul className="text-blue-800 text-sm space-y-2">
                            <li>• Selesaikan pembayaran melalui metode yang telah Anda pilih</li>
                            <li>• Jangan tutup halaman ini hingga pembayaran berhasil</li>
                            <li>• Status akan otomatis diperbarui setelah pembayaran dikonfirmasi</li>
                            <li>• Jika mengalami kendala, silakan hubungi customer service</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={checkPaymentStatus}
                            disabled={isCheckingStatus}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isCheckingStatus ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Mengecek...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Cek Status Pembayaran
                                </>
                            )}
                        </button>
                        
                        <Link
                            href={route('transactions.show', transaction.id)}
                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Lihat Detail
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-8"
                    >
                        <Link
                            href={route('books.index')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Kembali ke Katalog
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
