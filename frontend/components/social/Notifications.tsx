'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/formatDate';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'win' | 'loss' | 'market_update' | 'follow' | 'comment';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'win',
      title: '🎉 Market Resolved - You Won!',
      message: 'Your YES position in "Will Bitcoin reach $100k by EOY?" won! Claim your $150 winnings.',
      timestamp: Date.now() - 3600000,
      read: false,
    },
    {
      id: '2',
      type: 'market_update',
      title: '📊 Market Update',
      message: 'Price moved 15% in "Will ETH reach $5k by March?" - Your position is now profitable.',
      timestamp: Date.now() - 7200000,
      read: false,
    },
    {
      id: '3',
      type: 'follow',
      title: '👤 New Follower',
      message: 'CryptoKing started following you!',
      timestamp: Date.now() - 10800000,
      read: true,
    },
    {
      id: '4',
      type: 'comment',
      title: '💬 New Comment',
      message: 'Someone replied to your comment on "Will SOL reach $200 by Q2?"',
      timestamp: Date.now() - 14400000,
      read: true,
    },
    {
      id: '5',
      type: 'loss',
      title: '📉 Market Resolved',
      message: 'Your NO position in "Will BTC hit $80k?" did not win.',
      timestamp: Date.now() - 86400000,
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'win': return '🎉';
      case 'loss': return '📉';
      case 'market_update': return '📊';
      case 'follow': return '👤';
      case 'comment': return '💬';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'win': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'loss': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'market_update': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="red">{unreadCount} new</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="secondary" className="text-sm">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              !notification.read
                ? getNotificationColor(notification.type)
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-75'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{notification.title}</h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">{formatDate(notification.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-500">No notifications yet</p>
        </div>
      )}
    </Card>
  );
}
