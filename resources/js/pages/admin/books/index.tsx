import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type Category, type PaginatedData, type BooksFilters, type PaginationLink } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'E-Books',
        href: '/admin/books',
    },
];

interface BooksIndexProps {
    books: PaginatedData<Book>;
    categories: Category[];
    filters: BooksFilters;
}

export default function BooksIndex({ books, categories, filters }: BooksIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [featured, setFeatured] = useState(filters.featured || '');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; book: Book | null }>({
        open: false,
        book: null,
    });

    const handleSearch = () => {
        router.get('/admin/books', { search, category, status, featured });
    };

    const handleDelete = (book: Book) => {
        setDeleteDialog({ open: true, book });
    };

    const confirmDelete = () => {
        if (deleteDialog.book) {
            router.delete(`/admin/books/${deleteDialog.book.id}`);
            setDeleteDialog({ open: false, book: null });
        }
    };

    const cancelDelete = () => {
        setDeleteDialog({ open: false, book: null });
    };

    const togglePublished = (id: string) => {
        router.patch(`/admin/books/${id}/toggle-published`);
    };

    const toggleFeatured = (id: string) => {
        router.patch(`/admin/books/${id}/toggle-featured`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="E-Books" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">E-Books</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola koleksi e-book Anda</p>
                    </div>
                    <Link
                        href="/admin/books/create"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Tambah E-Book
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input
                            type="text"
                            placeholder="Cari judul, deskripsi, ISBN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat: Category) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Terbit</option>
                            <option value="draft">Draft</option>
                        </select>
                        <select
                            value={featured}
                            onChange={(e) => setFeatured(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Semua Featured</option>
                            <option value="yes">Featured</option>
                            <option value="no">Tidak Featured</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.data.map((book: Book) => (
                        <div key={book.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Cover Image */}
                            <div className="aspect-[3/4] bg-gray-100 dark:bg-neutral-700">
                                {book.cover_image ? (
                                    <img
                                        src={`/storage/${book.cover_image}`}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        book.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                        {book.is_published ? 'Terbit' : 'Draft'}
                                    </span>
                                    {book.is_featured && (
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                                    {book.title}
                                </h3>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    oleh {book.author.name}
                                </p>
                                
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                                    {book.category.name}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                        {book.price > 0 ? `Rp ${Number(book.price).toLocaleString()}` : 'Gratis'}
                                    </span>
                                    {book.discount_percentage > 0 && (
                                        <span className="text-red-500 font-medium">
                                            -{book.discount_percentage}%
                                        </span>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-neutral-600">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/admin/books/${book.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                                        >
                                            Lihat
                                        </Link>
                                        <Link
                                            href={`/admin/books/${book.id}/edit`}
                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/admin/books/${book.id}/chapters`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                        >
                                            Chapters ({book.total_chapters || 0})
                                        </Link>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => togglePublished(book.id)}
                                            className={`text-sm font-medium ${
                                                book.is_published 
                                                    ? 'text-red-600 hover:text-red-900 dark:text-red-400' 
                                                    : 'text-green-600 hover:text-green-900 dark:text-green-400'
                                            }`}
                                        >
                                            {book.is_published ? 'Draft' : 'Terbit'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {books.data.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tidak ada e-book</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mulai dengan menambahkan e-book pertama Anda.</p>
                        <div className="mt-6">
                            <Link
                                href="/admin/books/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Tambah E-Book
                            </Link>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {books.links && books.data.length > 0 && (
                    <div className="flex justify-center space-x-1">
                        {books.links.map((link: PaginationLink, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 text-sm rounded-lg ${
                                    link.active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && cancelDelete()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus E-Book</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yakin ingin menghapus e-book "{deleteDialog.book?.title}"? 
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