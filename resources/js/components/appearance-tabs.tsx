import { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconDeviceDesktop, IconCheck } from '@tabler/icons-react';

type ThemeType = 'light' | 'dark' | 'system';

export default function AppearanceTabs() {
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>('system');
    const [reduceMotion, setReduceMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [compactMode, setCompactMode] = useState(false);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeType || 'system';
        const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
        const savedHighContrast = localStorage.getItem('highContrast') === 'true';
        const savedCompactMode = localStorage.getItem('compactMode') === 'true';

        setSelectedTheme(savedTheme);
        setReduceMotion(savedReduceMotion);
        setHighContrast(savedHighContrast);
        setCompactMode(savedCompactMode);

        // Apply theme on load
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (theme: ThemeType) => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else if (theme === 'system') {
            // Check system preference
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const handleThemeChange = (theme: ThemeType) => {
        setSelectedTheme(theme);
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    };

    const handleToggle = (setting: string, value: boolean) => {
        const root = document.documentElement;
        
        switch (setting) {
            case 'reduceMotion':
                setReduceMotion(value);
                localStorage.setItem('reduceMotion', value.toString());
                if (value) {
                    root.style.setProperty('--motion-duration', '0s');
                } else {
                    root.style.removeProperty('--motion-duration');
                }
                break;
            case 'highContrast':
                setHighContrast(value);
                localStorage.setItem('highContrast', value.toString());
                if (value) {
                    root.classList.add('high-contrast');
                } else {
                    root.classList.remove('high-contrast');
                }
                break;
            case 'compactMode':
                setCompactMode(value);
                localStorage.setItem('compactMode', value.toString());
                if (value) {
                    root.classList.add('compact');
                } else {
                    root.classList.remove('compact');
                }
                break;
        }
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                checked ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="space-y-6">
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
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className={`h-5 w-5 ${
                                        isSelected 
                                            ? 'text-indigo-600 dark:text-indigo-400' 
                                            : 'text-neutral-600 dark:text-neutral-400'
                                    }`} />
                                    <span className={`font-medium ${
                                        isSelected 
                                            ? 'text-indigo-900 dark:text-indigo-100' 
                                            : 'text-neutral-900 dark:text-neutral-100'
                                    }`}>
                                        {theme.name}
                                    </span>
                                </div>
                                <p className={`text-sm ${
                                    isSelected 
                                        ? 'text-indigo-700 dark:text-indigo-300' 
                                        : 'text-neutral-600 dark:text-neutral-400'
                                }`}>
                                    {theme.description}
                                </p>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <IconCheck className="h-4 w-4 text-indigo-500" />
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
                                <div className="h-8 bg-indigo-500 rounded px-4 flex items-center">
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
                    <div className="flex items-center justify-between">
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

                    <div className="flex items-center justify-between">
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

                    <div className="flex items-center justify-between">
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
        </div>
    );
}