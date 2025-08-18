import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function CategoriesShow({ category }) {
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
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    const toggleStatus = () => {
        router.patch(`/admin/categories/${category.id}/toggle`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category.name} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                    <div className="flex space-x-2">
                        <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={toggleStatus}
                            className={`px-4 py-2 rounded-lg text-white ${
                                category.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {category.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                        <Link
                            href="/admin/categories"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                {/* Category Details */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {category.name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Slug
                                </label>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {category.slug}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    category.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Created At
                                </label>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(category.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Updated At
                                </label>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(category.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {category.image && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Image
                                    </label>
                                    <img
                                        src={`/storage/${category.image}`}
                                        alt={category.name}
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}

                            {category.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}