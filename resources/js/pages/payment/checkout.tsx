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
    QrCode,
    CreditCard,
    Building2,
    Wallet,
    Lock,
    Timer,
    Receipt,
    Info
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
            setError('Payment system failed to load. Please refresh the page.');
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
            setError('Payment system is not ready. Please wait a moment...');
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
                    setError('Payment failed. Please try again.');
                    setIsLoading(false);
                },
                onClose: function() {
                    console.log('Payment popup closed');
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error('Payment error:', err);
            setError('An error occurred while processing payment.');
            setIsLoading(false);
        }
    };

    const cancelPayment = () => {
        if (confirm('Are you sure you want to cancel this payment?')) {
            router.post(route('payment.cancel', transaction.id));
        }
    };

    const currentItem = book || chapter;
    const isExpired = timeRemaining === 0;

    return (
        <PublicLayout>
            <Head title={`Checkout - ${transaction.transaction_code}`} />
            
            {/* Professional Navigation Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.get(route('books.show', book?.slug || chapter?.book.slug))}
                                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Back to Book</span>
                            </button>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Secure Checkout</h1>
                                <p className="text-xs text-gray-500">Order #{transaction.transaction_code}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-green-600">
                            <Lock className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">SSL Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Order Summary - Left Side */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            {/* Product Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center text-gray-900">
                                        <Receipt className="w-5 h-5 mr-2" />
                                        <h2 className="text-lg font-semibold">Order Summary</h2>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    {currentItem && (
                                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                            {('cover_image' in currentItem && currentItem.cover_image) && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={currentItem.cover_image}
                                                        alt={currentItem.title}
                                                        className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    {currentItem.title}
                                                </h3>
                                                {chapter && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        From: {chapter.book.title}
                                                    </p>
                                                )}
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {transaction.type === 'book_purchase' ? 'Complete Book' : 'Single Chapter'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="space-y-3">
                                            {transaction.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {item.item_title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Total */}
                                        <div className="border-t border-gray-200 mt-4 pt-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-semibold text-gray-900">Total</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {formatCurrency(transaction.total_amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Methods */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200"
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center text-gray-900">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        <h2 className="text-lg font-semibold">Payment Methods</h2>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        {/* QRIS */}
                                        <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                                                    <QrCode className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-1">QRIS</h3>
                                                <p className="text-xs text-gray-600">Scan & Pay</p>
                                            </div>
                                        </div>

                                        {/* E-Wallet */}
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                                                    <Wallet className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-1">E-Wallet</h3>
                                                <p className="text-xs text-gray-600">GoPay, DANA, OVO</p>
                                            </div>
                                        </div>

                                        {/* Bank Transfer */}
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-3">
                                                    <Building2 className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-1">Bank Transfer</h3>
                                                <p className="text-xs text-gray-600">Virtual Account</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Features */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <div className="flex items-start">
                                            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Secure Payment</h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                        <span>256-bit SSL encryption</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                        <span>PCI DSS compliant</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                        <span>Fraud protection</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                                <span className="text-sm font-medium text-red-800">{error}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Payment Button */}
                                    {isExpired ? (
                                        <button
                                            onClick={() => router.get(route('books.show', book?.slug || chapter?.book.slug))}
                                            className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
                                        >
                                            Return to Book
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={handlePayment}
                                                disabled={isLoading || !paymentInitialized}
                                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : !paymentInitialized ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        <span>Loading...</span>
                                                    </div>
                                                ) : (
                                                    <span>Complete Payment</span>
                                                )}
                                            </motion.button>
                                            
                                            <button
                                                onClick={cancelPayment}
                                                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
                                            >
                                                Cancel Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Payment Summary Sidebar - Right Side */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                {/* Timer Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center text-gray-900 mb-4">
                                            <Timer className="w-5 h-5 mr-2" />
                                            <h3 className="font-semibold">Payment Timer</h3>
                                        </div>
                                        
                                        {timeRemaining !== null && (
                                            <div className="text-center">
                                                {isExpired ? (
                                                    <div className="text-red-600">
                                                        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                                                        <p className="font-semibold text-lg">Payment Expired</p>
                                                        <p className="text-sm text-gray-600 mt-1">Please create a new order</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-4xl font-bold text-blue-600 mb-2 font-mono">
                                                            {formatTime(timeRemaining)}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">Time remaining</p>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                                                style={{ width: `${Math.max(0, (timeRemaining / (15 * 60)) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Order Details */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center text-gray-900 mb-4">
                                            <Info className="w-5 h-5 mr-2" />
                                            <h3 className="font-semibold">Order Details</h3>
                                        </div>
                                        
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order ID</span>
                                                <span className="font-medium text-gray-900">{transaction.transaction_code}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type</span>
                                                <span className="font-medium text-gray-900">
                                                    {transaction.type === 'book_purchase' ? 'Complete Book' : 'Chapter'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pending Payment
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-gray-200">
                                                <span className="font-semibold text-gray-900">Total Amount</span>
                                                <span className="font-bold text-lg text-gray-900">
                                                    {formatCurrency(transaction.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Help Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-blue-50 rounded-xl border border-blue-200 p-6"
                                >
                                    <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <p>• Payment processed securely by Midtrans</p>
                                        <p>• Your book will be available immediately after payment</p>
                                        <p>• Contact support if you encounter any issues</p>
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