'use client';

import { useState } from 'react';

interface Action {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions: Action[] = [
    {
      icon: '📊',
      label: 'Browse Markets',
      onClick: () => console.log('Browse markets'),
      color: 'bg-blue-600',
    },
    {
      icon: '💰',
      label: 'Quick Trade',
      onClick: () => console.log('Quick trade'),
      color: 'bg-green-600',
    },
    {
      icon: '💼',
      label: 'Portfolio',
      onClick: () => console.log('Portfolio'),
      color: 'bg-purple-600',
    },
    {
      icon: '✨',
      label: 'Create Market',
      onClick: () => console.log('Create market'),
      color: 'bg-orange-600',
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 md:hidden">
      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 mb-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 ${action.color} text-white rounded-full shadow-lg transition-all ${
              isOpen
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-16 pointer-events-none'
            }`}
            style={{
              transitionDelay: isOpen ? `${idx * 50}ms` : '0ms',
            }}
          >
            <span className="w-12 h-12 flex items-center justify-center text-xl">
              {action.icon}
            </span>
            <span className="pr-4 font-medium whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        +
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
