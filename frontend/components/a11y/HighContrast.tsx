'use client';

import { Check, Eye, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';

// High contrast themes
export interface ContrastTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
  };
}

export const HIGH_CONTRAST_THEMES: Record<string, ContrastTheme> = {
  standard: {
    id: 'standard',
    name: 'Standard High Contrast',
    colors: {
      background: '#000000',
      foreground: '#FFFFFF',
      primary: '#FFFF00',
      secondary: '#00FFFF',
      accent: '#FF00FF',
      border: '#FFFFFF',
    },
  },
  blackOnWhite: {
    id: 'blackOnWhite',
    name: 'Black on White',
    colors: {
      background: '#FFFFFF',
      foreground: '#000000',
      primary: '#0000FF',
      secondary: '#008000',
      accent: '#800080',
      border: '#000000',
    },
  },
  deuteranopia: {
    id: 'deuteranopia',
    name: 'Deuteranopia (Red-Green)',
    colors: {
      background: '#000033',
      foreground: '#FFCC00',
      primary: '#0099FF',
      secondary: '#FF6600',
      accent: '#CC00FF',
      border: '#FFCC00',
    },
  },
  protanopia: {
    id: 'protanopia',
    name: 'Protanopia (Red-Green)',
    colors: {
      background: '#1A1A2E',
      foreground: '#00CCFF',
      primary: '#FFD700',
      secondary: '#00FF99',
      accent: '#FF69B4',
      border: '#00CCFF',
    },
  },
  tritanopia: {
    id: 'tritanopia',
    name: 'Tritanopia (Blue-Yellow)',
    colors: {
      background: '#2D0A0A',
      foreground: '#FF6B6B',
      primary: '#4ECDC4',
      secondary: '#FFE66D',
      accent: '#FF1744',
      border: '#FF6B6B',
    },
  },
};

// Contrast checker utility
export class ContrastChecker {
  static calculateLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  static calculateContrastRatio(color1: string, color2: string): number {
    const lum1 = this.calculateLuminance(color1);
    const lum2 = this.calculateLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static meetsWCAG(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean {
    const ratio = this.calculateContrastRatio(foreground, background);
    
    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}

// High contrast theme manager
export class HighContrastManager {
  private currentTheme: ContrastTheme | null = null;
  private listeners: Array<(theme: ContrastTheme | null) => void> = [];

  applyTheme(theme: ContrastTheme): void {
    this.currentTheme = theme;
    
    // Apply CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--hc-${key}`, value);
    });

    // Save to localStorage
    localStorage.setItem('highContrastTheme', theme.id);
    
    // Notify listeners
    this.listeners.forEach((listener) => listener(theme));
  }

  removeTheme(): void {
    this.currentTheme = null;
    
    // Remove CSS variables
    const root = document.documentElement;
    ['background', 'foreground', 'primary', 'secondary', 'accent', 'border'].forEach((key) => {
      root.style.removeProperty(`--hc-${key}`);
    });

    localStorage.removeItem('highContrastTheme');
    this.listeners.forEach((listener) => listener(null));
  }

  getCurrentTheme(): ContrastTheme | null {
    return this.currentTheme;
  }

  loadSavedTheme(): void {
    const saved = localStorage.getItem('highContrastTheme');
    if (saved && HIGH_CONTRAST_THEMES[saved]) {
      this.applyTheme(HIGH_CONTRAST_THEMES[saved]);
    }
  }

  subscribe(listener: (theme: ContrastTheme | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

// High contrast hook
export function useHighContrast() {
  const [theme, setTheme] = useState<ContrastTheme | null>(null);
  const [manager] = useState(() => new HighContrastManager());

  useEffect(() => {
    manager.loadSavedTheme();
    setTheme(manager.getCurrentTheme());

    const unsubscribe = manager.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    return unsubscribe;
  }, [manager]);

  const applyTheme = (themeId: string) => {
    const selectedTheme = HIGH_CONTRAST_THEMES[themeId];
    if (selectedTheme) {
      manager.applyTheme(selectedTheme);
    }
  };

  const removeTheme = () => {
    manager.removeTheme();
  };

  return {
    theme,
    applyTheme,
    removeTheme,
    availableThemes: Object.values(HIGH_CONTRAST_THEMES),
  };
}

// Contrast checker component
export function ContrastCheckerWidget() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const newRatio = ContrastChecker.calculateContrastRatio(foreground, background);
    setRatio(newRatio);
  }, [foreground, background]);

  const meetsAA = ContrastChecker.meetsWCAG(foreground, background, 'AA');
  const meetsAAA = ContrastChecker.meetsWCAG(foreground, background, 'AAA');

  return (
    <div className="p-4 bg-slate-700 rounded-lg">
      <h3 className="font-bold mb-4">Contrast Checker</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-2">Foreground</label>
          <input
            type="color"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            className="w-full h-10 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Background</label>
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full h-10 rounded"
          />
        </div>
      </div>

      <div
        className="p-4 rounded mb-4 text-center font-bold"
        style={{ backgroundColor: background, color: foreground }}
      >
        Sample Text
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Contrast Ratio:</span>
          <span className="font-bold">{ratio.toFixed(2)}:1</span>
        </div>
        <div className="flex items-center justify-between">
          <span>WCAG AA:</span>
          <span className={meetsAA ? 'text-green-400' : 'text-red-400'}>
            {meetsAA ? '✓ Pass' : '✗ Fail'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>WCAG AAA:</span>
          <span className={meetsAAA ? 'text-green-400' : 'text-red-400'}>
            {meetsAAA ? '✓ Pass' : '✗ Fail'}
          </span>
        </div>
      </div>
    </div>
  );
}

// High contrast dashboard
export function HighContrastDashboard() {
  const { theme, applyTheme, removeTheme, availableThemes } = useHighContrast();

  return (
    <div className="p-6 bg-slate-800 rounded-xl" role="region" aria-label="High Contrast Settings">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-pink-400" />
        <h2 className="text-2xl font-bold">High Contrast Mode</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold mb-4">Available Themes</h3>
          <div className="space-y-2">
            {availableThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                  theme?.id === t.id
                    ? 'bg-blue-600 ring-2 ring-blue-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <span>{t.name}</span>
                </div>
                {theme?.id === t.id && <Check className="w-5 h-5" />}
              </button>
            ))}
          </div>

          {theme && (
            <button
              onClick={removeTheme}
              className="w-full mt-4 p-3 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Disable High Contrast
            </button>
          )}
        </div>

        <ContrastCheckerWidget />
      </div>

      {theme && (
        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-3">Current Theme Preview</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: value }}
                />
                <span className="capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export singleton
export const highContrastManager = new HighContrastManager();
