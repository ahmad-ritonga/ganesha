import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { 
    Smartphone,
    Clock, 
    ShieldCheck, 
    ArrowLeft, 
    AlertCircle,
    CheckCircle,
    QrCode
} from 'lucide-react';

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
    }>;
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

interface Book {
    id: string;
    title: string;
    author: string;
    cover_image: string;
    description?: string;
    slug: string;
}

interface Chapter {
    id: string;
    title: string;
    price: number;
    book: Book;
}

interface CheckoutProps {
    transaction: Transaction;
    book?: Book;
    chapter?: Chapter;
    snapToken: string;
    clientKey: string;
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function Checkout({ transaction, book, chapter, snapToken, clientKey }: CheckoutProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [paymentInitialized, setPaymentInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Load Midtrans Snap script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey);
        script.onload = () => {
            console.log('Midtrans script loaded successfully');
            setPaymentInitialized(true);
        };
        script.onerror = () => {
            console.error('Failed to load Midtrans script');
            setError('Gagal memuat sistem pembayaran. Silakan refresh halaman.');
        };
        document.head.appendChild(script);

        return () => {
            const existingScript = document.querySelector('script[src="https://app.sandbox.midtrans.com/snap/snap.js"]');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, [clientKey]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePayment = () => {
        if (!paymentInitialized || !window.snap) {
            setError('Sistem pembayaran belum siap. Silakan tunggu sebentar...');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            window.snap.pay(snapToken, {
                onSuccess: function(result: any) {
                    console.log('Payment success:', result);
                    router.get(route('payment.success', transaction.id));
                },
                onPending: function(result: any) {
                    console.log('Payment pending:', result);
                    router.get(route('payment.pending', transaction.id));
                },
                onError: function(result: any) {
                    console.log('Payment error:', result);
                    setError('Pembayaran gagal. Silakan coba lagi.');
                    setIsLoading(false);
                },
                onClose: function() {
                    console.log('Payment popup closed');
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error('Payment error:', err);
            setError('Terjadi kesalahan saat memproses pembayaran.');
            setIsLoading(false);
        }
    };

    const cancelPayment = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan pembayaran ini?')) {
            router.post(route('payment.cancel', transaction.id));
        }
    };

    const currentItem = book || chapter;
    const isExpired = timeRemaining === 0;

    return (
        <PublicLayout>
            <Head title={`Checkout - ${transaction.transaction_code}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4"
                        >
                            <button
                                onClick={() => router.get(route('books.show', book?.slug || chapter?.book.slug))}
                                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Kembali</span>
                            </button>
                            <div className="h-6 w-px bg-blue-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold">Checkout Pembayaran</h1>
                                <p className="text-blue-100">Kode: {transaction.transaction_code}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Detail Pesanan
                                    </h2>
                                </div>
                                
                                <div className="p-6">
                                    {currentItem && (
                                        <div className="flex gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 border border-orange-200">
                                            {('cover_image' in currentItem && currentItem.cover_image) && (
                                                <img
                                                    src={currentItem.cover_image}
                                                    alt={currentItem.title}
                                                    className="w-20 h-28 object-cover rounded-lg shadow-md"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {currentItem.title}
                                                </h3>
                                                {chapter && (
                                                    <p className="text-gray-600 mt-1">
                                                        Dari buku: {chapter.book.title}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-500 mt-2 bg-yellow-100 px-3 py-1 rounded-full inline-block">
                                                    {transaction.type === 'book_purchase' ? 'Pembelian Buku Lengkap' : 'Pembelian Chapter'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-orange-200 pt-4">
                                        {transaction.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                                                <span className="text-gray-700 font-medium">{item.item_title}</span>
                                                <span className="font-bold text-orange-600">{formatCurrency(item.price)}</span>
                                            </div>
                                        ))}
                                        
                                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mt-6">
                                            <div className="flex justify-between items-center text-xl font-bold">
                                                <span className="text-gray-800">Total Pembayaran:</span>
                                                <span className="text-orange-600 text-2xl">
                                                    {formatCurrency(transaction.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Payment Section */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Timer */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Waktu Pembayaran
                                    </h3>
                                </div>
                                
                                <div className="p-6">
                                    {timeRemaining !== null && (
                                        <div className="text-center">
                                            {isExpired ? (
                                                <div className="text-red-500">
                                                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                                                    <p className="font-bold text-lg">Waktu pembayaran telah habis</p>
                                                    <p className="text-sm text-gray-600 mt-2">Silakan buat pesanan baru</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-4xl font-bold text-blue-600 mb-3">
                                                        {formatTime(timeRemaining)}
                                                    </div>
                                                    <p className="text-sm text-gray-600">Sisa waktu pembayaran</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                                                            style={{ width: `${Math.max(0, (timeRemaining / (15 * 60)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <QrCode className="w-5 h-5" />
                                        Metode Pembayaran
                                    </h3>
                                </div>
                                
                                <div className="p-6">
                                    {/* QRIS Payment Method */}
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 mb-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <QrCode className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">QRIS Payment</h4>
                                                <p className="text-sm text-gray-600">Scan QR Code untuk bayar</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Instant & Aman</span>
                                        </div>
                                    </div>

                                    {/* Payment Features */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <ShieldCheck className="w-5 h-5 text-green-500" />
                                            <span className="text-sm">Pembayaran 100% aman</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Smartphone className="w-5 h-5 text-orange-500" />
                                            <span className="text-sm">Scan dengan aplikasi bank</span>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4"
                                        >
                                            <div className="flex items-center gap-2 text-red-700">
                                                <AlertCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">{error}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {isExpired ? (
                                        <div className="text-center">
                                            <button
                                                onClick={() => router.get(route('books.show', book?.slug || chapter?.book.slug))}
                                                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-200"
                                            >
                                                Kembali ke Buku
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handlePayment}
                                                disabled={isLoading || !paymentInitialized}
                                                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Memproses...</span>
                                                    </div>
                                                ) : !paymentInitialized ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Mempersiapkan...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <QrCode className="w-5 h-5" />
                                                        <span>Bayar dengan QRIS</span>
                                                    </div>
                                                )}
                                            </motion.button>
                                            
                                            <button
                                                onClick={cancelPayment}
                                                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 rounded-xl font-medium transition-all duration-200"
                                            >
                                                Batalkan Pembayaran
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Security Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-green-800">Pembayaran Aman</span>
                                        <p className="text-sm text-green-700">Dilindungi enkripsi SSL</p>
                                    </div>
                                </div>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    Transaksi Anda diproses dengan teknologi enkripsi terbaru dan diamankan oleh Midtrans Payment Gateway.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
