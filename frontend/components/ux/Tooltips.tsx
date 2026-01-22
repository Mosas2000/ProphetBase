'use client';

import { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({ x: rect.left + rect.width / 2, y: rect.top });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionStyles = () => {
    const baseStyles = 'fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 max-w-xs';
    
    switch (position) {
      case 'top':
        return `${baseStyles} -translate-x-1/2 -translate-y-full mb-2`;
      case 'bottom':
        return `${baseStyles} -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseStyles} -translate-x-full -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseStyles} translate-x-2 -translate-y-1/2`;
      default:
        return baseStyles;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={getPositionStyles()}
          style={{
            left: position === 'left' || position === 'right' ? undefined : `${coords.x}px`,
            top: position === 'top' ? `${coords.y}px` : position === 'bottom' ? `${coords.y}px` : `${coords.y}px`,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
              position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r' :
              position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l' :
              position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r' :
              'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </>
  );
}

// Keyboard Shortcuts Guide Component
interface ShortcutItem {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'General' },
  { keys: ['/', 's'], description: 'Focus search', category: 'Navigation' },
  { keys: ['n'], description: 'Create new market', category: 'Actions' },
  { keys: ['p'], description: 'View portfolio', category: 'Navigation' },
  { keys: ['m'], description: 'Browse markets', category: 'Navigation' },
  { keys: ['Esc'], description: 'Close modal/dialog', category: 'General' },
  { keys: ['←', '→'], description: 'Navigate tutorial steps', category: 'Tutorial' },
  { keys: ['Ctrl', 'K'], description: 'Quick command palette', category: 'General' },
  { keys: ['t'], description: 'Start tutorial', category: 'Help' },
  { keys: ['h'], description: 'Go to home', category: 'Navigation' },
];

interface KeyboardShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsGuide({ isOpen, onClose }: KeyboardShortcutsGuideProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">{category}</h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(s => s.category === category)
                      .map((shortcut, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-300">{shortcut.description}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, keyIdx) => (
                              <kbd
                                key={keyIdx}
                                className="px-2 py-1 text-xs font-semibold bg-gray-700 border border-gray-600 rounded"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
              Press <kbd className="px-2 py-1 bg-gray-700 border border-gray-600 rounded">?</kbd> anytime to view this guide
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Help Text Component
interface HelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelpText({ children, className = '' }: HelpTextProps) {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      💡 {children}
    </p>
  );
}
