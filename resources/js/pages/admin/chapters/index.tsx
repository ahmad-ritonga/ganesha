import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type Chapter, type ChaptersFilters, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface ChaptersIndexProps {
    book: Book;
    chapters: PaginatedData<Chapter>;
    filters: ChaptersFilters;
}

export default function ChaptersIndex({ book, chapters, filters }: ChaptersIndexProps) {
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
    ];

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.type || '');

    const handleSearch = () => {
        router.get(`/admin/books/${book.id}/chapters`, { search, status, type });
    };

    const handleDelete = (chapterId: string) => {
        if (confirm('Yakin ingin menghapus chapter ini?')) {
            router.delete(`/admin/books/${book.id}/chapters/${chapterId}`);
        }
    };

    const togglePublished = (chapterId: string) => {
        router.patch(`/admin/books/${book.id}/chapters/${chapterId}/toggle-published`);
    };

    const toggleFree = (chapterId: string) => {
        router.patch(`/admin/books/${book.id}/chapters/${chapterId}/toggle-free`);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Chapters - ${book.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Chapters</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola chapters untuk "{book.title}"
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>Total: {chapters.total} chapters</span>
                            <span>•</span>
                            <span>Penulis: {book.author.name}</span>
                            <span>•</span>
                            <span>Kategori: {book.category.name}</span>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/books/${book.id}/chapters/create`}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Tambah Chapter
                        </Link>
                        <Link
                            href={`/admin/books/${book.id}`}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali ke Buku
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Cari chapters..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        />
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
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="free">Gratis</option>
                            <option value="paid">Berbayar</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                {/* Chapters List */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
                    {chapters.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-neutral-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chapter
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Judul
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu Baca
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dibuat
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-600">
                                    {chapters.data.map((chapter) => (
                                        <tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-sm font-medium">
                                                        {chapter.chapter_number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {chapter.title}
                                                    </div>
                                                    {chapter.excerpt && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                                                            {chapter.excerpt}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => togglePublished(chapter.id)}
                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                        chapter.is_published
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    }`}
                                                >
                                                    {chapter.is_published ? 'Terbit' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleFree(chapter.id)}
                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                        chapter.is_free
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                    }`}
                                                >
                                                    {chapter.is_free ? 'Gratis' : `Rp ${Number(chapter.price).toLocaleString()}`}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatReadingTime(chapter.reading_time_minutes)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(chapter.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/admin/books/${book.id}/chapters/${chapter.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Lihat
                                                    </Link>
                                                    <Link
                                                        href={`/admin/books/${book.id}/chapters/${chapter.id}/edit`}
                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(chapter.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Belum ada chapters</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mulai dengan menambahkan chapter pertama untuk buku ini.</p>
                            <div className="mt-6">
                                <Link
                                    href={`/admin/books/${book.id}/chapters/create`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Tambah Chapter Pertama
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {chapters.links && chapters.data.length > 0 && (
                    <div className="flex justify-center space-x-1">
                        {chapters.links.map((link, index) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}