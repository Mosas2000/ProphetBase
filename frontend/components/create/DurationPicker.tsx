'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface DurationPreset {
  label: string;
  hours: number;
  description: string;
}

const presets: DurationPreset[] = [
  { label: '1 Hour', hours: 1, description: 'Quick predictions' },
  { label: '6 Hours', hours: 6, description: 'Intraday events' },
  { label: '1 Day', hours: 24, description: 'Daily outcomes' },
  { label: '3 Days', hours: 72, description: 'Short-term events' },
  { label: '1 Week', hours: 168, description: 'Weekly predictions' },
  { label: '2 Weeks', hours: 336, description: 'Bi-weekly events' },
  { label: '1 Month', hours: 720, description: 'Monthly outcomes' },
  { label: '3 Months', hours: 2160, description: 'Quarterly events' },
  { label: '6 Months', hours: 4320, description: 'Semi-annual' },
  { label: '1 Year', hours: 8760, description: 'Annual predictions' },
];

interface DurationPickerProps {
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export function DurationPicker({ selectedDate, onSelectDate }: DurationPickerProps) {
  const [endDate, setEndDate] = useState<string>(selectedDate || '');
  const [customMode, setCustomMode] = useState(false);

  const handlePresetSelect = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    const formattedDate = date.toISOString().slice(0, 16);
    setEndDate(formattedDate);
    if (onSelectDate) {
      onSelectDate(formattedDate);
    }
    setCustomMode(false);
  };

  const handleCustomDate = (value: string) => {
    setEndDate(value);
    if (onSelectDate) {
      onSelectDate(value);
    }
  };

  const getTimeRemaining = () => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return 'Date is in the past';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Market Duration</h3>
        <p className="text-sm text-gray-400">Choose when your market will close for trading</p>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Quick Presets</h4>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomMode(!customMode)}
          >
            {customMode ? 'Show Presets' : 'Custom Date'}
          </Button>
        </div>

        {!customMode ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {presets.map(preset => (
              <button
                key={preset.label}
                onClick={() => handlePresetSelect(preset.hours)}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 border border-gray-700 hover:border-blue-500 transition-all text-left"
              >
                <p className="font-medium mb-1">{preset.label}</p>
                <p className="text-xs text-gray-400">{preset.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-4">
              <Input
                label="Custom End Date & Time"
                type="datetime-local"
                value={endDate}
                onChange={(e) => handleCustomDate(e.target.value)}
              />
            </div>
          </Card>
        )}
      </div>

      {/* Selected Duration Display */}
      {endDate && (
        <Card className="border border-blue-500">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold mb-1">Market Closes</h4>
                <p className="text-sm text-gray-400">
                  {new Date(endDate).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setEndDate('')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
                <p className="text-lg font-bold text-blue-400">{getTimeRemaining()}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Trading Period</p>
                <p className="text-lg font-bold">
                  {Math.floor((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Duration Guidelines */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Duration Guidelines</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium mb-1">Short-term (1-7 days)</p>
                <p className="text-gray-400">High activity, quick resolution. Good for news events and price movements.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium mb-1">Medium-term (1-3 months)</p>
                <p className="text-gray-400">Balanced trading period. Ideal for product launches and quarterly events.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium mb-1">Long-term (3+ months)</p>
                <p className="text-gray-400">Lower volatility, strategic positions. Best for major milestones and annual predictions.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Pro Tips</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Longer markets tend to have more stable prices and better liquidity</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Set the end date after the event outcome is known for easy resolution</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Consider time zones when setting exact times for global events</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">⚠️</span>
              <p>Markets cannot be extended once created, so choose carefully</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
