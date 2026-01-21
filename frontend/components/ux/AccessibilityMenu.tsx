'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings
    const root = document.documentElement;

    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    };
    root.style.fontSize = fontSizes[settings.fontSize];

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Save settings
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all z-50"
        aria-label="Accessibility Menu"
        title="Accessibility Settings"
      >
        ♿
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-24 left-6 z-50 w-96">
            <Card className="border-2 border-purple-500">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">♿ Accessibility</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Font Size</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['small', 'medium', 'large', 'x-large'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => updateSetting('fontSize', size)}
                          className={`p-3 rounded-lg border transition-colors ${
                            settings.fontSize === size
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <span className={`font-bold ${
                            size === 'small' ? 'text-xs' :
                            size === 'medium' ? 'text-sm' :
                            size === 'large' ? 'text-base' :
                            'text-lg'
                          }`}>
                            A
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">High Contrast Mode</p>
                      <p className="text-sm text-gray-400">Increase color contrast</p>
                    </div>
                    <button
                      onClick={() => updateSetting('highContrast', !settings.highContrast)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.highContrast ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.highContrast ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Reduce Motion</p>
                      <p className="text-sm text-gray-400">Minimize animations</p>
                    </div>
                    <button
                      onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.reducedMotion ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.reducedMotion ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Screen Reader */}
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Screen Reader Mode</p>
                      <p className="text-sm text-gray-400">Optimize for screen readers</p>
                    </div>
                    <button
                      onClick={() => updateSetting('screenReaderOptimized', !settings.screenReaderOptimized)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.screenReaderOptimized ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.screenReaderOptimized ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Keyboard Navigation</p>
                      <p className="text-sm text-gray-400">Enhanced keyboard support</p>
                    </div>
                    <button
                      onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.keyboardNavigation ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.keyboardNavigation ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSettings({
                      fontSize: 'medium',
                      highContrast: false,
                      reducedMotion: false,
                      screenReaderOptimized: false,
                      keyboardNavigation: true,
                    });
                  }}
                  className="w-full mt-6"
                >
                  Reset to Defaults
                </Button>

                {/* Info */}
                <div className="mt-6 bg-purple-500/10 border border-purple-500 rounded-lg p-4">
                  <p className="text-sm text-purple-400">
                    💡 These settings are saved locally and will persist across sessions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .high-contrast {
          --bg-primary: #000000;
          --bg-secondary: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #e0e0e0;
          --border-color: #ffffff;
        }

        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .screen-reader-optimized {
          /* Enhanced focus indicators */
          *:focus {
            outline: 3px solid #a855f7;
            outline-offset: 2px;
          }
        }

        /* Skip to main content link for screen readers */
        .skip-to-main {
          position: absolute;
          left: -9999px;
          z-index: 999;
          padding: 1em;
          background-color: #a855f7;
          color: white;
          text-decoration: none;
        }

        .skip-to-main:focus {
          left: 50%;
          transform: translateX(-50%);
          top: 0;
        }
      `}</style>
    </>
  );
}
