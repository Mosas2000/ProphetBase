'use client';

import { useEffect, useState } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function KeyboardShortcuts({ shortcuts, enabled = true }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts, enabled]);

  return null;
}

// Keyboard Shortcuts Overlay
interface ShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function ShortcutsOverlay({ isOpen, onClose, shortcuts }: ShortcutsOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    keys.push(shortcut.key.toUpperCase());
    return keys;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-700 max-h-[80vh] overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {formatShortcut(shortcut).map((key, keyIdx) => (
                      <kbd
                        key={keyIdx}
                        className="px-3 py-1.5 text-sm font-semibold bg-gray-700 border border-gray-600 rounded shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-sm text-gray-400">
                Press <kbd className="px-2 py-1 bg-gray-700 border border-gray-600 rounded">?</kbd> to toggle this overlay
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Default ProphetBase Shortcuts
export function useDefaultShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      action: () => setShowShortcuts(!showShortcuts),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'h',
      action: () => window.location.href = '/',
      description: 'Go to home',
    },
    {
      key: 'm',
      action: () => window.location.href = '/markets',
      description: 'Browse markets',
    },
    {
      key: 'p',
      action: () => window.location.href = '/portfolio',
      description: 'View portfolio',
    },
    {
      key: 'n',
      action: () => window.location.href = '/create',
      description: 'Create new market',
    },
    {
      key: 's',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search',
    },
    {
      key: 'k',
      ctrl: true,
      action: () => {
        // Open command palette
        console.log('Command palette');
      },
      description: 'Command palette',
    },
    {
      key: 'Escape',
      action: () => {
        // Close modals
        const closeButtons = document.querySelectorAll('[data-close-modal]');
        closeButtons.forEach(btn => (btn as HTMLElement).click());
      },
      description: 'Close modal',
    },
  ];

  return {
    shortcuts,
    showShortcuts,
    setShowShortcuts,
  };
}

// Customizable Shortcuts Manager
interface CustomShortcut {
  id: string;
  description: string;
  defaultKey: string;
  customKey?: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function ShortcutsManager() {
  const [customShortcuts, setCustomShortcuts] = useState<CustomShortcut[]>([
    { id: 'home', description: 'Go to home', defaultKey: 'h' },
    { id: 'markets', description: 'Browse markets', defaultKey: 'm' },
    { id: 'portfolio', description: 'View portfolio', defaultKey: 'p' },
    { id: 'create', description: 'Create market', defaultKey: 'n' },
    { id: 'search', description: 'Focus search', defaultKey: 's' },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveShortcut = (id: string, newKey: string) => {
    setCustomShortcuts(shortcuts =>
      shortcuts.map(s => (s.id === id ? { ...s, customKey: newKey } : s))
    );
    setEditingId(null);
    localStorage.setItem('keyboard_shortcuts', JSON.stringify(customShortcuts));
  };

  const handleReset = (id: string) => {
    setCustomShortcuts(shortcuts =>
      shortcuts.map(s => (s.id === id ? { ...s, customKey: undefined } : s))
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Customize Keyboard Shortcuts</h3>
      
      <div className="space-y-3">
        {customShortcuts.map(shortcut => (
          <div key={shortcut.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <span className="text-gray-300">{shortcut.description}</span>
            
            <div className="flex items-center gap-3">
              {editingId === shortcut.id ? (
                <input
                  type="text"
                  maxLength={1}
                  className="w-16 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-center font-semibold"
                  placeholder="Key"
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape') {
                      handleSaveShortcut(shortcut.id, e.key);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <kbd className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded font-semibold">
                    {shortcut.customKey || shortcut.defaultKey}
                  </kbd>
                  <button
                    onClick={() => setEditingId(shortcut.id)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  {shortcut.customKey && (
                    <button
                      onClick={() => handleReset(shortcut.id)}
                      className="text-gray-400 hover:text-gray-300 text-sm"
                    >
                      Reset
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          💡 Click "Edit" to customize any shortcut. Press the key you want to assign.
        </p>
      </div>
    </div>
  );
}
