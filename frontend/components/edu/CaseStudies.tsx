'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CaseStudy {
  id: string;
  title: string;
  trader: string;
  market: string;
  profit: number;
  strategy: string;
  lessons: string[];
  outcome: 'success' | 'failure';
}

export function CaseStudies() {
  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      title: 'Bitcoin $100k Prediction',
      trader: 'CryptoKing',
      market: 'Will Bitcoin reach $100k by 2024?',
      profit: 2450,
      strategy: 'Early entry with technical analysis',
      lessons: [
        'Entered early when probability was undervalued at 45%',
        'Used technical indicators to identify trend',
        'Took partial profits at 65% probability',
      ],
      outcome: 'success',
    },
    {
      id: '2',
      title: 'Sports Upset Prediction',
      trader: 'TradeQueen',
      market: 'Lakers to win Championship',
      profit: -500,
      strategy: 'Contrarian bet against favorites',
      lessons: [
        'Overestimated underdog chances',
        'Didn\'t account for injury reports',
        'Position size was too large for risky bet',
      ],
      outcome: 'failure',
    },
    {
      id: '3',
      title: 'Political Event Trading',
      trader: 'MarketMaster',
      market: 'Election outcome prediction',
      profit: 3200,
      strategy: 'Poll aggregation and sentiment analysis',
      lessons: [
        'Combined multiple data sources',
        'Monitored real-time sentiment shifts',
        'Adjusted position as new polls released',
      ],
      outcome: 'success',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Case Studies</h3>
          <p className="text-gray-400">Learn from real trades and market analysis</p>
        </div>
      </Card>

      {/* Case Studies */}
      {caseStudies.map(study => (
        <Card key={study.id}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold mb-2">{study.title}</h4>
                <p className="text-gray-400 mb-2">by {study.trader}</p>
                <p className="text-sm text-gray-500">{study.market}</p>
              </div>
              <div className="text-right">
                <Badge variant={study.outcome === 'success' ? 'success' : 'error'}>
                  {study.outcome === 'success' ? 'Success' : 'Failure'}
                </Badge>
                <p className={`text-2xl font-bold mt-2 ${
                  study.profit > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {study.profit > 0 ? '+' : ''}${study.profit}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-400 mb-1">Strategy Used</p>
              <p className="font-medium">{study.strategy}</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-3">Key Lessons:</p>
              <div className="space-y-2">
                {study.lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={study.outcome === 'success' ? 'text-green-400' : 'text-red-400'}>
                      {study.outcome === 'success' ? '✓' : '✗'}
                    </span>
                    <p className="text-sm">{lesson}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button size="sm" variant="secondary">Read Full Analysis</Button>
          </div>
        </Card>
      ))}

      {/* User Stories */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Community Stories</h4>
          
          <div className="space-y-3">
            {[
              { user: 'Alice', story: 'How I turned $100 into $1,000 in 3 months', profit: 900 },
              { user: 'Bob', story: 'My biggest trading mistake and what I learned', profit: -200 },
            ].map((story, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{story.story}</p>
                  <span className={story.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                    {story.profit > 0 ? '+' : ''}${story.profit}
                  </span>
                </div>
                <p className="text-sm text-gray-400">by {story.user}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
