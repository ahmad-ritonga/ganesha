import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { IconTrash } from '@tabler/icons-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
    },
    {
        title: 'Profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    phone: string;
};

interface ProfilePageProps {
    mustVerifyEmail: boolean;
    status?: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        role: string;
        email_verified_at?: string;
    };
    isAdmin: boolean;
}

export default function AdminProfileSettings({ mustVerifyEmail, status, user, isAdmin }: ProfilePageProps) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.settings.profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings" />
            
            <SettingsLayout isAdmin={isAdmin}>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Profile Information
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Update your account's profile information and email address.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">{status}</p>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter your email address"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* Email Verification */}
                        {mustVerifyEmail && !user.email_verified_at && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-amber-800 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        className="underline hover:no-underline"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>

                            {recentlySuccessful && (
                                <p className="text-sm text-green-600">Saved successfully!</p>
                            )}
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <IconTrash className="h-5 w-5 text-red-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
                                        Delete Account
                                    </h3>
                                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                                        Once your account is deleted, all of its resources and data will be permanently deleted.
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                // Handle delete account
                                            }
                                        }}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}