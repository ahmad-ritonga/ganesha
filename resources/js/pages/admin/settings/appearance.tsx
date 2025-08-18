import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { IconSun, IconMoon, IconDeviceDesktop, IconCheck } from '@tabler/icons-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
    },
    {
        title: 'Appearance',
    },
];

type ThemeType = 'light' | 'dark' | 'system';

interface AppearanceProps {
    isAdmin?: boolean;
}

// Helper functions to manage cookies
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

// Initialize theme from cookies or default values
const getInitialTheme = (): ThemeType => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = getCookie('theme') as ThemeType;
    return savedTheme || 'light';
};

const getInitialBoolean = (cookieName: string, defaultValue: boolean = false): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = getCookie(cookieName);
    return saved === 'true';
};

export default function AdminAppearanceSettings({ isAdmin = true }: AppearanceProps) {
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>('light');
    const [reduceMotion, setReduceMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize settings from cookies on mount
    useEffect(() => {
        const theme = getInitialTheme();
        const motion = getInitialBoolean('reduceMotion');
        const contrast = getInitialBoolean('highContrast');
        const compact = getInitialBoolean('compactMode');

        setSelectedTheme(theme);
        setReduceMotion(motion);
        setHighContrast(contrast);
        setCompactMode(compact);
        setIsLoaded(true);

        // Apply settings immediately
        applyTheme(theme);
        applyDisplaySettings(motion, contrast, compact);
    }, []);

    const applyTheme = (theme: ThemeType) => {
        const root = document.documentElement;
        
        // Remove all theme classes first
        root.classList.remove('dark', 'light');
        
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.setProperty('--theme', 'dark');
        } else if (theme === 'light') {
            root.classList.add('light');
            root.style.setProperty('--theme', 'light');
            // Ensure dark class is removed for light theme
            root.classList.remove('dark');
        } else if (theme === 'system') {
            // Check system preference
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemDark) {
                root.classList.add('dark');
                root.style.setProperty('--theme', 'dark');
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
                root.style.setProperty('--theme', 'light');
            }
        }
    };

    const applyDisplaySettings = (
        motionReduced: boolean = reduceMotion, 
        contrastHigh: boolean = highContrast, 
        modeCompact: boolean = compactMode
    ) => {
        const root = document.documentElement;
        
        if (motionReduced) {
            root.style.setProperty('--motion-duration', '0s');
            root.classList.add('reduce-motion');
        } else {
            root.style.removeProperty('--motion-duration');
            root.classList.remove('reduce-motion');
        }

        if (contrastHigh) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        if (modeCompact) {
            root.classList.add('compact');
        } else {
            root.classList.remove('compact');
        }
    };

    const handleThemeChange = (theme: ThemeType) => {
        setSelectedTheme(theme);
        applyTheme(theme);
        setCookie('theme', theme);
    };

    const handleToggle = (setting: string, value: boolean) => {
        switch (setting) {
            case 'reduceMotion':
                setReduceMotion(value);
                setCookie('reduceMotion', value.toString());
                break;
            case 'highContrast':
                setHighContrast(value);
                setCookie('highContrast', value.toString());
                break;
            case 'compactMode':
                setCompactMode(value);
                setCookie('compactMode', value.toString());
                break;
        }
        applyDisplaySettings();
    };

    const savePreferences = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        
        // Apply all settings
        applyTheme(selectedTheme);
        applyDisplaySettings();
        
        // Save to cookies
        setCookie('theme', selectedTheme);
        setCookie('reduceMotion', reduceMotion.toString());
        setCookie('highContrast', highContrast.toString());
        setCookie('compactMode', compactMode.toString());
        
        // Here you could also send preferences to server
        // fetch('/api/user/preferences', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         theme: selectedTheme,
        //         reduceMotion,
        //         highContrast,
        //         compactMode
        //     })
        // });
    };

    const themes = [
        {
            id: 'light' as ThemeType,
            name: 'Light',
            description: 'Clean and bright interface',
            icon: IconSun,
        },
        {
            id: 'dark' as ThemeType,
            name: 'Dark',
            description: 'Easy on the eyes in low light',
            icon: IconMoon,
        },
        {
            id: 'system' as ThemeType,
            name: 'System',
            description: 'Matches your device settings',
            icon: IconDeviceDesktop,
        },
    ];

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                checked ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    // Don't render until settings are loaded to prevent flash
    if (!isLoaded) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance Settings" />
                <SettingsLayout isAdmin={isAdmin}>
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                </SettingsLayout>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance Settings" />
            
            <SettingsLayout isAdmin={isAdmin}>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Appearance Settings
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Customize how the interface looks and feels for you.
                        </p>
                    </div>

                    {/* Theme Selection */}
                    <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                            Theme Preference
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {themes.map((theme) => {
                                const Icon = theme.icon;
                                const isSelected = selectedTheme === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeChange(theme.id)}
                                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                                            isSelected
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon className={`h-5 w-5 ${
                                                isSelected 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : 'text-neutral-600 dark:text-neutral-400'
                                            }`} />
                                            <span className={`font-medium ${
                                                isSelected 
                                                    ? 'text-emerald-900 dark:text-emerald-100' 
                                                    : 'text-neutral-900 dark:text-neutral-100'
                                            }`}>
                                                {theme.name}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${
                                            isSelected 
                                                ? 'text-emerald-700 dark:text-emerald-300' 
                                                : 'text-neutral-600 dark:text-neutral-400'
                                        }`}>
                                            {theme.description}
                                        </p>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <IconCheck className="h-4 w-4 text-emerald-500" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Theme Preview */}
                    <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                            Preview
                        </h3>
                        <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                        Sample Interface
                                    </h4>
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                                        <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4"></div>
                                    <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-1/2"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-emerald-500 rounded px-4 flex items-center">
                                            <span className="text-white text-sm">Primary Button</span>
                                        </div>
                                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded px-4 flex items-center">
                                            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Secondary</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display Options */}
                    <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                            Display Options
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Reduce motion
                                    </label>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        Minimize animations and transitions
                                    </p>
                                </div>
                                <ToggleSwitch 
                                    checked={reduceMotion} 
                                    onChange={(checked) => handleToggle('reduceMotion', checked)} 
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        High contrast
                                    </label>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        Increase contrast for better visibility
                                    </p>
                                </div>
                                <ToggleSwitch 
                                    checked={highContrast} 
                                    onChange={(checked) => handleToggle('highContrast', checked)} 
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Compact mode
                                    </label>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        Show more content in less space
                                    </p>
                                </div>
                                <ToggleSwitch 
                                    checked={compactMode} 
                                    onChange={(checked) => handleToggle('compactMode', checked)} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={savePreferences}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Save Preferences
                            </button>
                            
                            {saved && (
                                <p className="text-sm text-green-600 dark:text-green-400">Preferences saved successfully!</p>
                            )}
                        </div>
                        
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                            Your appearance preferences are automatically applied and saved.
                        </p>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}