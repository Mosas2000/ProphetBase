'use client';

import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'ama' | 'tournament' | 'community' | 'trading_contest';
  date: string;
  duration: number;
  host: {
    name: string;
    avatar: string;
    title: string;
  };
  participants: number;
  maxParticipants?: number;
  isLive: boolean;
  isPast: boolean;
  isRegistered: boolean;
  recording?: string;
  prizes?: string[];
  agenda?: string[];
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Live Trading AMA with ProphetKing',
      description: 'Join our top trader for a live Q&A session. Learn advanced strategies, get your questions answered, and win prizes!',
      type: 'ama',
      date: new Date(Date.now() + 7200000).toISOString(),
      duration: 90,
      host: {
        name: 'ProphetKing',
        avatar: '👑',
        title: 'Top Trader • 73% Win Rate'
      },
      participants: 247,
      maxParticipants: 500,
      isLive: false,
      isPast: false,
      isRegistered: true,
      prizes: ['$500 USDC', '$300 USDC', '$200 USDC'],
      agenda: [
        'Opening remarks (10 min)',
        'Trading strategies Q&A (40 min)',
        'Live market analysis (20 min)',
        'Community questions (20 min)'
      ]
    },
    {
      id: '2',
      title: 'ProphetBase Weekly Trading Contest',
      description: '7-day trading competition with $10k prize pool. Open to all traders. Best profit percentage wins!',
      type: 'trading_contest',
      date: new Date(Date.now() + 86400000).toISOString(),
      duration: 10080,
      host: {
        name: 'ProphetBase Team',
        avatar: '⚡',
        title: 'Official Team'
      },
      participants: 0,
      maxParticipants: 1000,
      isLive: false,
      isPast: false,
      isRegistered: false,
      prizes: ['$5000', '$3000', '$2000', '10x $100']
    },
    {
      id: '3',
      title: 'Introduction to Prediction Markets',
      description: 'Learn the basics of prediction markets, how to trade, and strategies for beginners.',
      type: 'webinar',
      date: new Date(Date.now() + 172800000).toISOString(),
      duration: 60,
      host: {
        name: 'Sarah Chen',
        avatar: '📚',
        title: 'Education Lead'
      },
      participants: 89,
      isLive: false,
      isPast: false,
      isRegistered: false,
      agenda: [
        'What are prediction markets? (15 min)',
        'How to place your first trade (15 min)',
        'Risk management basics (15 min)',
        'Q&A session (15 min)'
      ]
    },
    {
      id: '4',
      title: 'Market Maker Masterclass',
      description: 'Advanced strategies for market makers. Learn how to provide liquidity and earn consistent returns.',
      type: 'webinar',
      date: new Date(Date.now() - 86400000).toISOString(),
      duration: 120,
      host: {
        name: 'Alex Thompson',
        avatar: '🏭',
        title: 'DeFi Expert'
      },
      participants: 342,
      isLive: false,
      isPast: true,
      isRegistered: true,
      recording: 'https://example.com/recording'
    }
  ]);

  const [filter, setFilter] = useState<'upcoming' | 'past' | 'registered'>('upcoming');

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return !event.isPast;
    if (filter === 'past') return event.isPast;
    if (filter === 'registered') return event.isRegistered;
    return true;
  });

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      webinar: 'bg-blue-100 text-blue-700',
      ama: 'bg-purple-100 text-purple-700',
      tournament: 'bg-red-100 text-red-700',
      community: 'bg-green-100 text-green-700',
      trading_contest: 'bg-yellow-100 text-yellow-700'
    };
    return colors[type];
  };

  const getEventTypeIcon = (type: Event['type']) => {
    const icons = {
      webinar: '🎓',
      ama: '💬',
      tournament: '🏆',
      community: '🎉',
      trading_contest: '📊'
    };
    return icons[type];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Events</h2>
          <p className="text-sm text-gray-600">Join webinars, AMAs, contests, and community gatherings</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['upcoming', 'past', 'registered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
              event.isLive
                ? 'border-red-400 bg-gradient-to-r from-red-50 to-red-100'
                : event.isPast
                ? 'border-gray-200 bg-gray-50'
                : 'border-blue-200 bg-white hover:border-blue-400'
            }`}
          >
            {/* Live Badge */}
            {event.isLive && (
              <div className="absolute top-4 right-4">
                <span className="flex items-center space-x-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>LIVE NOW</span>
                </span>
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* Date Box */}
              <div className="text-center p-4 bg-blue-600 text-white rounded-lg min-w-[80px]">
                <div className="text-2xl font-bold">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-sm">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)} {event.type.replace('_', ' ')}
                  </span>
                  {event.isRegistered && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Registered
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-3">{event.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{event.host.avatar}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{event.host.name}</div>
                      <div className="text-xs">{event.host.title}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-semibold">⏱️ Duration:</span> {formatDuration(event.duration)}
                  </div>
                  
                  {!event.isPast && (
                    <div>
                      <span className="font-semibold">🕐 Starts:</span> {formatDate(event.date)}
                    </div>
                  )}
                  
                  <div>
                    <span className="font-semibold">👥 Participants:</span> {event.participants}
                    {event.maxParticipants && ` / ${event.maxParticipants}`}
                  </div>
                </div>

                {/* Progress Bar */}
                {event.maxParticipants && !event.isPast && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Prizes */}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="font-semibold text-yellow-900 mb-2">🏆 Prizes:</div>
                    <div className="flex flex-wrap gap-2">
                      {event.prizes.map((prize, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          {index + 1}. {prize}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-gray-900 mb-2">📋 Agenda:</div>
                    <ul className="space-y-1">
                      {event.agenda.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-blue-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  {event.isPast && event.recording ? (
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Watch Recording
                    </button>
                  ) : event.isLive ? (
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse">
                      Join Now
                    </button>
                  ) : event.isRegistered ? (
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      View Details
                    </button>
                  ) : (
                    <>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Register
                      </button>
                      <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Add to Calendar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
