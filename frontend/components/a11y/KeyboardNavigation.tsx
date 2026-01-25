'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Keyboard, Command, ArrowUp } from 'lucide-react';

// Keyboard shortcut configuration
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

// Keyboard shortcut manager
export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled: boolean = true;

  register(id: string, shortcut: KeyboardShortcut): void {
    this.shortcuts.set(id, shortcut);
  }

  unregister(id: string): void {
    this.shortcuts.delete(id);
  }

  handle(event: KeyboardEvent): boolean {
    if (!this.enabled) return false;

    for (const [id, shortcut] of this.shortcuts.entries()) {
      if (this.matches(event, shortcut)) {
        event.preventDefault();
        shortcut.action();
        return true;
      }
    }

    return false;
  }

  private matches(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrl &&
      !!event.shiftKey === !!shortcut.shift &&
      !!event.altKey === !!shortcut.alt &&
      !!event.metaKey === !!shortcut.meta
    );
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  getShortcuts(): Array<{ id: string; shortcut: KeyboardShortcut }> {
    return Array.from(this.shortcuts.entries()).map(([id, shortcut]) => ({
      id,
      shortcut,
    }));
  }
}

// Focus trap hook
export function useFocusTrap(active: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab as any);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTab as any);
    };
  }, [active]);

  return containerRef;
}

// Arrow navigation hook
export function useArrowNavigation(itemCount: number, options?: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  disabled?: boolean;
}) {
  const { orientation = 'vertical', loop = true, disabled = false } = options || {};
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      let newIndex = focusedIndex;

      switch (event.key) {
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault();
            newIndex = focusedIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault();
            newIndex = focusedIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault();
            newIndex = focusedIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault();
            newIndex = focusedIndex + 1;
          }
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      if (loop) {
        newIndex = (newIndex + itemCount) % itemCount;
      } else {
        newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
      }

      setFocusedIndex(newIndex);
    },
    [focusedIndex, itemCount, orientation, loop, disabled]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  };
}

// Escape key handler
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, enabled]);
}

// Tab order manager
export class TabOrderManager {
  private elements: HTMLElement[] = [];

  register(element: HTMLElement, order?: number): void {
    if (order !== undefined) {
      element.setAttribute('tabindex', order.toString());
    }
    this.elements.push(element);
    this.updateOrder();
  }

  unregister(element: HTMLElement): void {
    this.elements = this.elements.filter((el) => el !== element);
    this.updateOrder();
  }

  private updateOrder(): void {
    this.elements.sort((a, b) => {
      const aIndex = parseInt(a.getAttribute('tabindex') || '0');
      const bIndex = parseInt(b.getAttribute('tabindex') || '0');
      return aIndex - bIndex;
    });
  }

  getOrder(): HTMLElement[] {
    return [...this.elements];
  }

  focusFirst(): void {
    this.elements[0]?.focus();
  }

  focusLast(): void {
    this.elements[this.elements.length - 1]?.focus();
  }
}

// Keyboard shortcut hook
export function useKeyboardShortcut(
  shortcuts: Record<string, KeyboardShortcut>
) {
  const managerRef = useRef(new KeyboardShortcutManager());

  useEffect(() => {
    const manager = managerRef.current;

    // Register all shortcuts
    Object.entries(shortcuts).forEach(([id, shortcut]) => {
      manager.register(id, shortcut);
    });

    // Set up global listener
    const handleKeyDown = (event: KeyboardEvent) => {
      manager.handle(event);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      Object.keys(shortcuts).forEach((id) => {
        manager.unregister(id);
      });
    };
  }, [shortcuts]);

  return managerRef.current;
}

// Keyboard navigation dashboard
export function KeyboardNavigationDashboard() {
  const [activeShortcuts, setActiveShortcuts] = useState<string[]>([]);
  const { focusedIndex, handleKeyDown } = useArrowNavigation(5);

  const shortcuts: KeyboardShortcut[] = [
    { key: 'k', ctrl: true, action: () => {}, description: 'Open search', category: 'Navigation' },
    { key: '/', action: () => {}, description: 'Focus search', category: 'Navigation' },
    { key: 'n', ctrl: true, action: () => {}, description: 'New item', category: 'Actions' },
    { key: 's', ctrl: true, action: () => {}, description: 'Save', category: 'Actions' },
    { key: 'Escape', action: () => {}, description: 'Close modal', category: 'General' },
  ];

  useKeyboardShortcut({
    search: {
      key: 'k',
      ctrl: true,
      action: () => setActiveShortcuts((prev) => [...prev, 'Search opened']),
      description: 'Open search',
    },
    escape: {
      key: 'Escape',
      action: () => setActiveShortcuts([]),
      description: 'Clear notifications',
    },
  });

  return (
    <div className="p-6 bg-slate-800 rounded-xl" role="region" aria-label="Keyboard Navigation">
      <div className="flex items-center gap-3 mb-6">
        <Keyboard className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Keyboard Navigation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Command className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold">Keyboard Shortcuts</h3>
          </div>
          <div className="space-y-2 text-sm">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-slate-600 rounded text-xs font-mono">
                  {shortcut.ctrl && 'Ctrl + '}
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">Arrow Navigation</h3>
          </div>
          <div 
            className="space-y-2"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  idx === focusedIndex ? 'bg-blue-600' : 'bg-slate-600'
                }`}
                tabIndex={idx === focusedIndex ? 0 : -1}
              >
                Item {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeShortcuts.length > 0 && (
        <div className="p-4 bg-slate-700 rounded-lg" role="status" aria-live="polite">
          <h3 className="font-bold mb-2">Recent Activity:</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {activeShortcuts.slice(-5).map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Export singleton
export const shortcutManager = new KeyboardShortcutManager();
export const tabOrderManager = new TabOrderManager();
