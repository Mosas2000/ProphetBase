import React, { useRef, useEffect } from 'react';

export interface AdaptiveNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ key: string; label: string; icon: React.ReactNode }>;
}

export const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
    }
    function handleTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 60) {
        const idx = tabs.findIndex((t) => t.key === activeTab);
        if (deltaX < 0 && idx < tabs.length - 1) {
          onTabChange(tabs[idx + 1].key);
        } else if (deltaX > 0 && idx > 0) {
          onTabChange(tabs[idx - 1].key);
        }
      }
      touchStartX.current = null;
    }
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, onTabChange, tabs]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm pb-safe md:hidden">
      <div className="grid grid-cols-3 gap-1 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
