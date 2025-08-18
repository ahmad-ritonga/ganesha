import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { type NavItem } from '@/types';
import { IconUser, IconKey, IconPalette } from '@tabler/icons-react';

interface SettingsLayoutProps extends PropsWithChildren {
    isAdmin?: boolean;
}

export default function SettingsLayout({ children, isAdmin = false }: SettingsLayoutProps) {
    const { url } = usePage();

    // Define navigation items based on user role
    const getSidebarNavItems = (): NavItem[] => {
        if (isAdmin) {
            return [
                {
                    title: 'Profile',
                    href: '/admin/settings/profile',
                    icon: IconUser,
                },
                {
                    title: 'Password',
                    href: '/admin/settings/password',
                    icon: IconKey,
                },
                {
                    title: 'Appearance',
                    href: '/admin/settings/appearance',
                    icon: IconPalette,
                },
            ];
        } else {
            return [
                {
                    title: 'Profile',
                    href: '/settings/profile',
                    icon: IconUser,
                },
                {
                    title: 'Password',
                    href: '/settings/password',
                    icon: IconKey,
                },
                {
                    title: 'Appearance',
                    href: '/settings/appearance',
                    icon: IconPalette,
                },
            ];
        }
    };

    const sidebarNavItems = getSidebarNavItems();

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Settings
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <div className="flex flex-1 gap-6">
                {/* Settings Navigation Sidebar */}
                <div className="w-64 shrink-0">
                    <nav className="space-y-2">
                        {sidebarNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = url === item.href;
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                                            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    {Icon && <Icon className="h-5 w-5" />}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Separator for mobile */}
                <div className="block md:hidden w-px bg-neutral-200 dark:bg-neutral-700"></div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                    <div className="max-w-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}