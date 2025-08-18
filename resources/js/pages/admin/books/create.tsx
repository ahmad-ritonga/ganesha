import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type User } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

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
        title: 'Tambah',
        href: '/admin/books/create',
    },
];

interface BooksCreateProps {
    categories: Category[];
    authors: User[];
}

export default function BooksCreate({ categories, authors }: BooksCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        cover_image: null as File | null,
        author_id: '',
        category_id: '',
        isbn: '',
        publication_date: '',
        price: '',
        discount_percentage: '',
        is_published: false as boolean,
        is_featured: false as boolean,
        total_chapters: '',
        reading_time_minutes: '',
        language: 'id',
        tags: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/books');
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter(t => t !== tag));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah E-Book" />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tambah E-Book</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Buat e-book baru untuk koleksi Anda</p>
                    </div>
                    <Link
                        href="/admin/books"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Kembali
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Informasi Utama</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Judul E-Book *
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
                                            Slug (opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Akan dibuat otomatis jika kosong"
                                        />
                                        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Deskripsi *
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            required
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Penulis *
                                            </label>
                                            <select
                                                value={data.author_id}
                                                onChange={(e) => setData('author_id', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                required
                                            >
                                                <option value="">Pilih Penulis</option>
                                                {authors.map((author: User) => (
                                                    <option key={author.id} value={author.id}>{author.name}</option>
                                                ))}
                                            </select>
                                            {errors.author_id && <p className="text-red-500 text-sm mt-1">{errors.author_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Kategori *
                                            </label>
                                            <select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                required
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category: Category) => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Detail Buku</h2>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                ISBN
                                            </label>
                                            <input
                                                type="text"
                                                value={data.isbn}
                                                onChange={(e) => setData('isbn', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                placeholder="978-0-123456-78-9"
                                            />
                                            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tanggal Publikasi
                                            </label>
                                            <input
                                                type="date"
                                                value={data.publication_date}
                                                onChange={(e) => setData('publication_date', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            />
                                            {errors.publication_date && <p className="text-red-500 text-sm mt-1">{errors.publication_date}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Harga (Rp) *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                placeholder="0"
                                                required
                                            />
                                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Diskon (%)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={data.discount_percentage}
                                                onChange={(e) => setData('discount_percentage', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                placeholder="0"
                                            />
                                            {errors.discount_percentage && <p className="text-red-500 text-sm mt-1">{errors.discount_percentage}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Bahasa
                                            </label>
                                            <select
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <option value="id">Indonesia</option>
                                                <option value="en">English</option>
                                            </select>
                                            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Total Bab
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.total_chapters}
                                                onChange={(e) => setData('total_chapters', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                placeholder="0"
                                            />
                                            {errors.total_chapters && <p className="text-red-500 text-sm mt-1">{errors.total_chapters}</p>}
                                        </div>

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
                                                placeholder="0"
                                            />
                                            {errors.reading_time_minutes && <p className="text-red-500 text-sm mt-1">{errors.reading_time_minutes}</p>}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tags
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                                placeholder="Ketik tag dan tekan Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Tambah
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {data.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Cover Image */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Cover Buku</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Cover
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Format: JPEG, PNG, JPG, GIF, WebP. Max: 2MB</p>
                                    {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Status</h2>
                                
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
                                            Terbitkan sekarang
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_featured" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                                            Jadikan featured
                                        </label>
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
                                        {processing ? 'Menyimpan...' : 'Simpan E-Book'}
                                    </button>
                                    
                                    <Link
                                        href="/admin/books"
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