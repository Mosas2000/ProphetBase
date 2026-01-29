'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  type: 'mention' | 'follow' | 'market_update' | 'reward';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'New Mention',
    message: '@alpha mentioned you in "Will BTC hit $100k?"',
    timestamp: '5m ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'follow',
    title: 'New Follower',
    message: '@whale_watcher started following you',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'reward',
    title: 'Badge Earned!',
    message: 'You just earned the "Market Architect" badge',
    timestamp: '2h ago',
    isRead: true,
  }
];

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Notifications</h3>
          <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">{unreadCount} UNREAD UPDATES</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                {!n.isRead && <div className="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full" />}
                <div className="flex gap-3 mb-1">
                  <NotificationIcon type={n.type} />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{n.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-7 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 pl-7 mt-2 font-medium uppercase">{n.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4 opacity-20">🔔</div>
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">No notifications yet</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
        <button className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
}

function NotificationIcon({ type }: { type: Notification['type'] }) {
  const icons = {
    mention: '💬',
    follow: '👤',
    market_update: '📊',
    reward: '🏆',
  };
  return <span className="text-sm">{icons[type]}</span>;
}
