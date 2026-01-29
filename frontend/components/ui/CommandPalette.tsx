'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Command {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  category: string;
  keywords?: string[];
  icon?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const router = useRouter();

  // Load recent commands from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('prophetbase-recent-commands');
    if (stored) {
      try {
        setRecentCommands(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent commands:', e);
      }
    }
  }, []);

  // Fuzzy search implementation
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Show recent commands when no query
      const recent = commands.filter((cmd) => recentCommands.includes(cmd.id));
      return recent.length > 0 ? recent : commands.slice(0, 10);
    }

    const searchTerms = query.toLowerCase().split(' ');
    
    return commands
      .map((cmd) => {
        const searchableText = [
          cmd.label,
          cmd.description || '',
          cmd.category,
          ...(cmd.keywords || []),
        ].join(' ').toLowerCase();

        let score = 0;
        searchTerms.forEach((term) => {
          if (searchableText.includes(term)) {
            score += 1;
            // Boost score if match is in label
            if (cmd.label.toLowerCase().includes(term)) {
              score += 2;
            }
          }
        });

        return { cmd, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd);
  }, [query, commands, recentCommands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Execute command
  const executeCommand = useCallback((command: Command) => {
    command.action();
    
    // Add to recent commands
    const updated = [command.id, ...recentCommands.filter((id) => id !== command.id)].slice(0, 10);
    setRecentCommands(updated);
    localStorage.setItem('prophetbase-recent-commands', JSON.stringify(updated));
    
    onClose();
    setQuery('');
    setSelectedIndex(0);
  }, [recentCommands, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, executeCommand, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No commands found
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {category}
                  </div>
                  {categoryCommands.map((cmd, index) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        {cmd.icon && <span className="text-xl">{cmd.icon}</span>}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {cmd.label}
                          </div>
                          {cmd.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                        {recentCommands.includes(cmd.id) && (
                          <span className="text-xs text-gray-400">Recent</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default commands for ProphetBase
export const DEFAULT_COMMANDS: Command[] = [
  {
    id: 'create-market',
    label: 'Create New Market',
    description: 'Create a new prediction market',
    action: () => {},
    category: 'Actions',
    icon: '➕',
    keywords: ['new', 'add', 'market'],
  },
  {
    id: 'view-markets',
    label: 'View All Markets',
    description: 'Browse all prediction markets',
    action: () => {},
    category: 'Navigation',
    icon: '📊',
    keywords: ['browse', 'list', 'markets'],
  },
  {
    id: 'portfolio',
    label: 'My Portfolio',
    description: 'View your positions and history',
    action: () => {},
    category: 'Navigation',
    icon: '💼',
    keywords: ['positions', 'holdings', 'trades'],
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    description: 'View top traders',
    action: () => {},
    category: 'Navigation',
    icon: '🏆',
    keywords: ['rankings', 'top', 'traders'],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage your preferences',
    action: () => {},
    category: 'Settings',
    icon: '⚙️',
    keywords: ['preferences', 'config'],
  },
  {
    id: 'theme',
    label: 'Customize Theme',
    description: 'Change colors and appearance',
    action: () => {},
    category: 'Settings',
    icon: '🎨',
    keywords: ['colors', 'dark mode', 'appearance'],
  },
  {
    id: 'shortcuts',
    label: 'Keyboard Shortcuts',
    description: 'View all keyboard shortcuts',
    action: () => {},
    category: 'Help',
    icon: '⌨️',
    keywords: ['keys', 'hotkeys'],
  },
];
