import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

interface CategoriesEditProps {
    category: Category;
}

export default function CategoriesEdit({ category }: CategoriesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Categories',
            href: '/admin/categories',
        },
        {
            title: category.name,
            href: `/admin/categories/${category.id}`,
        },
        {
            title: 'Edit',
            href: `/admin/categories/${category.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: null as File | null,
        is_active: category.is_active || false,
        _method: 'PATCH',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Log form data for debugging
        console.log('Submitting form data:', data);
        
        // Use POST with _method: PATCH for file uploads
        post(`/admin/categories/${category.id}`, {
            forceFormData: true,
            onSuccess: () => {
                console.log('Category updated successfully');
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
            }
        });
    };

    // Function to generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Auto-generate slug when name changes (only if slug is empty)
    useEffect(() => {
        if (data.name && !data.slug) {
            setData('slug', generateSlug(data.name));
        }
    }, [data.name]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />
            
            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Category</h1>
                    <Link
                        href="/admin/categories"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Categories
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100`}
                                required
                                disabled={processing}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                    errors.slug ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100`}
                                disabled={processing}
                            />
                            <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate from name</p>
                            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={data.description || ''}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100`}
                                disabled={processing}
                                placeholder="Enter category description..."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category Image
                            </label>
                            {category.image && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
                                    <img
                                        src={`/storage/${category.image}`}
                                        alt={category.name}
                                        className="h-20 w-20 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                accept="image/*"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                    errors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100`}
                                disabled={processing}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to keep current image. Supported formats: JPEG, PNG, JPG, GIF, WebP (max 2MB)
                            </p>
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                disabled={processing}
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Active (Category will be visible and selectable)
                            </label>
                        </div>

                        {/* Display general form errors if any */}
                        {Object.keys(errors).length > 0 && !errors.name && !errors.slug && !errors.description && !errors.image && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                                <ul className="text-sm text-red-700 list-disc list-inside">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href="/admin/categories"
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Updating...' : 'Update Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}