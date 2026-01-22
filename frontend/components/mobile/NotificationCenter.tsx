'use client';

import { useState } from 'react';

interface NotificationItem {
  id: string;
  type: 'trade' | 'market' | 'price_alert' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
  icon: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'trade',
      title: 'Trade Executed',
      message: 'Your order for 500 YES shares in Market #42 has been filled',
      timestamp: Date.now() - 120000,
      isRead: false,
      actionUrl: '/market/42',
      icon: '📊',
    },
    {
      id: '2',
      type: 'price_alert',
      title: 'Price Alert',
      message: 'BTC market reached your target price of $95,000',
      timestamp: Date.now() - 300000,
      isRead: false,
      actionUrl: '/market/89',
      icon: '🔔',
    },
    {
      id: '3',
      type: 'market',
      title: 'Market Resolved',
      message:
        'Market "ETH reaches $5k" has been resolved. Check your winnings!',
      timestamp: Date.now() - 3600000,
      isRead: true,
      actionUrl: '/market/25',
      icon: '🏆',
    },
    {
      id: '4',
      type: 'social',
      title: 'New Follower',
      message: 'ProphetKing started following you',
      timestamp: Date.now() - 7200000,
      isRead: true,
      icon: '👥',
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'ProphetBase v2.0 is now live with new features!',
      timestamp: Date.now() - 86400000,
      isRead: true,
      actionUrl: '/changelog',
      icon: '⚡',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || !n.isRead
  );

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getTypeColor = (type: NotificationItem['type']) => {
    const colors = {
      trade: 'bg-blue-100 text-blue-700',
      market: 'bg-purple-100 text-purple-700',
      price_alert: 'bg-yellow-100 text-yellow-700',
      system: 'bg-gray-100 text-gray-700',
      social: 'bg-green-100 text-green-700',
    };
    return colors[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-600">
              {filter === 'unread'
                ? 'No unread notifications'
                : 'No notifications'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 text-xl ml-2"
                      >
                        ×
                      </button>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>

                      <div className="flex space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark read
                          </button>
                        )}
                        {notification.actionUrl && (
                          <button
                            onClick={() =>
                              (window.location.href = notification.actionUrl!)
                            }
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t text-center">
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

// Notification Settings Component
export function NotificationSettings() {
  const [settings, setSettings] = useState({
    trades: true,
    markets: true,
    priceAlerts: true,
    social: true,
    system: false,
    push: true,
    email: false,
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Notification Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Trade Notifications</h3>
            <p className="text-sm text-gray-600">
              Order fills, cancellations, and updates
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.trades}
              onChange={(e) =>
                setSettings({ ...settings, trades: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Market Updates</h3>
            <p className="text-sm text-gray-600">
              Market resolutions and new markets
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.markets}
              onChange={(e) =>
                setSettings({ ...settings, markets: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Price Alerts</h3>
            <p className="text-sm text-gray-600">
              Custom price target notifications
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.priceAlerts}
              onChange={(e) =>
                setSettings({ ...settings, priceAlerts: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Social Activity</h3>
            <p className="text-sm text-gray-600">
              Followers, mentions, and messages
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.social}
              onChange={(e) =>
                setSettings({ ...settings, social: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="font-semibold text-gray-900 mb-4">Delivery Methods</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Push Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push}
                onChange={(e) =>
                  setSettings({ ...settings, push: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        Save Settings
      </button>
    </div>
  );
}
