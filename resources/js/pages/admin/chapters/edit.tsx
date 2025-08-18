import AppLayout from '@/layouts/app-layout';
import TinyMCEEditor from '@/components/TinyMCEEditor';
import { type BreadcrumbItem, type Book, type Chapter } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface ChapterEditProps {
    book: Book;
    chapter: Chapter;
}

export default function ChapterEdit({ book, chapter }: ChapterEditProps) {
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
        {
            title: 'Edit',
            href: `/admin/books/${book.id}/chapters/${chapter.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: chapter.title || '',
        slug: chapter.slug || '',
        chapter_number: chapter.chapter_number || '',
        content: chapter.content || '',
        excerpt: chapter.excerpt || '',
        is_free: chapter.is_free || false,
        price: chapter.price || '',
        reading_time_minutes: chapter.reading_time_minutes || '',
        is_published: chapter.is_published || false,
    });

    const [wordCount, setWordCount] = useState(0);
    const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);

    // Calculate word count and reading time
    useEffect(() => {
        if (data.content) {
            const text = data.content.replace(/<[^>]*>/g, '');
            const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
            const count = words.length;
            setWordCount(count);
            
            const estimatedTime = Math.ceil(count / 200);
            setEstimatedReadingTime(estimatedTime);
        }
    }, [data.content]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/books/${book.id}/chapters/${chapter.id}`);
    };

    const handleContentChange = (content: string) => {
        setData('content', content);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${chapter.title} - ${book.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Chapter</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Perbarui chapter "{chapter.title}" dari "{book.title}"
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/books/${book.id}/chapters/${chapter.id}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Lihat Detail
                        </Link>
                        <Link
                            href={`/admin/books/${book.id}/chapters`}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Informasi Chapter</h2>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Judul Chapter *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                required
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nomor Chapter *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={data.chapter_number}
                                                onChange={(e) => setData('chapter_number', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                required
                                            />
                                            {errors.chapter_number && <p className="text-red-500 text-sm mt-1">{errors.chapter_number}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        />
                                        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Konten Chapter</h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>{wordCount} kata</span>
                                        <span>~{estimatedReadingTime} menit baca</span>
                                    </div>
                                </div>
                                
                                <TinyMCEEditor
                                    value={data.content}
                                    onChange={handleContentChange}
                                    height={600}
                                    placeholder="Konten chapter Anda..."
                                />
                                {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
                            </div>

                            {/* Excerpt */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Ringkasan Chapter</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Excerpt
                                    </label>
                                    <textarea
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Ringkasan singkat chapter ini"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {data.excerpt.length}/500 karakter
                                    </p>
                                    {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publishing */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Publikasi</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_published" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                                            Terbitkan chapter
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_free"
                                            checked={data.is_free}
                                            onChange={(e) => setData('is_free', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_free" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                                            Chapter gratis
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            {!data.is_free && (
                                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Harga</h2>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Harga Chapter (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Statistics */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Statistik</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Waktu Baca (menit)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.reading_time_minutes}
                                            onChange={(e) => setData('reading_time_minutes', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        />
                                        {errors.reading_time_minutes && <p className="text-red-500 text-sm mt-1">{errors.reading_time_minutes}</p>}
                                    </div>

                                    <div className="text-sm text-gray-500 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Jumlah kata:</span>
                                            <span>{wordCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Estimasi baca:</span>
                                            <span>{estimatedReadingTime} menit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chapter Info */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Chapter</h2>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">ID:</span>
                                        <span className="font-mono text-gray-900 dark:text-gray-100">{chapter.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Dibuat:</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(chapter.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Diperbarui:</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(chapter.updated_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                                    >
                                        {processing ? 'Menyimpan...' : 'Perbarui Chapter'}
                                    </button>
                                    
                                    <Link
                                        href={`/admin/books/${book.id}/chapters/${chapter.id}`}
                                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                                    >
                                        Lihat Detail
                                    </Link>
                                    
                                    <Link
                                        href={`/admin/books/${book.id}/chapters`}
                                        className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium text-center block"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}