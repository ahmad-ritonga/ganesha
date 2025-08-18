import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { IconLock } from '@tabler/icons-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
    },
    {
        title: 'Password',
    },
];

interface PasswordPageProps {
    status?: string;
    isAdmin: boolean;
}

export default function AdminPasswordSettings({ status, isAdmin }: PasswordPageProps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.settings.password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password Settings" />
            
            <SettingsLayout isAdmin={isAdmin}>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Update Password
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Ensure your account is using a long, random password to stay secure.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">{status}</p>
                        </div>
                    )}

                    {/* Password Form */}
                    <form onSubmit={updatePassword} className="space-y-6">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your current password"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    id="password"
                                    ref={passwordInput}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Updating...' : 'Update Password'}
                            </button>

                            {recentlySuccessful && (
                                <p className="text-sm text-green-600">Password updated successfully!</p>
                            )}
                        </div>
                    </form>

                    {/* Security Tips */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Password Security Tips
                        </h3>
                        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                            <li>• Use at least 8 characters</li>
                            <li>• Include uppercase and lowercase letters</li>
                            <li>• Add numbers and special characters</li>
                            <li>• Avoid common words or personal information</li>
                            <li>• Use a unique password for this account</li>
                        </ul>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}