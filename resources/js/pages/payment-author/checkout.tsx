import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { 
    ArrowLeft, 
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    Smartphone,
    QrCode,
    Shield,
    Crown,
    Star,
    Package
} from 'lucide-react';

interface Transaction {
    id: string;
    transaction_code: string;
    total_amount: number;
    status: string;
    expired_at?: string;
}

interface Props {
    snapToken: string;
    transaction: Transaction;
    items: Array<{
        title: string;
        price: number;
        quantity: number;
    }>;
    redirectUrl: string;
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

export default function Checkout({ snapToken, transaction, items, redirectUrl }: Props) {
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Load Midtrans Snap script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
        script.onload = () => {
            console.log('Midtrans Snap script loaded');
        };
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const handlePayment = () => {
        if (!window.snap) {
            setErrorMessage('Payment system is not ready. Please try again.');
            return;
        }

        setPaymentStatus('processing');

        window.snap.pay(snapToken, {
            onSuccess: function(result: any) {
                console.log('Payment success:', result);
                setPaymentStatus('success');
                
                // Redirect after successful payment
                setTimeout(() => {
                    router.visit(redirectUrl);
                }, 2000);
            },
            onPending: function(result: any) {
                console.log('Payment pending:', result);
                setPaymentStatus('processing');
            },
            onError: function(result: any) {
                console.log('Payment error:', result);
                setPaymentStatus('failed');
                setErrorMessage('Payment failed. Please try again.');
            },
            onClose: function() {
                console.log('Payment popup closed');
                setPaymentStatus('pending');
            }
        });
    };

    const paymentMethods = [
        {
            name: 'Virtual Account',
            icon: CreditCard,
            description: 'BCA, BNI, BRI, Mandiri, CIMB Niaga',
            color: 'from-blue-500 to-blue-600'
        },
        {
            name: 'E-Wallet',
            icon: Smartphone,
            description: 'GoPay, DANA, OVO, ShopeePay',
            color: 'from-green-500 to-green-600'
        },
        {
            name: 'QRIS',
            icon: QrCode,
            description: 'Scan QR dengan aplikasi bank/e-wallet',
            color: 'from-purple-500 to-purple-600'
        }
    ];

    return (
        <PublicLayout 
            title="Payment - Author Subscription"
            description="Complete your author subscription payment"
        >
            <Head title="Author Subscription Payment" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <button
                            onClick={() => router.visit('/author/pricing')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Pricing
                        </button>
                        
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                            <Crown className="w-4 h-4 mr-2" />
                            Author Subscription
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Complete Your Payment
                        </h1>
                        <p className="text-lg text-gray-600">
                            Secure checkout for your author subscription
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
                                <div className="flex items-center mb-4">
                                    <Package className="w-6 h-6 text-blue-600 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                                                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-blue-600">
                                                        {formatCurrency(item.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">{formatCurrency(transaction.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">Included</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {formatCurrency(transaction.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="text-sm">
                                        <div className="font-medium text-blue-900 mb-1">Transaction Details</div>
                                        <div className="text-blue-700">ID: {transaction.transaction_code}</div>
                                        {transaction.expired_at && (
                                            <div className="text-blue-700">
                                                Expires: {new Date(transaction.expired_at).toLocaleString('id-ID')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                {paymentStatus === 'pending' && (
                                    <>
                                        <div className="flex items-center mb-6">
                                            <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                                            <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
                                        </div>
                                        
                                        {/* Payment Methods Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                            {paymentMethods.map((method, index) => (
                                                <div key={index} className="border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors">
                                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-3`}>
                                                        <method.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="font-semibold text-gray-900 mb-1">{method.name}</div>
                                                    <div className="text-sm text-gray-500">{method.description}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Benefits Section */}
                                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                                Author Subscription Benefits
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                                <div className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    Submit unlimited books
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    Priority review process
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    Royalty up to 50%
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    Professional editing
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Notice */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                            <div className="flex items-center">
                                                <Shield className="w-5 h-5 text-blue-600 mr-3" />
                                                <div>
                                                    <div className="font-semibold text-blue-900">100% Secure Payment</div>
                                                    <div className="text-sm text-blue-700">Protected by Midtrans SSL encryption</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Button */}
                                        <button
                                            onClick={handlePayment}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg"
                                        >
                                            <CreditCard className="w-5 h-5 mr-3" />
                                            Proceed to Payment
                                        </button>
                                        
                                        <p className="text-center text-sm text-gray-500 mt-4">
                                            By clicking "Proceed to Payment" you agree to our terms and conditions
                                        </p>
                                    </>
                                )}

                                {paymentStatus === 'processing' && (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Clock className="w-10 h-10 text-blue-600 animate-spin" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment...</h3>
                                        <p className="text-gray-600 mb-4">Please complete your payment in the popup window</p>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                                            <AlertCircle className="w-4 h-4 inline mr-2" />
                                            Do not close this window until payment is complete
                                        </div>
                                    </div>
                                )}

                                {paymentStatus === 'success' && (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h3>
                                        <p className="text-gray-600 mb-6">
                                            Welcome to our author community! Your subscription is now active.
                                        </p>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                            <div className="text-sm text-green-800">
                                                <div className="font-medium mb-1">What's next?</div>
                                                <div>You can now submit your books for publication and start earning royalties!</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
                                    </div>
                                )}

                                {paymentStatus === 'failed' && (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <AlertCircle className="w-10 h-10 text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h3>
                                        <p className="text-gray-600 mb-6">{errorMessage}</p>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                            <div className="text-sm text-red-800">
                                                <div className="font-medium mb-1">Common issues:</div>
                                                <div>• Insufficient balance • Network timeout • Invalid card details</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPaymentStatus('pending')}
                                            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Declare global snap interface
declare global {
    interface Window {
        snap: any;
    }
}
