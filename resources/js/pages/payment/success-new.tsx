import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Download, ArrowRight, Sparkles, Gift } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

interface Transaction {
    id: string;
    transaction_code: string;
    type: string;
    total_amount: number;
    payment_status: string;
    paid_at: string;
    items: Array<{
        id: string;
        item_title: string;
        price: number;
        quantity: number;
        item_type: string;
        item_id: string;
    }>;
}

interface SuccessProps {
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

const Success: React.FC<SuccessProps> = ({ transaction }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <PublicLayout>
            <Head title="Pembayaran Berhasil" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-blue-500 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                        >
                            <CheckCircle className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold mb-3"
                        >
                            🎉 Pembayaran Berhasil!
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-green-100"
                        >
                            Terima kasih! Pembayaran Anda telah berhasil diproses.
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Transaction Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden mb-8"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Gift className="w-5 h-5" />
                                Detail Transaksi
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                                    <p className="text-sm text-gray-600 mb-1">Kode Transaksi</p>
                                    <p className="font-bold text-green-700">{transaction.transaction_code}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-1">Waktu Pembayaran</p>
                                    <p className="font-bold text-blue-700">{formatDate(transaction.paid_at)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                                    <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="w-4 h-4" />
                                        Berhasil
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
                                    <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                                    <p className="font-bold text-orange-600 text-xl">
                                        {formatCurrency(transaction.total_amount)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-500" />
                                    Item yang Dibeli
                                </h3>
                                <div className="space-y-3">
                                    {transaction.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.item_title}</p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {item.item_type === 'App\\Models\\Book' ? 'Buku Lengkap' : 'Chapter'}
                                                </p>
                                            </div>
                                            <p className="font-bold text-green-600">{formatCurrency(item.price)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    >
                        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Mulai Membaca
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Buku atau chapter yang Anda beli sudah tersedia di perpustakaan Anda.
                                </p>
                                <Link
                                    href="/books"
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Lihat Perpustakaan
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Unduh Invoice
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Unduh invoice untuk keperluan administrasi atau laporan keuangan.
                                </p>
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    <Download className="w-5 h-5" />
                                    Unduh Invoice
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 text-center"
                    >
                        <h3 className="font-semibold text-gray-800 mb-2">Butuh Bantuan?</h3>
                        <p className="text-gray-600 mb-4">
                            Tim customer service kami siap membantu Anda 24/7.
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
};

export default Success;
