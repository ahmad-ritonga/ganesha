import React from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { 
    BookOpen,
    User,
    Clock,
    ArrowLeft,
    CreditCard
} from 'lucide-react';

interface Author {
    id: string;
    name: string;
    email: string;
}

interface Book {
    id: string;
    title: string;
    author: Author;
    cover_image: string;
    description?: string;
    slug: string;
    price: number;
    total_chapters: number;
}

interface Props {
    book: Book;
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

export default function BookPayment({ book }: Props) {
    const handlePurchase = () => {
        router.post(route('payment.book', book.id));
    };

    const handleBack = () => {
        router.visit(route('books.show', book.slug));
    };

    return (
        <PublicLayout>
            <Head title={`Beli Buku - ${book.title}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <motion.button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Detail Buku
                    </motion.button>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                            <h1 className="text-2xl font-bold text-white">Pembelian Buku</h1>
                            <p className="text-blue-100 mt-2">Dapatkan akses penuh ke seluruh chapter</p>
                        </div>

                        <div className="p-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Book Info */}
                                <div className="space-y-6">
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="w-24 h-32 object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h2>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <User className="w-4 h-4 mr-2" />
                                                <span>{book.author.name}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 mb-3">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                <span>{book.total_chapters} Chapter</span>
                                            </div>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {formatCurrency(book.price)}
                                            </div>
                                        </div>
                                    </div>

                                    {book.description && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {book.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Section */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Detail Pembelian
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Harga Buku</span>
                                                <span className="font-medium">{formatCurrency(book.price)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-indigo-600">{formatCurrency(book.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <h4 className="font-medium text-blue-900 mb-2">Yang Anda Dapatkan:</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Akses seumur hidup ke semua chapter</li>
                                            <li>• Dapat membaca kapan saja</li>
                                            <li>• Progress membaca tersimpan</li>
                                            <li>• Dukungan pelanggan 24/7</li>
                                        </ul>
                                    </div>

                                    <motion.button
                                        onClick={handlePurchase}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Lanjutkan Pembayaran
                                    </motion.button>

                                    <div className="flex items-center justify-center text-xs text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Pembayaran aman dengan Midtrans</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
