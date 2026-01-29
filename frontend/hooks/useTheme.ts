import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeConfig {
  theme: Theme;
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize: 'sm' | 'base' | 'lg';
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  theme: 'system',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  borderRadius: 'lg',
  fontSize: 'base',
};

const STORAGE_KEY = 'prophetbase-theme-config';

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse theme config:', e);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Apply theme mode
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else if (config.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply custom CSS variables
    root.style.setProperty('--color-primary', config.primaryColor);
    root.style.setProperty('--color-accent', config.accentColor);
    root.style.setProperty('--border-radius', getBorderRadiusValue(config.borderRadius));
    root.style.setProperty('--font-size-base', getFontSizeValue(config.fontSize));

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config, mounted]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setConfig(DEFAULT_THEME_CONFIG);
  };

  return {
    config,
    updateTheme,
    resetTheme,
    mounted,
  };
}

function getBorderRadiusValue(size: ThemeConfig['borderRadius']): string {
  const values = {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  };
  return values[size];
}

function getFontSizeValue(size: ThemeConfig['fontSize']): string {
  const values = {
    sm: '14px',
    base: '16px',
    lg: '18px',
  };
  return values[size];
}
