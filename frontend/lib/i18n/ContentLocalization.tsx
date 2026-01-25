'use client';

import { useEffect, useState } from 'react';
import { Globe2, MapPin, Scale, Heart } from 'lucide-react';

// Regional content configuration
export interface RegionalContent {
  region: string;
  country: string;
  language: string;
  currency: string;
  content: Record<string, any>;
  regulations: string[];
  culturalNotes: string[];
}

// Region definitions
export const REGIONS: Record<string, RegionalContent> = {
  'us': {
    region: 'North America',
    country: 'United States',
    language: 'en-US',
    currency: 'USD',
    content: {
      marketTitle: 'Prediction Markets',
      welcomeMessage: 'Welcome to ProphetBase',
      legalNotice: 'Must be 18+ to participate',
    },
    regulations: [
      'CFTC regulations apply',
      'State-specific restrictions may apply',
      'Tax reporting required for winnings over $600',
    ],
    culturalNotes: [
      'Direct communication style preferred',
      'Success and competition valued',
    ],
  },
  'uk': {
    region: 'Europe',
    country: 'United Kingdom',
    language: 'en-GB',
    currency: 'GBP',
    content: {
      marketTitle: 'Prediction Markets',
      welcomeMessage: 'Welcome to ProphetBase',
      legalNotice: 'Must be 18+ to participate',
    },
    regulations: [
      'FCA regulations apply',
      'Gambling Commission oversight',
      'GDPR compliance required',
    ],
    culturalNotes: [
      'Understated communication style',
      'Queuing and fairness important',
    ],
  },
  'de': {
    region: 'Europe',
    country: 'Germany',
    language: 'de-DE',
    currency: 'EUR',
    content: {
      marketTitle: 'Prognosemärkte',
      welcomeMessage: 'Willkommen bei ProphetBase',
      legalNotice: 'Mindestalter 18 Jahre',
    },
    regulations: [
      'BaFin regulations apply',
      'State gambling treaties (GlüStV)',
      'GDPR compliance required',
    ],
    culturalNotes: [
      'Formal communication preferred',
      'Precision and punctuality valued',
      'Privacy concerns important',
    ],
  },
  'jp': {
    region: 'Asia Pacific',
    country: 'Japan',
    language: 'ja-JP',
    currency: 'JPY',
    content: {
      marketTitle: '予測市場',
      welcomeMessage: 'ProphetBaseへようこそ',
      legalNotice: '18歳以上のみ参加可能',
    },
    regulations: [
      'Financial Services Agency oversight',
      'Gambling restricted under Criminal Code',
      'Special licensing required',
    ],
    culturalNotes: [
      'Indirect communication style',
      'Group harmony (wa) important',
      'Respect for hierarchy',
      'Gift-giving customs',
    ],
  },
  'ae': {
    region: 'Middle East',
    country: 'United Arab Emirates',
    language: 'ar-AE',
    currency: 'AED',
    content: {
      marketTitle: 'أسواق التنبؤ',
      welcomeMessage: 'مرحبا بكم في ProphetBase',
      legalNotice: 'يجب أن يكون عمرك 21 عامًا أو أكثر',
    },
    regulations: [
      'Central Bank regulations',
      'Sharia compliance considerations',
      'Strict gambling prohibitions',
    ],
    culturalNotes: [
      'High-context communication',
      'Relationship-building important',
      'Religious considerations (halal/haram)',
      'Family and community values',
    ],
  },
};

// Content localization manager
export class ContentLocalizationManager {
  private currentRegion: string = 'us';
  private listeners: Array<(region: string) => void> = [];

  constructor() {
    this.detectRegion();
  }

  // Region detection
  private detectRegion(): void {
    if (typeof navigator === 'undefined') return;

    // Try to detect from browser language
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.startsWith('en-gb') || browserLang.includes('uk')) {
      this.currentRegion = 'uk';
    } else if (browserLang.startsWith('de')) {
      this.currentRegion = 'de';
    } else if (browserLang.startsWith('ja')) {
      this.currentRegion = 'jp';
    } else if (browserLang.startsWith('ar')) {
      this.currentRegion = 'ae';
    } else {
      this.currentRegion = 'us';
    }

