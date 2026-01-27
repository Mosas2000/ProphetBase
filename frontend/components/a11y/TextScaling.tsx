'use client';

import { BookOpen, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';

// Text scaling configuration
export interface TextScaleConfig {
  baseFontSize: number;
  scaleRatio: number;
  minScale: number;
  maxScale: number;
  lineHeightRatio: number;
}

export const DEFAULT_TEXT_CONFIG: TextScaleConfig = {
  baseFontSize: 16,
  scaleRatio: 1,
  minScale: 0.75,
  maxScale: 2,
  lineHeightRatio: 1.5,
};

// Text scaling manager
export class TextScalingManager {
  private config: TextScaleConfig = { ...DEFAULT_TEXT_CONFIG };
  private listeners: Array<(config: TextScaleConfig) => void> = [];

  setScale(ratio: number): void {
    this.config.scaleRatio = Math.max(
      this.config.minScale,
      Math.min(this.config.maxScale, ratio)
    );
    this.apply();
    this.notifyListeners();
  }

  increaseScale(step: number = 0.1): void {
    this.setScale(this.config.scaleRatio + step);
  }

  decreaseScale(step: number = 0.1): void {
    this.setScale(this.config.scaleRatio - step);
  }

  resetScale(): void {
    this.config.scaleRatio = 1;
    this.apply();
    this.notifyListeners();
  }

  setBaseFontSize(size: number): void {
    this.config.baseFontSize = size;
    this.apply();
    this.notifyListeners();
  }

  private apply(): void {
    const root = document.documentElement;
    const scaledSize = this.config.baseFontSize * this.config.scaleRatio;

    root.style.setProperty(
      '--text-scale-ratio',
      this.config.scaleRatio.toString()
    );
    root.style.setProperty('--base-font-size', `${scaledSize}px`);
    root.style.setProperty(
      '--line-height',
      this.config.lineHeightRatio.toString()
    );

    // Apply to body
    document.body.style.fontSize = `${scaledSize}px`;
    document.body.style.lineHeight = this.config.lineHeightRatio.toString();

    // Save to localStorage
    localStorage.setItem('textScaleConfig', JSON.stringify(this.config));
  }

  loadSaved(): void {
    const saved = localStorage.getItem('textScaleConfig');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
        this.apply();
      } catch (error) {
        console.error('Failed to load text scale config:', error);
      }
    }
  }

  getConfig(): TextScaleConfig {
    return { ...this.config };
  }

  subscribe(listener: (config: TextScaleConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }
}

// Reading mode manager
export class ReadingModeManager {
  private active: boolean = false;
  private listeners: Array<(active: boolean) => void> = [];

  toggle(): void {
    this.active = !this.active;
    this.apply();
    this.notifyListeners();
  }

  setActive(active: boolean): void {
    this.active = active;
    this.apply();
    this.notifyListeners();
  }

  private apply(): void {
    const root = document.documentElement;

    if (this.active) {
      root.classList.add('reading-mode');
      root.style.setProperty('--reading-max-width', '65ch');
      root.style.setProperty('--reading-padding', '2rem');
    } else {
      root.classList.remove('reading-mode');
      root.style.removeProperty('--reading-max-width');
      root.style.removeProperty('--reading-padding');
    }

    localStorage.setItem('readingMode', this.active.toString());
  }

  loadSaved(): void {
    const saved = localStorage.getItem('readingMode');
    if (saved === 'true') {
      this.setActive(true);
    }
  }

  isActive(): boolean {
    return this.active;
  }

  subscribe(listener: (active: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.active));
  }
}

