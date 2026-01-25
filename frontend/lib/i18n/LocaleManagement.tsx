'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, MapPin } from 'lucide-react';

// Locale configuration
export interface LocaleConfig {
  locale: string;
  currency: string;
  timezone: string;
  dateFormat: 'short' | 'medium' | 'long' | 'full';
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

// Regional presets
export const REGIONAL_PRESETS: Record<string, LocaleConfig> = {
  'en-US': {
    locale: 'en-US',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'medium',
    timeFormat: '12h',
    firstDayOfWeek: 0,
    numberFormat: { decimal: '.', thousands: ',' },
  },
  'en-GB': {
    locale: 'en-GB',
    currency: 'GBP',
    timezone: 'Europe/London',
    dateFormat: 'medium',
    timeFormat: '24h',
    firstDayOfWeek: 1,
    numberFormat: { decimal: '.', thousands: ',' },
  },
  'de-DE': {
    locale: 'de-DE',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    dateFormat: 'medium',
    timeFormat: '24h',
    firstDayOfWeek: 1,
    numberFormat: { decimal: ',', thousands: '.' },
  },
  'fr-FR': {
    locale: 'fr-FR',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    dateFormat: 'medium',
    timeFormat: '24h',
    firstDayOfWeek: 1,
    numberFormat: { decimal: ',', thousands: ' ' },
  },
  'ja-JP': {
    locale: 'ja-JP',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    dateFormat: 'medium',
    timeFormat: '24h',
    firstDayOfWeek: 0,
    numberFormat: { decimal: '.', thousands: ',' },
  },
};

// Locale manager
export class LocaleManager {
  private config: LocaleConfig;
  private listeners: Array<(config: LocaleConfig) => void> = [];

  constructor(initialConfig?: Partial<LocaleConfig>) {
    this.config = {
      ...REGIONAL_PRESETS['en-US'],
      ...initialConfig,
    };
    this.loadSaved();
  }

  // Date/Time formatting
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      dateStyle: this.config.dateFormat,
    };
    return new Intl.DateTimeFormat(this.config.locale, options || defaultOptions).format(date);
  }

  formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: this.config.timeFormat === '12h',
    };
    return new Intl.DateTimeFormat(this.config.locale, options || defaultOptions).format(date);
  }

  formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      dateStyle: this.config.dateFormat,
      timeStyle: 'short',
    };
    return new Intl.DateTimeFormat(this.config.locale, options || defaultOptions).format(date);
  }

  formatRelativeTime(date: Date): string {
    const rtf = new Intl.RelativeTimeFormat(this.config.locale, { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 604800) {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 604800), 'week');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
    }
  }

  // Number formatting
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.config.locale, options).format(value);
  }

  formatCurrency(value: number, currency?: string, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.config.locale, {
      style: 'currency',
      currency: currency || this.config.currency,
      ...options,
    }).format(value);
  }

  formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.config.locale, {
      style: 'percent',
      ...options,
    }).format(value);
  }

  formatCompact(value: number): string {
    return new Intl.NumberFormat(this.config.locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  }

  // Timezone handling
  convertToTimezone(date: Date, timezone?: string): string {
    const tz = timezone || this.config.timezone;
    return new Intl.DateTimeFormat(this.config.locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: tz,
    }).format(date);
  }

  getTimezoneOffset(timezone?: string): number {
    const tz = timezone || this.config.timezone;
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000; // minutes
  }

  // Configuration
  setLocale(locale: string): void {
    this.config.locale = locale;
    this.save();
    this.notifyListeners();
  }

  setCurrency(currency: string): void {
    this.config.currency = currency;
    this.save();
    this.notifyListeners();
  }

  setTimezone(timezone: string): void {
    this.config.timezone = timezone;
    this.save();
    this.notifyListeners();
  }

  applyPreset(presetKey: string): void {
    const preset = REGIONAL_PRESETS[presetKey];
    if (preset) {
      this.config = { ...preset };
      this.save();
      this.notifyListeners();
    }
  }

  getConfig(): LocaleConfig {
    return { ...this.config };
  }

  private save(): void {
    localStorage.setItem('localeConfig', JSON.stringify(this.config));
  }

  private loadSaved(): void {
    const saved = localStorage.getItem('localeConfig');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load locale config:', error);
      }
    }
  }

  subscribe(listener: (config: LocaleConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }
}

