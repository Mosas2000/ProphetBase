'use client';

import {
  AlertCircle,
  CheckCircle,
  Download,
  Edit3,
  Save,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Translation entry
export interface TranslationEntry {
  key: string;
  translations: Record<string, string>;
  status: 'complete' | 'partial' | 'missing';
  lastModified: Date;
  contributors: string[];
}

// Translation memory
export interface TranslationMemory {
  source: string;
  target: string;
  language: string;
  frequency: number;
  lastUsed: Date;
}

// Translation editor manager
export class TranslationEditorManager {
  private translations: Map<string, TranslationEntry> = new Map();
  private memory: TranslationMemory[] = [];
  private missingKeys: Set<string> = new Set();
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  // Translation management
  addTranslation(
    key: string,
    language: string,
    translation: string,
    contributor?: string
  ): void {
    const entry = this.translations.get(key) || {
      key,
      translations: {},
      status: 'missing',
      lastModified: new Date(),
      contributors: [],
    };

    entry.translations[language] = translation;
    entry.lastModified = new Date();

    if (contributor && !entry.contributors.includes(contributor)) {
      entry.contributors.push(contributor);
    }

    entry.status = this.calculateStatus(entry);
    this.translations.set(key, entry);

    // Update translation memory
    this.addToMemory(translation, language);

    this.saveToStorage();
    this.notifyListeners();
  }

  getTranslation(key: string, language: string): string | undefined {
    return this.translations.get(key)?.translations[language];
  }

  getAllTranslations(): TranslationEntry[] {
    return Array.from(this.translations.values());
  }

  deleteTranslation(key: string, language?: string): void {
    if (language) {
      const entry = this.translations.get(key);
      if (entry) {
        delete entry.translations[language];
        entry.status = this.calculateStatus(entry);
        this.translations.set(key, entry);
      }
    } else {
      this.translations.delete(key);
    }
    this.saveToStorage();
    this.notifyListeners();
  }

  // Missing translations
  markAsMissing(key: string): void {
    this.missingKeys.add(key);
    this.notifyListeners();
  }

  getMissingKeys(): string[] {
    return Array.from(this.missingKeys);
  }

  // Translation memory
  private addToMemory(translation: string, language: string): void {
    const existing = this.memory.find(
      (m) => m.target === translation && m.language === language
    );

    if (existing) {
      existing.frequency++;
      existing.lastUsed = new Date();
    } else {
      this.memory.push({
        source: translation,
        target: translation,
        language,
        frequency: 1,
        lastUsed: new Date(),
      });
    }

    // Keep only top 100 most frequent
    this.memory.sort((a, b) => b.frequency - a.frequency);
    this.memory = this.memory.slice(0, 100);
  }

  searchMemory(query: string, language: string): TranslationMemory[] {
    return this.memory
      .filter(
        (m) =>
          m.language === language &&
          m.target.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  // Status calculation
  private calculateStatus(
    entry: TranslationEntry
  ): 'complete' | 'partial' | 'missing' {
    const languageCount = Object.keys(entry.translations).length;
    if (languageCount === 0) return 'missing';
    if (languageCount < 5) return 'partial'; // Assuming 5 target languages
    return 'complete';
  }

  // Statistics
  getStatistics(): {
    total: number;
    complete: number;
    partial: number;
    missing: number;
    completionRate: number;
  } {
    const entries = Array.from(this.translations.values());
    const complete = entries.filter((e) => e.status === 'complete').length;
    const partial = entries.filter((e) => e.status === 'partial').length;
    const missing = entries.filter((e) => e.status === 'missing').length;

    return {
      total: entries.length,
      complete,
      partial,
      missing,
      completionRate: entries.length > 0 ? complete / entries.length : 0,
    };
  }

  // Export/Import
  exportTranslations(): string {
    const data = {
      translations: Array.from(this.translations.entries()),
      memory: this.memory,
      missingKeys: Array.from(this.missingKeys),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importTranslations(json: string): void {
    try {
      const data = JSON.parse(json);
      this.translations = new Map(data.translations);
      this.memory = data.memory || [];
      this.missingKeys = new Set(data.missingKeys || []);
      this.saveToStorage();
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to import translations:', error);
    }
  }

  // Storage
  private saveToStorage(): void {
    localStorage.setItem(
      'translationEditorData',
      JSON.stringify({
        translations: Array.from(this.translations.entries()),
        memory: this.memory,
        missingKeys: Array.from(this.missingKeys),
      })
    );
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('translationEditorData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.translations = new Map(data.translations || []);
        this.memory = data.memory || [];
        this.missingKeys = new Set(data.missingKeys || []);
      } catch (error) {
        console.error('Failed to load translation data:', error);
      }
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Translation editor hook
export function useTranslationEditor() {
  const [manager] = useState(() => new TranslationEditorManager());
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setUpdateTrigger((prev) => prev + 1);
    });
    return unsubscribe;
  }, [manager]);

  return {
    addTranslation: (
      key: string,
      language: string,
      translation: string,
      contributor?: string
    ) => manager.addTranslation(key, language, translation, contributor),
    getTranslation: (key: string, language: string) =>
      manager.getTranslation(key, language),
    getAllTranslations: () => manager.getAllTranslations(),
    deleteTranslation: (key: string, language?: string) =>
      manager.deleteTranslation(key, language),
    markAsMissing: (key: string) => manager.markAsMissing(key),
    getMissingKeys: () => manager.getMissingKeys(),
    searchMemory: (query: string, language: string) =>
      manager.searchMemory(query, language),
    getStatistics: () => manager.getStatistics(),
    exportTranslations: () => manager.exportTranslations(),
    importTranslations: (json: string) => manager.importTranslations(json),
  };
}

// Translation editor dashboard
export function TranslationEditorDashboard() {
  const {
    addTranslation,
    getAllTranslations,
    getStatistics,
    getMissingKeys,
    exportTranslations,
    importTranslations,
  } = useTranslationEditor();

  const [editMode, setEditMode] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [currentTranslation, setCurrentTranslation] = useState('');
  const stats = getStatistics();
  const missingKeys = getMissingKeys();

  const handleSave = () => {
    if (currentKey && currentTranslation) {
      addTranslation(currentKey, currentLang, currentTranslation, 'User');
      setCurrentKey('');
      setCurrentTranslation('');
      setEditMode(false);
    }
  };

  const handleExport = () => {
    const data = exportTranslations();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importTranslations(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="p-6 bg-slate-800 rounded-xl"
      role="region"
      aria-label="Translation Editor"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Edit3 className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Translation Editor</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">Complete</h3>
          </div>
          <div className="text-3xl font-bold">{stats.complete}</div>
          <div className="text-sm text-slate-400">All languages translated</div>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold">Partial</h3>
          </div>
          <div className="text-3xl font-bold">{stats.partial}</div>
          <div className="text-sm text-slate-400">Some languages missing</div>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold">Missing</h3>
          </div>
          <div className="text-3xl font-bold">{stats.missing}</div>
          <div className="text-sm text-slate-400">No translations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Add Translation</h3>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2">Translation Key</label>
                <input
                  type="text"
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 rounded"
                  placeholder="e.g., nav.home"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Language</label>
                <select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 rounded"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Translation</label>
                <input
                  type="text"
                  value={currentTranslation}
                  onChange={(e) => setCurrentTranslation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 rounded"
                  placeholder="Translated text"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-8 border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-lg"
            >
              <Edit3 className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <div className="text-slate-400">Click to add translation</div>
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="font-bold mb-4">Recent Translations</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getAllTranslations()
              .slice(0, 10)
              .map((entry) => (
                <div key={entry.key} className="p-2 bg-slate-600 rounded">
                  <div className="font-medium text-sm">{entry.key}</div>
                  <div className="text-xs text-slate-400">
                    {Object.keys(entry.translations).length} language(s)
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {missingKeys.length > 0 && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <h3 className="font-bold mb-3 text-red-400">
            Missing Translation Keys
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {missingKeys.slice(0, 12).map((key) => (
              <div key={key} className="text-sm text-red-300 font-mono">
                {key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export singleton
export const translationEditor = new TranslationEditorManager();
