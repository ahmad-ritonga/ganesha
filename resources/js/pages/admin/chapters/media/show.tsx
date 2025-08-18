import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type Chapter, type Media } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface ChapterMediaShowProps {
    book: Book;
    chapter: Chapter;
    media: Media;
}

export default function ChapterMediaShow({ book, chapter, media }: ChapterMediaShowProps) {
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
            title: 'Media',
            href: `/admin/books/${book.id}/chapters/${chapter.id}/media`,
        },
        {
            title: media.file_name,
            href: `/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}`,
        },
    ];

    const [showEditForm, setShowEditForm] = useState(false);
    const [showReplaceForm, setShowReplaceForm] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        alt_text: media.alt_text || '',
        caption: media.caption || '',
        order_index: media.order_index || 0,
    });

    const { data: replaceData, setData: setReplaceData, post: postReplace, processing: replaceProcessing, errors: replaceErrors, reset: resetReplace } = useForm({
        file: null as File | null,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}`, {
            onSuccess: () => {
                setShowEditForm(false);
            },
        });
    };

    const handleReplace = (e: React.FormEvent) => {
        e.preventDefault();
        postReplace(`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}/replace`, {
            onSuccess: () => {
                resetReplace();
                setShowReplaceForm(false);
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}`);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '-';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
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

    const getTypeIcon = (type: Media['type']) => {
        const icons = {
            image: '🖼️',
            video: '🎥',
            audio: '🎵',
            document: '📄',
        };
        return icons[type] || '📁';
    };

    const getTypeColor = (type: Media['type']) => {
        const colors = {
            image: 'blue',
            video: 'red',
            audio: 'green',
            document: 'purple',
        };
        return colors[type] || 'gray';
    };

    const canPreview = (type: Media['type']) => {
        return ['image', 'video', 'audio'].includes(type);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${media.file_name} - ${chapter.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{getTypeIcon(media.type)}</span>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{media.file_name}</h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Media dari chapter "{chapter.title}" - {book.title}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-${getTypeColor(media.type)}-100 text-${getTypeColor(media.type)}-800 dark:bg-${getTypeColor(media.type)}-900 dark:text-${getTypeColor(media.type)}-200`}>
                                {media.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                                {formatFileSize(media.file_size)}
                            </span>
                            <span className="text-sm text-gray-500">
                                Order #{media.order_index}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex space-x-3">
                        <a
                            href={`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}/download`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Download
                        </a>
                        <button
                            onClick={() => setShowEditForm(!showEditForm)}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowReplaceForm(!showReplaceForm)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Replace File
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Hapus
                        </button>
                        <Link
                            href={`/admin/books/${book.id}/chapters/${chapter.id}/media`}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Preview */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Preview</h2>
                            
                            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-6">
                                {media.type === 'image' && (
                                    <img
                                        src={`/storage/${media.file_path}`}
                                        alt={media.alt_text || media.file_name}
                                        className="max-w-full h-auto rounded-lg shadow-lg"
                                    />
                                )}

                                {media.type === 'video' && (
                                    <video
                                        controls
                                        className="max-w-full h-auto rounded-lg shadow-lg"
                                    >
                                        <source src={`/storage/${media.file_path}`} type="video/mp4" />
                                        Browser Anda tidak mendukung video player.
                                    </video>
                                )}

                                {media.type === 'audio' && (
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🎵</div>
                                        <audio controls className="w-full">
                                            <source src={`/storage/${media.file_path}`} type="audio/mpeg" />
                                            Browser Anda tidak mendukung audio player.
                                        </audio>
                                    </div>
                                )}

                                {media.type === 'document' && (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📄</div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Preview tidak tersedia untuk dokumen
                                        </p>
                                        <a
                                            href={`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}/download`}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Download untuk melihat
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        {showEditForm && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Edit Media</h2>
                                
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Alt Text
                                        </label>
                                        <input
                                            type="text"
                                            value={data.alt_text}
                                            onChange={(e) => setData('alt_text', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Alt text untuk accessibility"
                                        />
                                        {errors.alt_text && <p className="text-red-500 text-sm mt-1">{errors.alt_text}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Order Index
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.order_index}
                                            onChange={(e) => setData('order_index', parseInt(e.target.value, 10) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        />
                                        {errors.order_index && <p className="text-red-500 text-sm mt-1">{errors.order_index}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditForm(false)}
                                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Replace File Form */}
                        {showReplaceForm && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Replace File</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    File baru harus memiliki tipe yang sama dengan file lama ({media.type}).
                                </p>
                                
                                <form onSubmit={handleReplace} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            File Baru *
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setReplaceData('file', e.target.files?.[0] || null)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            required
                                        />
                                        {replaceErrors.file && <p className="text-red-500 text-sm mt-1">{replaceErrors.file}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowReplaceForm(false)}
                                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={replaceProcessing}
                                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                                        >
                                            {replaceProcessing ? 'Mengganti...' : 'Replace File'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* File Details */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Detail File</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Nama File
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium break-all">
                                        {media.file_name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Tipe
                                    </label>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-${getTypeColor(media.type)}-100 text-${getTypeColor(media.type)}-800 dark:bg-${getTypeColor(media.type)}-900 dark:text-${getTypeColor(media.type)}-200`}>
                                        {media.type.toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Ukuran File
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {formatFileSize(media.file_size)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Order Index
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        #{media.order_index}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        File Path
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 font-mono text-xs bg-gray-50 dark:bg-neutral-700 p-2 rounded break-all">
                                        {media.file_path}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        {(media.alt_text || media.caption) && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Metadata</h2>
                                
                                <div className="space-y-4">
                                    {media.alt_text && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Alt Text
                                            </label>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {media.alt_text}
                                            </p>
                                        </div>
                                    )}

                                    {media.caption && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Caption
                                            </label>
                                            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg">
                                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                    {media.caption}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Chapter Info */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Chapter</h2>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Chapter
                                    </label>
                                    <Link
                                        href={`/admin/books/${book.id}/chapters/${chapter.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                    >
                                        {chapter.title}
                                    </Link>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Buku
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
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Timestamps</h2>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Diupload
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 text-sm">
                                        {formatDate(media.created_at)}
                                    </p>
                                </div>

                                {media.updated_at && media.updated_at !== media.created_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Terakhir Diperbarui
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 text-sm">
                                            {formatDate(media.updated_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Aksi Cepat</h2>
                            
                            <div className="space-y-3">
                                <a
                                    href={`/admin/books/${book.id}/chapters/${chapter.id}/media/${media.id}/download`}
                                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                                >
                                    Download File
                                </a>
                                
                                <button
                                    onClick={() => setShowEditForm(!showEditForm)}
                                    className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                                >
                                    {showEditForm ? 'Tutup Form Edit' : 'Edit Metadata'}
                                </button>
                                
                                <button
                                    onClick={() => setShowReplaceForm(!showReplaceForm)}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {showReplaceForm ? 'Tutup Form Replace' : 'Replace File'}
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Hapus Media
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}