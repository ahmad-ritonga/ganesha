import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type Chapter } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface ChapterShowProps {
    book: Book;
    chapter: Chapter;
}

export default function ChapterShow({ book, chapter }: ChapterShowProps) {
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
        {
            title: 'Chapters',
            href: `/admin/books/${book.id}/chapters`,
        },
        {
            title: chapter.title,
            href: `/admin/books/${book.id}/chapters/${chapter.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus chapter ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/admin/books/${book.id}/chapters/${chapter.id}`);
        }
    };

    const togglePublished = () => {
        router.patch(`/admin/books/${book.id}/chapters/${chapter.id}/toggle-published`);
    };

    const toggleFree = () => {
        router.patch(`/admin/books/${book.id}/chapters/${chapter.id}/toggle-free`);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatReadingTime = (minutes?: number) => {
        if (!minutes) return '-';
        if (minutes < 60) return `${minutes} menit`;
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes > 0) {
            return `${hours} jam ${remainingMinutes} menit`;
        }
        
        return `${hours} jam`;
    };

    const formatPrice = (price: number) => {
        return price > 0 ? `Rp ${Number(price).toLocaleString()}` : 'Gratis';
    };

    const getWordCount = (content?: string) => {
        if (!content) return 0;
        const text = content.replace(/<[^>]*>/g, '');
        return text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${chapter.title} - ${book.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-lg font-bold">
                                {chapter.chapter_number}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{chapter.title}</h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Chapter dari "{book.title}" oleh {book.author.name}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                chapter.is_published
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                                {chapter.is_published ? 'Terbit' : 'Draft'}
                            </span>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                chapter.is_free
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                                {chapter.is_free ? 'Gratis' : formatPrice(chapter.price)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/books/${book.id}/chapters/${chapter.id}/edit`}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={togglePublished}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                                chapter.is_published 
                                    ? 'bg-orange-600 hover:bg-orange-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {chapter.is_published ? 'Jadikan Draft' : 'Terbitkan'}
                        </button>
                        <button
                            onClick={toggleFree}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                                chapter.is_free 
                                    ? 'bg-purple-600 hover:bg-purple-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {chapter.is_free ? 'Jadikan Berbayar' : 'Jadikan Gratis'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Hapus
                        </button>
                        <Link
                            href={`/admin/books/${book.id}/chapters`}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Excerpt */}
                        {chapter.excerpt && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ringkasan</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {chapter.excerpt}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Konten Chapter</h2>
                            
                            {chapter.content ? (
                                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                                    <div 
                                        className="chapter-content"
                                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                                        style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '16px',
                                            lineHeight: '1.7',
                                            color: '#374151'
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p>Konten chapter belum ditambahkan</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Navigasi Chapter</h2>
                            
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    {chapter.previous_chapter ? (
                                        <Link
                                            href={`/admin/books/${book.id}/chapters/${chapter.previous_chapter.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <div className="text-left">
                                                <div className="text-xs text-gray-500">Chapter Sebelumnya</div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                                                    {chapter.previous_chapter.title}
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="text-gray-400 text-sm">Chapter pertama</div>
                                    )}
                                </div>
                                
                                <div className="flex-1 text-right">
                                    {chapter.next_chapter ? (
                                        <Link
                                            href={`/admin/books/${book.id}/chapters/${chapter.next_chapter.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                                        >
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">Chapter Selanjutnya</div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                                                    {chapter.next_chapter.title}
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <div className="text-gray-400 text-sm">Chapter terakhir</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Chapter Details */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Detail Chapter</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Nomor Chapter
                                    </label>
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        #{chapter.chapter_number}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Slug
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-50 dark:bg-neutral-700 px-2 py-1 rounded">
                                        {chapter.slug}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Waktu Baca
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {formatReadingTime(chapter.reading_time_minutes)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Jumlah Kata
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {getWordCount(chapter.content).toLocaleString()} kata
                                    </p>
                                </div>

                                {!chapter.is_free && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Harga
                                        </label>
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {formatPrice(chapter.price)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Status</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Publikasi:</span>
                                    <span className={`font-medium ${
                                        chapter.is_published 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {chapter.is_published ? 'Terbit' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Akses:</span>
                                    <span className={`font-medium ${
                                        chapter.is_free 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-purple-600 dark:text-purple-400'
                                    }`}>
                                        {chapter.is_free ? 'Gratis' : 'Berbayar'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Dibuat:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        {formatDate(chapter.created_at)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Diperbarui:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        {formatDate(chapter.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Buku</h2>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Judul Buku
                                    </label>
                                    <Link
                                        href={`/admin/books/${book.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                    >
                                        {book.title}
                                    </Link>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Penulis
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {book.author.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Kategori
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {book.category.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Aksi Cepat</h2>
                            
                            <div className="space-y-3">
                                <Link
                                    href={`/admin/books/${book.id}/chapters/${chapter.id}/edit`}
                                    className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-center block"
                                >
                                    Edit Chapter
                                </Link>
                                
                                <button
                                    onClick={togglePublished}
                                    className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                                        chapter.is_published 
                                            ? 'bg-orange-600 hover:bg-orange-700' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {chapter.is_published ? 'Jadikan Draft' : 'Terbitkan Chapter'}
                                </button>
                                
                                <button
                                    onClick={toggleFree}
                                    className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                                        chapter.is_free 
                                            ? 'bg-purple-600 hover:bg-purple-700' 
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {chapter.is_free ? 'Jadikan Berbayar' : 'Jadikan Gratis'}
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Hapus Chapter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}