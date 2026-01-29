'use client';

import { Theme, useTheme } from '@/hooks/useTheme';

const PRESET_THEMES = [
  { name: 'Ocean Blue', primary: '#3b82f6', accent: '#06b6d4' },
  { name: 'Purple Dream', primary: '#8b5cf6', accent: '#ec4899' },
  { name: 'Forest Green', primary: '#10b981', accent: '#84cc16' },
  { name: 'Sunset Orange', primary: '#f59e0b', accent: '#ef4444' },
  { name: 'Royal Purple', primary: '#7c3aed', accent: '#a78bfa' },
  { name: 'Emerald', primary: '#059669', accent: '#34d399' },
];

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { config, updateTheme, resetTheme, mounted } = useTheme();

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Theme Customization
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Theme Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as Theme[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateTheme({ theme: mode })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    config.theme === mode
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '💻'}
                    </div>
                    <div className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                      {mode}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Themes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Preset Themes
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateTheme({ primaryColor: preset.primary, accentColor: preset.accent })}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Accent Color
              </label>
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Border Radius
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((radius) => (
                <button
                  key={radius}
                  onClick={() => updateTheme({ borderRadius: radius })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config.borderRadius === radius
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium capitalize text-gray-900 dark:text-white">
                    {radius}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['sm', 'base', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateTheme({ fontSize: size })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config.fontSize === size
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {size === 'sm' ? 'Small' : size === 'base' ? 'Medium' : 'Large'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between">
          <button
            onClick={resetTheme}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
