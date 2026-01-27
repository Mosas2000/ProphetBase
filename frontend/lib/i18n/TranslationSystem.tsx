'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

// Supported languages
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    flag: '🇩🇪',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    flag: '🇮🇹',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    flag: '🇵🇹',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    flag: '🇯🇵',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    flag: '🇨🇳',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    flag: '🇮🇱',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    flag: '🇷🇺',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    flag: '🇰🇷',
  },
];

// Translation resources
const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.markets': 'Markets',
      'nav.profile': 'Profile',
      'nav.admin': 'Admin',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'market.buy': 'Buy Shares',
      'market.sell': 'Sell Shares',
      'market.volume': 'Volume',
      'market.price': 'Price',
    },
  },
  es: {
    translation: {
      'nav.home': 'Inicio',
      'nav.markets': 'Mercados',
      'nav.profile': 'Perfil',
      'nav.admin': 'Admin',
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.cancel': 'Cancelar',
      'common.save': 'Guardar',
      'common.delete': 'Eliminar',
      'market.buy': 'Comprar Acciones',
      'market.sell': 'Vender Acciones',
      'market.volume': 'Volumen',
      'market.price': 'Precio',
    },
  },
  fr: {
    translation: {
      'nav.home': 'Accueil',
      'nav.markets': 'Marchés',
      'nav.profile': 'Profil',
      'nav.admin': 'Admin',
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.save': 'Enregistrer',
      'common.delete': 'Supprimer',
      'market.buy': 'Acheter des Actions',
      'market.sell': 'Vendre des Actions',
      'market.volume': 'Volume',
      'market.price': 'Prix',
    },
  },
  ar: {
    translation: {
      'nav.home': 'الرئيسية',
      'nav.markets': 'الأسواق',
      'nav.profile': 'الملف الشخصي',
      'nav.admin': 'المسؤول',
      'common.loading': 'جار التحميل...',
      'common.error': 'خطأ',
      'common.success': 'نجح',
      'common.cancel': 'إلغاء',
      'common.save': 'حفظ',
      'common.delete': 'حذف',
      'market.buy': 'شراء الأسهم',
      'market.sell': 'بيع الأسهم',
      'market.volume': 'الحجم',
      'market.price': 'السعر',
    },
  },
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
}

// Translation manager
export class TranslationManager {
  private currentLanguage: string = 'en';
  private listeners: Array<(language: string) => void> = [];

  constructor() {
    this.currentLanguage = i18n.language || 'en';
  }

  async changeLanguage(languageCode: string): Promise<void> {
    try {
      await i18n.changeLanguage(languageCode);
      this.currentLanguage = languageCode;
      this.updateDirection(languageCode);
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }

  private updateDirection(languageCode: string): void {
    const language = SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === languageCode
    );
    if (language) {
      document.documentElement.dir = language.direction;
      document.documentElement.lang = languageCode;
    }
  }

  getCurrentLanguage(): Language | undefined {
    return SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === this.currentLanguage
    );
  }

  getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES;
  }

  subscribe(listener: (language: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentLanguage));
  }
}

// RTL detection hook
export function useRTL() {
  const { i18n } = useTranslation();
  const currentLang = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === i18n.language
  );
  return currentLang?.direction === 'rtl';
}

// Language switcher component
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ||
      SUPPORTED_LANGUAGES[0]
  );

  const handleLanguageChange = async (language: Language) => {
    await i18n.changeLanguage(language.code);
    setCurrentLang(language);
    setIsOpen(false);

    // Update HTML direction
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5" />
        <span className="text-2xl">{currentLang.flag}</span>
        <span>{currentLang.nativeName}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-slate-700 rounded-lg shadow-xl z-50 min-w-[250px] max-h-[400px] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-600 transition-colors ${
                currentLang.code === language.code ? 'bg-slate-600' : ''
              }`}
            >
              <span className="text-2xl">{language.flag}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-sm text-slate-400">{language.name}</div>
              </div>
              {currentLang.code === language.code && (
                <Check className="w-5 h-5 text-green-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Translation system dashboard
export function TranslationSystemDashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = useRTL();
  const [stats, setStats] = useState({
    currentLanguage: '',
    availableLanguages: 0,
    loadedNamespaces: 0,
    direction: 'ltr',
  });

  useEffect(() => {
    const currentLang = SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === i18n.language
    );
    setStats({
      currentLanguage: currentLang?.nativeName || 'Unknown',
      availableLanguages: SUPPORTED_LANGUAGES.length,
      loadedNamespaces: i18n.options.ns?.length || 1,
      direction: currentLang?.direction || 'ltr',
    });
  }, [i18n.language]);

  return (
    <div
      className="p-6 bg-slate-800 rounded-xl"
      role="region"
      aria-label="Translation System"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Translation System</h2>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Language Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Language:</span>
              <span className="font-medium">{stats.currentLanguage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Available Languages:</span>
              <span className="font-medium">{stats.availableLanguages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Text Direction:</span>
              <span className="font-medium uppercase">{stats.direction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RTL Active:</span>
              <span className={isRTL ? 'text-green-400' : 'text-slate-400'}>
                {isRTL ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Translation Preview</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-400">Navigation: </span>
              <span>
                {t('nav.home')} • {t('nav.markets')} • {t('nav.profile')}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Common: </span>
              <span>
                {t('common.save')} • {t('common.cancel')} • {t('common.delete')}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Market: </span>
              <span>
                {t('market.buy')} • {t('market.sell')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700 rounded-lg">
        <h3 className="font-bold mb-3">Supported Languages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className={`p-3 rounded-lg flex items-center gap-2 ${
                i18n.language === lang.code ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-sm">
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-slate-400">
                  {lang.direction.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export singleton and utilities
export const translationManager = new TranslationManager();
export { i18n, useTranslation };
