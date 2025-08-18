import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type Chapter, type Media } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface ChapterMediaIndexProps {
    book: Book;
    chapter: Chapter;
    media: Media[];
}

export default function ChapterMediaIndex({ book, chapter, media = [] }: ChapterMediaIndexProps) {
    // Add defensive checks for undefined data
    if (!book || !chapter) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </AppLayout>
        );
    }

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
    ];

    const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
    const [showUpload, setShowUpload] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        files: [] as File[],
        type: 'image' as 'image' | 'video' | 'audio' | 'document',
        alt_text: {} as Record<string, string>,
        caption: {} as Record<string, string>,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        setData('files', files);
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/books/${book.id}/chapters/${chapter.id}/media`, {
            onSuccess: () => {
                reset();
                setShowUpload(false);
            },
        });
    };

    const handleDelete = (mediaId: string) => {
        if (confirm('Yakin ingin menghapus media ini?')) {
            router.delete(`/admin/books/${book.id}/chapters/${chapter.id}/media/${mediaId}`);
        }
    };

    const handleBulkDelete = () => {
        if (selectedMedia.length === 0) return;
        if (confirm(`Yakin ingin menghapus ${selectedMedia.length} media yang dipilih?`)) {
            router.delete(`/admin/books/${book.id}/chapters/${chapter.id}/media/bulk-delete`, {
                data: { ids: selectedMedia },
            });
            setSelectedMedia([]);
        }
    };

    const toggleMediaSelection = (mediaId: string) => {
        setSelectedMedia(prev => 
            prev.includes(mediaId) 
                ? prev.filter(id => id !== mediaId)
                : [...prev, mediaId]
        );
    };

    const selectAllMedia = () => {
        const filteredMedia = getFilteredMedia();
        const allIds = filteredMedia.map((m: Media) => m.id);
        setSelectedMedia(selectedMedia.length === allIds.length ? [] : allIds);
    };

    const getFilteredMedia = (): Media[] => {
        if (selectedType === 'all') return media;
        return media.filter((m: Media) => m.type === selectedType);
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

    const filteredMedia = getFilteredMedia();
    const mediaStats = {
        total: media.length,
        images: media.filter((m: Media) => m.type === 'image').length,
        videos: media.filter((m: Media) => m.type === 'video').length,
        audios: media.filter((m: Media) => m.type === 'audio').length,
        documents: media.filter((m: Media) => m.type === 'document').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Media - ${chapter.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Media Chapter</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola media untuk chapter "{chapter.title}"
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>Total: {mediaStats.total} files</span>
                            <span>•</span>
                            <span>Images: {mediaStats.images}</span>
                            <span>•</span>
                            <span>Videos: {mediaStats.videos}</span>
                            <span>•</span>
                            <span>Audio: {mediaStats.audios}</span>
                            <span>•</span>
                            <span>Documents: {mediaStats.documents}</span>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowUpload(!showUpload)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Upload Media
                        </button>
                        <Link
                            href={`/admin/books/${book.id}/chapters/${chapter.id}`}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Kembali ke Chapter
                        </Link>
                    </div>
                </div>

                {/* Upload Form */}
                {showUpload && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Upload Media Baru</h2>
                        
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipe Media *
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as 'image' | 'video' | 'audio' | 'document')}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="image">Image (JPG, PNG, GIF, WebP - Max 5MB)</option>
                                        <option value="video">Video (MP4, AVI, MOV - Max 100MB)</option>
                                        <option value="audio">Audio (MP3, WAV, OGG - Max 20MB)</option>
                                        <option value="document">Document (PDF, DOC, XLS - Max 10MB)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        File *
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Bisa upload multiple files sekaligus</p>
                                </div>
                            </div>

                            {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUpload(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                                >
                                    {processing ? 'Uploading...' : 'Upload Media'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters and Bulk Actions */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as 'all' | 'image' | 'video' | 'audio' | 'document')}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">Semua Tipe ({mediaStats.total})</option>
                                <option value="image">Images ({mediaStats.images})</option>
                                <option value="video">Videos ({mediaStats.videos})</option>
                                <option value="audio">Audio ({mediaStats.audios})</option>
                                <option value="document">Documents ({mediaStats.documents})</option>
                            </select>

                            {filteredMedia.length > 0 && (
                                <button
                                    onClick={selectAllMedia}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    {selectedMedia.length === filteredMedia.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {selectedMedia.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedMedia.length} dipilih
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    Hapus Terpilih
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Grid */}
                {filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredMedia.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden group">
                                {/* Selection Checkbox */}
                                <div className="absolute top-3 left-3 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedMedia.includes(item.id)}
                                        onChange={() => toggleMediaSelection(item.id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                </div>

                                {/* Media Preview */}
                                <div className="aspect-square bg-gray-100 dark:bg-neutral-700 relative">
                                    {item.type === 'image' ? (
                                        <img
                                            src={`/storage/${item.file_path}`}
                                            alt={item.alt_text || item.file_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">{getTypeIcon(item.type)}</div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getTypeColor(item.type)}-100 text-${getTypeColor(item.type)}-800`}>
                                                    {item.type.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                        <Link
                                            href={`/admin/books/${book.id}/chapters/${chapter.id}/media/${item.id}`}
                                            className="bg-white text-gray-900 px-3 py-1 rounded text-sm hover:bg-gray-100"
                                        >
                                            Lihat
                                        </Link>
                                        <a
                                            href={`/admin/books/${book.id}/chapters/${chapter.id}/media/${item.id}/download`}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Download
                                        </a>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Media Info */}
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
                                        {item.file_name}
                                    </h3>
                                    
                                    <div className="space-y-1 text-sm text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Size:</span>
                                            <span>{formatFileSize(item.file_size)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Order:</span>
                                            <span>#{item.order_index}</span>
                                        </div>
                                    </div>

                                    {item.alt_text && (
                                        <p className="text-xs text-gray-400 mt-2 truncate">
                                            Alt: {item.alt_text}
                                        </p>
                                    )}

                                    {item.caption && (
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {item.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {selectedType === 'all' ? 'Belum ada media' : `Belum ada ${selectedType}`}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Mulai dengan mengupload media pertama untuk chapter ini.
                        </p>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Upload Media Pertama
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}