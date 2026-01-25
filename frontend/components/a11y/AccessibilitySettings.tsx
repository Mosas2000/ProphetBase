'use client';

import { useEffect, useState } from 'react';
import { Settings, Moon, Zap, Eye, Type } from 'lucide-react';

// Accessibility preferences
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardOnly: boolean;
  animations: boolean;
  autoplay: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicator: 'default' | 'enhanced' | 'high-contrast';
  linkUnderlines: boolean;
  simplifiedUI: boolean;
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardOnly: false,
  animations: true,
  autoplay: false,
  colorBlindMode: 'none',
  focusIndicator: 'default',
  linkUnderlines: false,
  simplifiedUI: false,
};

// Accessibility settings manager
export class AccessibilitySettingsManager {
  private preferences: AccessibilityPreferences = { ...DEFAULT_PREFERENCES };
  private listeners: Array<(prefs: AccessibilityPreferences) => void> = [];

  constructor() {
    this.loadPreferences();
    this.detectSystemPreferences();
    this.applyPreferences();
  }

  // Preference management
  setPreference<K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ): void {
    this.preferences[key] = value;
    this.applyPreferences();
    this.savePreferences();
    this.notifyListeners();
  }

  getPreferences(): AccessibilityPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.applyPreferences();
    this.savePreferences();
    this.notifyListeners();
  }

  // Detect system preferences
  private detectSystemPreferences(): void {
    if (typeof window === 'undefined') return;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.preferences.reducedMotion = true;
      this.preferences.animations = false;
    }

    // Detect prefers-contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      this.preferences.highContrast = true;
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.setPreference('reducedMotion', e.matches);
      this.setPreference('animations', !e.matches);
    });

    window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
      this.setPreference('highContrast', e.matches);
    });
  }

  // Apply preferences to DOM
  private applyPreferences(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Reduced motion
    if (this.preferences.reducedMotion) {
      root.classList.add('reduce-motion');
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.classList.remove('reduce-motion');
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (this.preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (this.preferences.largeText) {
      root.classList.add('large-text');
      root.style.setProperty('--base-font-size', '18px');
    } else {
      root.classList.remove('large-text');
      root.style.removeProperty('--base-font-size');
    }

    // Screen reader
    if (this.preferences.screenReader) {
      root.classList.add('screen-reader-active');
    } else {
      root.classList.remove('screen-reader-active');
    }

    // Keyboard only
    if (this.preferences.keyboardOnly) {
      root.classList.add('keyboard-only');
    } else {
      root.classList.remove('keyboard-only');
    }

    // Animations
    if (!this.preferences.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Color blind mode
    root.setAttribute('data-colorblind-mode', this.preferences.colorBlindMode);

    // Focus indicator
    root.setAttribute('data-focus-indicator', this.preferences.focusIndicator);

    // Link underlines
    if (this.preferences.linkUnderlines) {
      root.classList.add('link-underlines');
    } else {
      root.classList.remove('link-underlines');
    }

    // Simplified UI
    if (this.preferences.simplifiedUI) {
      root.classList.add('simplified-ui');
    } else {
      root.classList.remove('simplified-ui');
    }
  }

  // Storage
  private savePreferences(): void {
    localStorage.setItem('a11yPreferences', JSON.stringify(this.preferences));
  }

  private loadPreferences(): void {
    const saved = localStorage.getItem('a11yPreferences');
    if (saved) {
      try {
        this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load accessibility preferences:', error);
      }
    }
  }

  // Subscription
  subscribe(listener: (prefs: AccessibilityPreferences) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getPreferences()));
  }
}

// Accessibility settings hook
export function useAccessibilitySettings() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [manager] = useState(() => new AccessibilitySettingsManager());

  useEffect(() => {
    setPreferences(manager.getPreferences());
    const unsubscribe = manager.subscribe((prefs) => {
      setPreferences(prefs);
    });
    return unsubscribe;
  }, [manager]);

  return {
    preferences,
    setPreference: <K extends keyof AccessibilityPreferences>(
      key: K,
      value: AccessibilityPreferences[K]
    ) => manager.setPreference(key, value),
    resetToDefaults: () => manager.resetToDefaults(),
  };
}

// Accessibility settings dashboard
export function AccessibilitySettingsDashboard() {
  const { preferences, setPreference, resetToDefaults } = useAccessibilitySettings();

  const toggles = [
    {
      key: 'reducedMotion' as const,
      label: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: Moon,
    },
    {
      key: 'highContrast' as const,
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Eye,
    },
    {
      key: 'largeText' as const,
      label: 'Large Text',
      description: 'Increase default font size',
      icon: Type,
    },
    {
      key: 'animations' as const,
      label: 'Animations',
      description: 'Enable decorative animations',
      icon: Zap,
    },
    {
      key: 'autoplay' as const,
      label: 'Autoplay Media',
      description: 'Automatically play videos and audio',
      icon: Zap,
    },
    {
      key: 'linkUnderlines' as const,
      label: 'Link Underlines',
      description: 'Always underline links',
      icon: Type,
    },
    {
      key: 'simplifiedUI' as const,
      label: 'Simplified UI',
      description: 'Reduce visual complexity',
      icon: Eye,
    },
  ];

  return (
    <div className="p-6 bg-slate-800 rounded-xl" role="region" aria-label="Accessibility Settings">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold">Accessibility Settings</h2>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <h3 className="font-bold mb-4">Motion & Visual</h3>
          {toggles.slice(0, 4).map((toggle) => {
            const Icon = toggle.icon;
            return (
              <div
                key={toggle.key}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium">{toggle.label}</div>
                    <div className="text-sm text-slate-400">{toggle.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => setPreference(toggle.key, !preferences[toggle.key])}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences[toggle.key] ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                  aria-label={`${toggle.label} ${preferences[toggle.key] ? 'enabled' : 'disabled'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences[toggle.key] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h3 className="font-bold mb-4">Content & Navigation</h3>
          {toggles.slice(4).map((toggle) => {
            const Icon = toggle.icon;
            return (
              <div
                key={toggle.key}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium">{toggle.label}</div>
                    <div className="text-sm text-slate-400">{toggle.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => setPreference(toggle.key, !preferences[toggle.key])}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences[toggle.key] ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                  aria-label={`${toggle.label} ${preferences[toggle.key] ? 'enabled' : 'disabled'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences[toggle.key] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Color Blind Mode</h3>
          <select
            value={preferences.colorBlindMode}
            onChange={(e) =>
              setPreference(
                'colorBlindMode',
                e.target.value as AccessibilityPreferences['colorBlindMode']
              )
            }
            className="w-full px-4 py-2 bg-slate-600 rounded"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (Red-Green)</option>
            <option value="deuteranopia">Deuteranopia (Red-Green)</option>
            <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
          </select>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Focus Indicator</h3>
          <select
            value={preferences.focusIndicator}
            onChange={(e) =>
              setPreference(
                'focusIndicator',
                e.target.value as AccessibilityPreferences['focusIndicator']
              )
            }
            className="w-full px-4 py-2 bg-slate-600 rounded"
          >
            <option value="default">Default</option>
            <option value="enhanced">Enhanced</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
        <h3 className="font-bold mb-2 text-blue-400">System Detected</h3>
        <div className="text-sm text-slate-300">
          Some settings are automatically detected from your operating system preferences and will
          be applied when available.
        </div>
      </div>
    </div>
  );
}

// Export singleton
export const accessibilitySettings = new AccessibilitySettingsManager();
