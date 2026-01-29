/**
 * Internationalization Utility (i18n)
 * 
 * Manages translations and locale-specific formatting.
 */

type Locale = 'en' | 'es' | 'fr' | 'zh';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.markets': 'Markets',
    'btn.connect': 'Connect Wallet',
    'market.yes': 'Yes',
    'market.no': 'No',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.markets': 'Mercados',
    'btn.connect': 'Conectar Cartera',
    'market.yes': 'Sí',
    'market.no': 'No',
  },
  // ... other locales
  fr: {},
  zh: {}
};

export function createTranslator(locale: Locale = 'en') {
  return function t(key: string) {
    return TRANSLATIONS[locale][key] || TRANSLATIONS['en'][key] || key;
  };
}

export function formatCurrency(amount: number, locale: string = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
