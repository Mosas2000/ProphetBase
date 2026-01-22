'use client';

import Card from '@/components/ui/Card';

export default function HeatMap() {
  // Mock heatmap data - trading activity by hour and day
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock activity data (0-100)
  const activityData = days.map(() =>
    hours.map(() => Math.floor(Math.random() * 100))
  );

  const categoryPopularity = [
    { name: 'Crypto', value: 85, trend: '+12%' },
    { name: 'Sports', value: 72, trend: '+8%' },
    { name: 'Politics', value: 58, trend: '-3%' },
    { name: 'Entertainment', value: 45, trend: '+5%' },
    { name: 'Tech', value: 38, trend: '+15%' },
  ];

  const getHeatColor = (value: number) => {
    if (value >= 80) return 'bg-red-600';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getOpacity = (value: number) => {
    return Math.max(0.2, value / 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Trading Activity Heatmap</h2>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-1 mb-2">
              <div className="w-12" /> {/* Spacer for day labels */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="w-6 text-xs text-center text-gray-500"
                >
                  {hour % 4 === 0 ? hour : ''}
                </div>
              ))}
            </div>

            {days.map((day, dayIdx) => (
              <div key={day} className="flex gap-1 mb-1">
                <div className="w-12 text-sm font-medium flex items-center">{day}</div>
                {activityData[dayIdx].map((value, hourIdx) => (
                  <div
                    key={hourIdx}
                    className={`w-6 h-6 rounded ${getHeatColor(value)} cursor-pointer hover:scale-110 transition-transform`}
                    style={{ opacity: getOpacity(value) }}
                    title={`${day} ${hourIdx}:00 - Activity: ${value}%`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <span className="text-gray-500">Less</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((val) => (
              <div
                key={val}
                className={`w-6 h-6 rounded ${getHeatColor(val)}`}
                style={{ opacity: getOpacity(val) }}
              />
            ))}
          </div>
          <span className="text-gray-500">More</span>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Peak trading hours: 12:00-16:00 UTC • Most active day: Wednesday
        </p>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Category Popularity</h3>
        <div className="space-y-3">
          {categoryPopularity.map((cat) => (
            <div key={cat.name} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${cat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {cat.trend}
                    </span>
                    <span className="text-sm text-gray-500">{cat.value}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
