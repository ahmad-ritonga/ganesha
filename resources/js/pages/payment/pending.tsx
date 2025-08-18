import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle, CreditCard, QrCode } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

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

    // Calculate remaining time
    useEffect(() => {
        const calculateRemainingTime = () => {
            const expiredAt = new Date(transaction.expired_at);
            const now = new Date();
            const remaining = Math.max(0, expiredAt.getTime() - now.getTime());
            setTimeRemaining(Math.floor(remaining / 1000));
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [transaction.expired_at]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const checkPaymentStatus = async () => {
        setIsCheckingStatus(true);
        try {
            const response = await fetch(`/api/payment/status/${transaction.id}`);
            const data = await response.json();
            
            if (data.status === 'paid') {
                router.get(`/payment/success/${transaction.id}`);
            } else if (data.status === 'failed' || data.status === 'expired') {
                router.get(`/payment/failed/${transaction.id}`);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const isExpired = timeRemaining === 0;

    return (
        <PublicLayout>
            <Head title="Menunggu Pembayaran" />
            
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                        >
                            <Clock className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold mb-3"
                        >
                            ⏳ Menunggu Pembayaran
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-yellow-100"
                        >
                            Silakan selesaikan pembayaran Anda
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Timer and Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg border border-yellow-100 overflow-hidden mb-8"
                    >
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Status Pembayaran
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            {timeRemaining !== null && (
                                <div className="text-center mb-6">
                                    {isExpired ? (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200"
                                        >
                                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                            <h3 className="text-2xl font-bold text-red-600 mb-2">Waktu Habis</h3>
                                            <p className="text-red-700">Waktu pembayaran telah berakhir. Silakan buat pesanan baru.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                                        >
                                            <div className="text-5xl font-bold text-yellow-600 mb-4">
                                                {formatTime(timeRemaining)}
                                            </div>
                                            <p className="text-yellow-700 font-medium mb-4">Sisa waktu pembayaran</p>
                                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                                <div 
                                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.max(0, (timeRemaining / (15 * 60)) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-yellow-700">
                                                <QrCode className="w-5 h-5" />
                                                <span>Scan QR Code di aplikasi pembayaran Anda</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-1">Kode Transaksi</p>
                                    <p className="font-bold text-blue-700">{transaction.transaction_code}</p>
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
                                Item yang Akan Dibeli
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
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Check Status */}
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5" />
                                    Cek Status Pembayaran
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Klik tombol di bawah untuk mengecek apakah pembayaran sudah berhasil diproses.
                                </p>
                                <button
                                    onClick={checkPaymentStatus}
                                    disabled={isCheckingStatus}
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {isCheckingStatus ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Mengecek...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Cek Status
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Back to Books */}
                        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Kembali Browsing
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Sambil menunggu, Anda bisa melihat buku-buku menarik lainnya.
                                </p>
                                <Link
                                    href="/books"
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    <Clock className="w-4 h-4" />
                                    Lihat Buku Lain
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Instructions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border-2 border-blue-200 p-6 mb-8"
                    >
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-blue-500" />
                            Cara Menyelesaikan Pembayaran
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                                <p>Buka aplikasi mobile banking atau e-wallet Anda</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                                <p>Pilih menu Scan QR Code atau QRIS</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                                <p>Scan QR Code yang muncul di aplikasi pembayaran</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                                <p>Konfirmasi pembayaran dan tunggu notifikasi berhasil</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 text-center"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">Butuh Bantuan?</h3>
                        <p className="text-gray-600 mb-4">
                            Jika mengalami kesulitan dalam pembayaran, hubungi customer service kami.
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
