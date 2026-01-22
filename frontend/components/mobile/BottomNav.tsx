'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [notificationCount] = useState(3);

  const navItems: NavItem[] = [
    { icon: '🏠', label: 'Home', href: '/' },
    { icon: '📊', label: 'Markets', href: '/markets' },
    { icon: '💼', label: 'Portfolio', href: '/portfolio' },
    { icon: '🔔', label: 'Alerts', href: '/notifications', badge: notificationCount },
    { icon: '👤', label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="relative">
                <span className="text-2xl">{item.icon}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
