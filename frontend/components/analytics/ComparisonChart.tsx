'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { useState } from 'react';

interface ComparisonData {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export function ComparisonChart() {
  const [timeframe, setTimeframe] = useState('1D');
  const [metrics, setMetrics] = useState(['volume', 'users', 'trades']);

  const comparisonData: ComparisonData[] = [
    {
      id: '1',
      name: 'ProphetBase',
      value: 125000,
      change: 12500,
      changePercent: 11.1,
    },
    {
      id: '2',
      name: 'Competitor A',
      value: 98000,
      change: -2100,
      changePercent: -2.1,
    },
    {
      id: '3',
      name: 'Competitor B',
      value: 87000,
      change: 4300,
      changePercent: 5.2,
    },
  ];

  const timeframes = ['1H', '1D', '1W', '1M', '3M', '1Y'];
  const availableMetrics = [
    { id: 'volume', name: 'Trading Volume' },
    { id: 'users', name: 'Active Users' },
    { id: 'trades', name: 'Number of Trades' },
    { id: 'markets', name: 'Active Markets' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Platform Comparison
              </h3>
              <p className="text-gray-400">
                Compare ProphetBase with competing platforms
              </p>
            </div>
            <div className="flex gap-2">
              <SecondaryButton>Export Data</SecondaryButton>
              <Button>Share Report</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            {/* Timeframe Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Timeframe
              </label>
              <div className="flex gap-2">
                {timeframes.map((tf) =>
                  timeframe === tf ? (
                    <Button key={tf} onClick={() => setTimeframe(tf)}>
                      {tf}
                    </Button>
                  ) : (
                    <SecondaryButton key={tf} onClick={() => setTimeframe(tf)}>
                      {tf}
                    </SecondaryButton>
                  )
                )}
              </div>
            </div>

            {/* Metrics Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Metrics</label>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map((metric) =>
                  metrics.includes(metric.id) ? (
                    <Button
                      key={metric.id}
                      onClick={() => {
                        setMetrics(metrics.filter((m) => m !== metric.id));
                      }}
                    >
                      {metric.name}
                    </Button>
                  ) : (
                    <SecondaryButton
                      key={metric.id}
                      onClick={() => {
                        setMetrics([...metrics, metric.id]);
                      }}
                    >
                      {metric.name}
                    </SecondaryButton>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Performance Comparison</h4>

          <div className="space-y-4">
            {comparisonData.map((platform) => (
              <div key={platform.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium">{platform.name}</h5>
                    <p className="text-2xl font-bold">
                      {platform.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={platform.change >= 0 ? 'green' : 'red'}
                      className={
                        platform.change >= 0 ? 'bg-green-600' : 'bg-red-600'
                      }
                    >
                      {platform.change >= 0 ? '+' : ''}
                      {platform.changePercent}%
                    </Badge>
                    <p className="text-sm text-gray-400 mt-1">
                      {platform.change >= 0 ? '+' : ''}
                      {platform.change.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Simple bar chart visualization */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(platform.value / 150000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Key Insights</h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Market Leadership</p>
                <p className="text-sm text-gray-400">
                  ProphetBase leads in trading volume with 11.1% growth
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Competitive Advantage</p>
                <p className="text-sm text-gray-400">
                  User engagement metrics show strong retention
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Growth Opportunity</p>
                <p className="text-sm text-gray-400">
                  Market expansion potential in emerging regions
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
