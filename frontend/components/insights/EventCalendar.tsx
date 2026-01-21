'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface MarketEvent {
  id: number;
  market: string;
  type: 'resolution' | 'deadline' | 'milestone';
  date: string;
  daysUntil: number;
}

export function EventCalendar() {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  const events: MarketEvent[] = [
    {
      id: 1,
      market: 'Bitcoin $100k by 2024',
      type: 'resolution',
      date: '2024-12-31',
      daysUntil: 345,
    },
    {
      id: 2,
      market: 'ETH $5k by Q2',
      type: 'deadline',
      date: '2024-06-30',
      daysUntil: 161,
    },
    {
      id: 3,
      market: 'Lakers Championship',
      type: 'resolution',
      date: '2024-06-15',
      daysUntil: 146,
    },
    {
      id: 4,
      market: 'SOL $200 by March',
      type: 'deadline',
      date: '2024-03-31',
      daysUntil: 70,
    },
  ];

  const filteredEvents = events.filter(e => {
    if (filter === 'week') return e.daysUntil <= 7;
    if (filter === 'month') return e.daysUntil <= 30;
    return true;
  });

  const getEventIcon = (type: MarketEvent['type']) => {
    switch (type) {
      case 'resolution': return '🏁';
      case 'deadline': return '⏰';
      case 'milestone': return '🎯';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'border-red-500 bg-red-500/10';
    if (days <= 30) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-gray-700 bg-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Event Calendar</h3>
            <div className="flex gap-2">
              {(['all', 'week', 'month'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div key={event.id} className={`border rounded-lg p-4 ${getUrgencyColor(event.daysUntil)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventIcon(event.type)}</span>
                    <div>
                      <p className="font-medium mb-1">{event.market}</p>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={event.daysUntil <= 7 ? 'error' : event.daysUntil <= 30 ? 'warning' : 'default'}>
                    {event.daysUntil} days
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Deadline Summary */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Deadline Summary</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">This Week</p>
              <p className="text-3xl font-bold text-red-400">
                {events.filter(e => e.daysUntil <= 7).length}
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">This Month</p>
              <p className="text-3xl font-bold text-yellow-400">
                {events.filter(e => e.daysUntil <= 30).length}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-3xl font-bold">{events.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Reminders */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Active Reminders</h4>
          
          <div className="space-y-2">
            {[
              { market: 'Bitcoin $100k', reminder: '7 days before', enabled: true },
              { market: 'ETH $5k', reminder: '3 days before', enabled: true },
              { market: 'Lakers Championship', reminder: '1 day before', enabled: false },
            ].map((reminder, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{reminder.market}</p>
                  <p className="text-sm text-gray-400">{reminder.reminder}</p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    reminder.enabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      reminder.enabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