    // Load saved preference
    const saved = localStorage.getItem('selectedRegion');
    if (saved && REGIONS[saved]) {
      this.currentRegion = saved;
    }
  }

  // Region management
  setRegion(regionKey: string): void {
    if (REGIONS[regionKey]) {
      this.currentRegion = regionKey;
      localStorage.setItem('selectedRegion', regionKey);
      this.applyRegionalSettings();
      this.notifyListeners();
    }
  }

  getCurrentRegion(): RegionalContent {
    return REGIONS[this.currentRegion] || REGIONS['us'];
  }

  getRegionKey(): string {
    return this.currentRegion;
  }

  getAllRegions(): Array<{ key: string; config: RegionalContent }> {
    return Object.entries(REGIONS).map(([key, config]) => ({ key, config }));
  }

  // Content retrieval
  getLocalizedContent(key: string): any {
    const region = this.getCurrentRegion();
    return region.content[key];
  }

  getRegulations(): string[] {
    return this.getCurrentRegion().regulations;
  }

  getCulturalNotes(): string[] {
    return this.getCurrentRegion().culturalNotes;
  }

  // Apply regional settings
  private applyRegionalSettings(): void {
    const region = this.getCurrentRegion();
    
    // Update document language
    if (typeof document !== 'undefined') {
      document.documentElement.lang = region.language;
      
      // Set direction based on language
      if (region.language.startsWith('ar')) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }

  // Market restrictions
  isMarketAllowed(marketType: string): boolean {
    const region = this.getCurrentRegion();
    
    // Example restrictions
    if (region.country === 'United Arab Emirates') {
      // No gambling-related markets
      return !['sports', 'casino', 'lottery'].includes(marketType.toLowerCase());
    }
    
    return true;
  }

  getAgeRestriction(): number {
    const region = this.getCurrentRegion();
    
    // Age restrictions by region
    switch (region.country) {
      case 'United Arab Emirates':
        return 21;
      case 'United States':
      case 'United Kingdom':
      case 'Germany':
      case 'Japan':
      default:
        return 18;
    }
  }

  // Subscription
  subscribe(listener: (region: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentRegion));
  }
}

// Content localization hook
export function useContentLocalization() {
  const [region, setRegionState] = useState<RegionalContent>(REGIONS['us']);
  const [manager] = useState(() => new ContentLocalizationManager());

  useEffect(() => {
    setRegionState(manager.getCurrentRegion());
    const unsubscribe = manager.subscribe(() => {
      setRegionState(manager.getCurrentRegion());
    });
    return unsubscribe;
  }, [manager]);

  return {
    region,
    setRegion: (key: string) => manager.setRegion(key),
    getAllRegions: () => manager.getAllRegions(),
    getLocalizedContent: (key: string) => manager.getLocalizedContent(key),
    getRegulations: () => manager.getRegulations(),
    getCulturalNotes: () => manager.getCulturalNotes(),
    isMarketAllowed: (marketType: string) => manager.isMarketAllowed(marketType),
    getAgeRestriction: () => manager.getAgeRestriction(),
  };
}

// Content localization dashboard
export function ContentLocalizationDashboard() {
  const {
    region,
    setRegion,
    getAllRegions,
    getLocalizedContent,
    getRegulations,
    getCulturalNotes,
    getAgeRestriction,
  } = useContentLocalization();

  const regions = getAllRegions();

  return (
    <div className="p-6 bg-slate-800 rounded-xl" role="region" aria-label="Content Localization">
      <div className="flex items-center gap-3 mb-6">
        <Globe2 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold">Content Localization</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Select Region</h3>
            <div className="space-y-2">
              {regions.map(({ key, config }) => (
                <button
                  key={key}
                  onClick={() => setRegion(key)}
                  className={`w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                    region.country === config.country
                      ? 'bg-blue-600'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-medium">{config.country}</div>
                    <div className="text-sm text-slate-300">{config.region}</div>
                  </div>
                  <div className="text-sm text-slate-400">{config.currency}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-400" />
              <h3 className="font-bold">Current Region</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Country:</span>
                <span className="font-medium">{region.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Language:</span>
                <span className="font-mono">{region.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Currency:</span>
                <span className="font-mono">{region.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Age Restriction:</span>
                <span className="font-medium">{getAgeRestriction()}+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Localized Content</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-400">Title:</div>
                <div className="font-medium">{getLocalizedContent('marketTitle')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Welcome:</div>
                <div className="font-medium">{getLocalizedContent('welcomeMessage')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Legal:</div>
                <div className="font-medium">{getLocalizedContent('legalNotice')}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold">Regulations</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {getRegulations().map((reg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-slate-300">{reg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="font-bold">Cultural Considerations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getCulturalNotes().map((note, idx) => (
            <div key={idx} className="p-3 bg-slate-600 rounded-lg text-sm">
              {note}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
        <h3 className="font-bold mb-2 text-amber-400">Important Notice</h3>
        <p className="text-sm text-slate-300">
          Regional settings affect content display, legal compliance, and available features.
          Always ensure compliance with local regulations and cultural norms.
        </p>
      </div>
    </div>
  );
}

// Export singleton
export const contentLocalization = new ContentLocalizationManager();