// Text scaling hook
export function useTextScaling() {
  const [config, setConfig] = useState<TextScaleConfig>(DEFAULT_TEXT_CONFIG);
  const [manager] = useState(() => new TextScalingManager());

  useEffect(() => {
    manager.loadSaved();
    setConfig(manager.getConfig());

    const unsubscribe = manager.subscribe((newConfig) => {
      setConfig(newConfig);
    });

    return unsubscribe;
  }, [manager]);

  return {
    config,
    increaseScale: () => manager.increaseScale(),
    decreaseScale: () => manager.decreaseScale(),
    resetScale: () => manager.resetScale(),
    setScale: (ratio: number) => manager.setScale(ratio),
    setBaseFontSize: (size: number) => manager.setBaseFontSize(size),
  };
}

// Reading mode hook
export function useReadingMode() {
  const [active, setActive] = useState(false);
  const [manager] = useState(() => new ReadingModeManager());

  useEffect(() => {
    manager.loadSaved();
    setActive(manager.isActive());

    const unsubscribe = manager.subscribe((isActive) => {
      setActive(isActive);
    });

    return unsubscribe;
  }, [manager]);

  return {
    active,
    toggle: () => manager.toggle(),
    setActive: (value: boolean) => manager.setActive(value),
  };
}

// Zoom support utility
export function useZoomSupport() {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const zoom = window.devicePixelRatio || 1;
      setZoomLevel(zoom);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { zoomLevel };
}

// Text scaling dashboard
export function TextScalingDashboard() {
  const { config, increaseScale, decreaseScale, resetScale, setBaseFontSize } =
    useTextScaling();
  const { active: readingMode, toggle: toggleReading } = useReadingMode();
  const { zoomLevel } = useZoomSupport();

  return (
    <div
      className="p-6 bg-slate-800 rounded-xl"
      role="region"
      aria-label="Text Scaling Settings"
    >
      <div className="flex items-center gap-3 mb-6">
        <Type className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold">Text Scaling</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Font Size Controls</h3>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={decreaseScale}
                className="p-3 bg-slate-600 hover:bg-slate-500 rounded-lg"
                aria-label="Decrease font size"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <div className="flex-1 text-center">
                <div className="text-3xl font-bold">
                  {Math.round(config.scaleRatio * 100)}%
                </div>
                <div className="text-sm text-slate-400">
                  {Math.round(config.baseFontSize * config.scaleRatio)}px
                </div>
              </div>

              <button
                onClick={increaseScale}
                className="p-3 bg-slate-600 hover:bg-slate-500 rounded-lg"
                aria-label="Increase font size"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={resetScale}
              className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Reset to Default
            </button>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Base Font Size</h3>
            <input
              type="range"
              min="12"
              max="24"
              value={config.baseFontSize}
              onChange={(e) => setBaseFontSize(Number(e.target.value))}
              className="w-full"
              aria-label="Base font size"
            />
            <div className="text-sm text-slate-400 text-center mt-2">
              {config.baseFontSize}px
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="font-bold">Reading Mode</span>
              </div>
              <button
                onClick={toggleReading}
                className={`px-4 py-2 rounded ${
                  readingMode ? 'bg-green-600' : 'bg-slate-600'
                }`}
              >
                {readingMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Optimizes text layout for comfortable reading
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Preview</h3>
            <div className="space-y-4 p-4 bg-slate-800 rounded">
              <p className="text-2xl font-bold">Heading Text</p>
              <p className="text-base">
                This is body text that demonstrates how the current text scaling
                settings affect readability. The text should be comfortable to
                read at all sizes.
              </p>
              <p className="text-sm text-slate-400">
                Small text remains readable even at different zoom levels.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">System Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Browser Zoom:</span>
                <span className="font-mono">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Computed Size:</span>
                <span className="font-mono">
                  {Math.round(
                    config.baseFontSize * config.scaleRatio * zoomLevel
                  )}
                  px
                </span>
              </div>
              <div className="flex justify-between">
                <span>Line Height:</span>
                <span className="font-mono">{config.lineHeightRatio}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export singletons
export const textScalingManager = new TextScalingManager();
export const readingModeManager = new ReadingModeManager();
