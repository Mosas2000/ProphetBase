import { useCallback, useEffect, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category?: string;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  preventDefault?: boolean;
}

/**
 * Custom hook for managing keyboard shortcuts with conflict detection
 * 
 * @example
 * ```tsx
 * const shortcuts = [
 *   { key: 'k', ctrl: true, description: 'Open command palette', action: openPalette },
 *   { key: 's', ctrl: true, description: 'Save workspace', action: saveWorkspace }
 * ];
 * useKeyboardShortcuts({ shortcuts });
 * ```
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  preventDefault = true,
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const matchingShortcut = shortcutsRef.current.find((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : true;

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
      });

      if (matchingShortcut) {
        if (preventDefault) {
          event.preventDefault();
        }
        matchingShortcut.action();
      }
    },
    [enabled, preventDefault]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current,
  };
}

/**
 * Format a keyboard shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('⌘');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}

/**
 * Detect keyboard shortcut conflicts
 */
export function detectConflicts(shortcuts: KeyboardShortcut[]): string[] {
  const conflicts: string[] = [];
  const seen = new Map<string, KeyboardShortcut>();

  shortcuts.forEach((shortcut) => {
    const key = `${shortcut.ctrl}-${shortcut.shift}-${shortcut.alt}-${shortcut.meta}-${shortcut.key}`;
    
    if (seen.has(key)) {
      const existing = seen.get(key)!;
      conflicts.push(
        `Conflict: "${existing.description}" and "${shortcut.description}" both use ${formatShortcut(shortcut)}`
      );
    } else {
      seen.set(key, shortcut);
    }
  });

  return conflicts;
}

/**
 * Default keyboard shortcuts for the application
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'k',
    ctrl: true,
    description: 'Open command palette',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: '/',
    description: 'Focus search',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'n',
    ctrl: true,
    description: 'Create new market',
    action: () => {},
    category: 'Actions',
  },
  {
    key: 's',
    ctrl: true,
    description: 'Save workspace',
    action: () => {},
    category: 'Workspace',
  },
  {
    key: 'l',
    ctrl: true,
    description: 'Load workspace',
    action: () => {},
    category: 'Workspace',
  },
  {
    key: '?',
    shift: true,
    description: 'Show keyboard shortcuts',
    action: () => {},
    category: 'Help',
  },
  {
    key: 't',
    ctrl: true,
    description: 'Toggle theme',
    action: () => {},
    category: 'Appearance',
  },
  {
    key: 'b',
    ctrl: true,
    description: 'Toggle sidebar',
    action: () => {},
    category: 'View',
  },
  {
    key: 'Escape',
    description: 'Close modal/dialog',
    action: () => {},
    category: 'Navigation',
  },
];
