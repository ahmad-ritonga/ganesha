import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BooksShowProps {
    book: Book;
}

export default function BooksShow({ book }: BooksShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'E-Books',
            href: '/admin/books',
        },
        {
            title: book.title,
            href: `/admin/books/${book.id}`,
        },
    ];

    const [deleteDialog, setDeleteDialog] = useState(false);

    const handleDelete = () => {
        setDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/books/${book.id}`);
        setDeleteDialog(false);
    };

    const cancelDelete = () => {
        setDeleteDialog(false);
    };

    const togglePublished = () => {
        router.patch(`/admin/books/${book.id}/toggle-published`);
    };

    const toggleFeatured = () => {
        router.patch(`/admin/books/${book.id}/toggle-featured`);
    };

    const formatPrice = (price: number) => {
        return price > 0 ? `Rp ${Number(price).toLocaleString()}` : 'Gratis';
    };

    const formatDate = (date: string | null | undefined) => {
        return date ? new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '-';
    };

    const formatReadingTime = (minutes: string | number | null | undefined) => {
        if (!minutes) return '-';
        const numMinutes = Number(minutes);
        if (numMinutes < 60) return `${numMinutes} menit`;
        
        const hours = Math.floor(numMinutes / 60);
        const remainingMinutes = numMinutes % 60;
        
        if (remainingMinutes > 0) {
            return `${hours} jam ${remainingMinutes} menit`;
        }
        
        return `${hours} jam`;
    };

    const discountedPrice = book.discount_percentage > 0 
        ? book.price - (book.price * book.discount_percentage / 100)
        : book.price;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={book.title} />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{book.title}</h1>
                            <div className="flex gap-2">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    book.is_published
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                    {book.is_published ? 'Terbit' : 'Draft'}
                                </span>
                                {book.is_featured && (
                                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">oleh {book.author?.name}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/books/${book.id}/chapters`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Chapters ({book.total_chapters || 0})
                        </Link>
                        <Link
                            href={`/admin/books/${book.id}/edit`}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={togglePublished}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                                book.is_published 
                                    ? 'bg-orange-600 hover:bg-orange-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {book.is_published ? 'Jadikan Draft' : 'Terbitkan'}
                        </button>
                        <button
                            onClick={toggleFeatured}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                                book.is_featured 
                                    ? 'bg-purple-600 hover:bg-purple-700' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {book.is_featured ? 'Unfeatured' : 'Featured'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Hapus
                        </button>
                        <Link
                            href="/admin/books"
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Deskripsi</h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Detail Buku</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            ISBN
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {book.isbn || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Kategori
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {book.category?.name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Bahasa
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {book.language === 'id' ? 'Indonesia' : 'English'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Total Bab
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {book.total_chapters || '-'} bab
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Tanggal Publikasi
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {formatDate(book.publication_date)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Slug
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {book.slug}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Waktu Baca
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {formatReadingTime(book.reading_time_minutes)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Dibuat
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {formatDate(book.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {book.tags && book.tags.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {book.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-flex px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Cover Buku</h2>
                            <div className="aspect-[3/4] bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                                {book.cover_image ? (
                                    <img
                                        src={`/storage/${book.cover_image}`}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Harga</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Harga Asli:</span>
                                    <span className={`font-medium ${book.discount_percentage > 0 ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {formatPrice(book.price)}
                                    </span>
                                </div>
                                
                                {book.discount_percentage > 0 && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Diskon:</span>
                                            <span className="font-medium text-red-600">
                                                {book.discount_percentage}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-neutral-600">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">Harga Final:</span>
                                            <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
                                                {formatPrice(discountedPrice)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                
                                {book.discount_percentage === 0 && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-neutral-600">
                                        <div className="text-center">
                                            <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                                                {formatPrice(book.price)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistik</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className={`font-medium ${
                                        book.is_published 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {book.is_published ? 'Terbit' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Featured:</span>
                                    <span className={`font-medium ${
                                        book.is_featured 
                                            ? 'text-purple-600 dark:text-purple-400' 
                                            : 'text-gray-500'
                                    }`}>
                                        {book.is_featured ? 'Ya' : 'Tidak'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Diperbarui:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatDate(book.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Aksi Cepat</h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/admin/books/${book.id}/chapters`}
                                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                                >
                                    Kelola Chapters ({book.total_chapters || 0})
                                </Link>
                                
                                <Link
                                    href={`/admin/books/${book.id}/chapters/create`}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
                                >
                                    Tambah Chapter Baru
                                </Link>
                                
                                <Link
                                    href={`/admin/books/${book.id}/edit`}
                                    className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-center block"
                                >
                                    Edit Buku
                                </Link>
                                
                                <button
                                    onClick={togglePublished}
                                    className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                                        book.is_published 
                                            ? 'bg-orange-600 hover:bg-orange-700' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {book.is_published ? 'Jadikan Draft' : 'Terbitkan Buku'}
                                </button>
                                
                                <button
                                    onClick={toggleFeatured}
                                    className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                                        book.is_featured 
                                            ? 'bg-purple-600 hover:bg-purple-700' 
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    {book.is_featured ? 'Hapus Featured' : 'Jadikan Featured'}
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Hapus Buku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus E-Book</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yakin ingin menghapus e-book "{book.title}"? 
                                Tindakan ini tidak dapat dibatalkan dan akan menghapus e-book secara permanen dari sistem.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={cancelDelete}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>
                                Hapus E-Book
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}