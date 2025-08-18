// components/ThemeProvider.tsx
import { useEffect } from 'react';
import { initializeTheme } from '@/utils/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Initialize theme as soon as possible
    const cleanup = initializeTheme();
    return cleanup;
  }, []);

  return <>{children}</>;
}