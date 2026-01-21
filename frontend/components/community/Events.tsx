'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Events() {
  const upcomingEvents = [
    { id: '1', title: 'AMA with Top Trader', type: 'ama', date: 'Jan 25, 2024', attendees: 234, host: 'CryptoKing' },
    { id: '2', title: 'Weekly Trading Competition', type: 'competition', date: 'Jan 28, 2024', attendees: 156, prize: '$5,000' },
  ];

  const pastEvents = [
    { title: 'Virtual Meetup: Market Trends', type: 'meetup', date: 'Jan 15, 2024', attendees: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Community Events</h3>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Upcoming Events</h4>
          
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold">{event.title}</h5>
                      <Badge variant="default" className="capitalize text-xs">{event.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {event.date} • {event.attendees} registered
                    </p>
                    {event.host && <p className="text-sm">Hosted by {event.host}</p>}
                    {event.prize && <p className="text-sm text-yellow-400">Prize: {event.prize}</p>}
                  </div>
                  <Button size="sm">Register</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Event Calendar */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">This Month</h4>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded text-sm ${
                  [24, 27].includes(i + 1)
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Past Events */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Past Events</h4>
          
          <div className="space-y-2">
            {pastEvents.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.date} • {event.attendees} attended</p>
                </div>
                <Button size="sm" variant="secondary">Replay</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
