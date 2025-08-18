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

export default function Success({ transaction }: SuccessProps) {
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
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

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3" />
                                    Berhasil
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Pembayaran</p>
                                <p className="font-bold text-green-600 text-lg">
                                    {formatCurrency(transaction.total_amount)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Item yang Dibeli</h3>
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
                        className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6"
                    >
                        <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-2">Akses Konten Anda</h3>
                                <p className="text-blue-800 text-sm mb-3">
                                    Anda sekarang memiliki akses penuh ke konten yang telah dibeli. 
                                    Mulai membaca sekarang atau simpan untuk nanti.
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
                        <Link
                            href={route('my-books')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            Lihat Koleksi Saya
                        </Link>
                        
                        <Link
                            href={route('books.index')}
                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Lanjut Belanja
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <p className="text-sm text-gray-500">
                            Butuh bantuan? {' '}
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Hubungi customer service
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