// Locale management hook
export function useLocaleManagement() {
  const [config, setConfig] = useState<LocaleConfig>(REGIONAL_PRESETS['en-US']);
  const [manager] = useState(() => new LocaleManager());

  useEffect(() => {
    setConfig(manager.getConfig());
    const unsubscribe = manager.subscribe((newConfig) => {
      setConfig(newConfig);
    });
    return unsubscribe;
  }, [manager]);

  return {
    config,
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => manager.formatDate(date, options),
    formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => manager.formatTime(date, options),
    formatDateTime: (date: Date, options?: Intl.DateTimeFormatOptions) => manager.formatDateTime(date, options),
    formatRelativeTime: (date: Date) => manager.formatRelativeTime(date),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => manager.formatNumber(value, options),
    formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) => 
      manager.formatCurrency(value, currency, options),
    formatPercent: (value: number, options?: Intl.NumberFormatOptions) => manager.formatPercent(value, options),
    formatCompact: (value: number) => manager.formatCompact(value),
    convertToTimezone: (date: Date, timezone?: string) => manager.convertToTimezone(date, timezone),
    setLocale: (locale: string) => manager.setLocale(locale),
    setCurrency: (currency: string) => manager.setCurrency(currency),
    setTimezone: (timezone: string) => manager.setTimezone(timezone),
    applyPreset: (preset: string) => manager.applyPreset(preset),
  };
}

// Locale management dashboard
export function LocaleManagementDashboard() {
  const {
    config,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatNumber,
    formatCurrency,
    formatPercent,
    formatCompact,
    convertToTimezone,
    applyPreset,
  } = useLocaleManagement();

  const [sampleDate] = useState(new Date());
  const [sampleNumber] = useState(1234567.89);
  const [sampleCurrency] = useState(9999.99);

  return (
    <div className="p-6 bg-slate-800 rounded-xl" role="region" aria-label="Locale Management">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-teal-400" />
        <h2 className="text-2xl font-bold">Locale Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Regional Presets</h3>
            <div className="space-y-2">
              {Object.keys(REGIONAL_PRESETS).map((key) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    config.locale === key ? 'bg-blue-600' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Current Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Locale:</span>
                <span className="font-mono">{config.locale}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Currency:</span>
                <span className="font-mono">{config.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timezone:</span>
                <span className="font-mono text-xs">{config.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Format:</span>
                <span className="font-mono">{config.timeFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">First Day:</span>
                <span className="font-mono">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][config.firstDayOfWeek]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold">Date/Time Formatting</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-400">Date: </span>
                <span className="font-medium">{formatDate(sampleDate)}</span>
              </div>
              <div>
                <span className="text-slate-400">Time: </span>
                <span className="font-medium">{formatTime(sampleDate)}</span>
              </div>
              <div>
                <span className="text-slate-400">DateTime: </span>
                <span className="font-medium">{formatDateTime(sampleDate)}</span>
              </div>
              <div>
                <span className="text-slate-400">Relative: </span>
                <span className="font-medium">{formatRelativeTime(new Date(Date.now() - 3600000))}</span>
              </div>
              <div>
                <span className="text-slate-400">Timezone: </span>
                <span className="font-medium text-xs">{convertToTimezone(sampleDate)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="font-bold">Number Formatting</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-400">Number: </span>
                <span className="font-medium">{formatNumber(sampleNumber)}</span>
              </div>
              <div>
                <span className="text-slate-400">Currency: </span>
                <span className="font-medium">{formatCurrency(sampleCurrency)}</span>
              </div>
              <div>
                <span className="text-slate-400">Percent: </span>
                <span className="font-medium">{formatPercent(0.1234)}</span>
              </div>
              <div>
                <span className="text-slate-400">Compact: </span>
                <span className="font-medium">{formatCompact(sampleNumber)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold">Timezone Examples</h3>
            </div>
            <div className="space-y-2 text-sm">
              {['America/New_York', 'Europe/London', 'Asia/Tokyo'].map((tz) => (
                <div key={tz}>
                  <span className="text-slate-400 text-xs">{tz}: </span>
                  <span className="font-medium text-xs">{convertToTimezone(sampleDate, tz)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export singleton
export const localeManager = new LocaleManager();
