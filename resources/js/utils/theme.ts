// utils/theme.ts
export type ThemeType = 'light' | 'dark' | 'system';

// Helper functions to manage cookies
export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof window === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

export const getInitialTheme = (): ThemeType => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = getCookie('theme') as ThemeType;
    return savedTheme || 'light';
};

export const getInitialBoolean = (cookieName: string, defaultValue: boolean = false): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = getCookie(cookieName);
    return saved === 'true';
};

export const applyTheme = (theme: ThemeType) => {
    if (typeof window === 'undefined') return;
    
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

export const applyDisplaySettings = (
    reduceMotion?: boolean, 
    highContrast?: boolean, 
    compactMode?: boolean
) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Get values from cookies if not provided
    const motionReduced = reduceMotion ?? getInitialBoolean('reduceMotion');
    const contrastHigh = highContrast ?? getInitialBoolean('highContrast');
    const modeCompact = compactMode ?? getInitialBoolean('compactMode');
    
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

// Initialize theme on page load
export const initializeTheme = () => {
    if (typeof window === 'undefined') return;
    
    const theme = getInitialTheme();
    applyTheme(theme);
    applyDisplaySettings();
    
    // Listen for system theme changes if using system theme
    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');
        mediaQuery.addListener(handleChange);
        
        // Return cleanup function
        return () => mediaQuery.removeListener(handleChange);
    }
};