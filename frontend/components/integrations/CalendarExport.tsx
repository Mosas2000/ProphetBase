'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function CalendarExport() {
  const events = [
    { market: 'Bitcoin $100k by 2024', date: '2024-12-31', type: 'resolution' },
    { market: 'ETH $5k by Q2', date: '2024-06-30', type: 'deadline' },
    { market: 'Lakers Championship', date: '2024-06-15', type: 'resolution' },
  ];

  const handleGoogleCalendar = (event: typeof events[0]) => {
    const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(`${event.market} - Resolution`);
    const details = encodeURIComponent(`ProphetBase market resolution: ${event.market}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${startDate}&details=${details}`;
    window.open(url, '_blank');
  };

  const handleICalDownload = (event: typeof events[0]) => {
    const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ProphetBase//Market Calendar//EN
BEGIN:VEVENT
UID:${event.market.replace(/\s/g, '-')}@prophetbase.com
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}
DTSTART:${new Date(event.date).toISOString().replace(/-|:|\.\d+/g, '')}
SUMMARY:${event.market} - Resolution
DESCRIPTION:ProphetBase market resolution
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.market.replace(/\s/g, '-')}.ics`;
    a.click();
  };

  const handleExportAll = () => {
    alert('Exporting all events to calendar...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Calendar Export</h3>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30 mb-6">
            <h4 className="text-xl font-bold mb-2">Export to Calendar</h4>
            <p className="text-sm text-gray-400 mb-4">
              Never miss a market resolution. Add important dates to your calendar.
            </p>
            <Button onClick={handleExportAll}>
              Export All Events
            </Button>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-3">
            <h4 className="font-semibold mb-3">Upcoming Resolutions</h4>
            {events.map((event, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{event.market}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleGoogleCalendar(event)}>
                    📅 Google Calendar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleICalDownload(event)}>
                    📥 Download iCal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reminder Settings */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Reminder Settings</h4>
          
          <div className="space-y-3">
            {[
              { label: '1 day before', enabled: true },
              { label: '3 days before', enabled: true },
              { label: '1 week before', enabled: false },
            ].map((reminder, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-sm">{reminder.label}</span>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    reminder.enabled ? 'bg-green-500' : 'bg-gray-600'
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

      {/* Instructions */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">How to Use</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">1.</span>
              <p className="text-gray-300">Click "Google Calendar" to add directly to your Google Calendar</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">2.</span>
              <p className="text-gray-300">Or download the iCal file to import into any calendar app</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">3.</span>
              <p className="text-gray-300">Set custom reminders to get notified before resolutions</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
