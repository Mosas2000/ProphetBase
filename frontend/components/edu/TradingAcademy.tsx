'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  completed: boolean;
  locked: boolean;
}

export function TradingAcademy() {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const lessons: Lesson[] = [
    { id: '1', title: 'Introduction to Prediction Markets', level: 'beginner', duration: '10 min', completed: true, locked: false },
    { id: '2', title: 'Understanding Probabilities', level: 'beginner', duration: '15 min', completed: true, locked: false },
    { id: '3', title: 'Reading Market Sentiment', level: 'beginner', duration: '12 min', completed: false, locked: false },
    { id: '4', title: 'Position Sizing Strategies', level: 'intermediate', duration: '20 min', completed: false, locked: false },
    { id: '5', title: 'Advanced Market Analysis', level: 'intermediate', duration: '25 min', completed: false, locked: true },
    { id: '6', title: 'Arbitrage Opportunities', level: 'advanced', duration: '30 min', completed: false, locked: true },
  ];

  const strategies = [
    { name: 'Momentum Trading', description: 'Follow market trends and ride the wave', difficulty: 'Intermediate' },
    { name: 'Contrarian Approach', description: 'Bet against the crowd when odds are favorable', difficulty: 'Advanced' },
    { name: 'Diversification', description: 'Spread risk across multiple markets', difficulty: 'Beginner' },
  ];

  const certifications = [
    { name: 'Beginner Trader', progress: 80, required: 5, completed: 4 },
    { name: 'Intermediate Analyst', progress: 30, required: 10, completed: 3 },
    { name: 'Advanced Strategist', progress: 0, required: 15, completed: 0 },
  ];

  const filteredLessons = lessons.filter(l => l.level === selectedLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trading Academy</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold">2/6</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Learning Time</p>
              <p className="text-2xl font-bold">25 min</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Certificates</p>
              <p className="text-2xl font-bold">0/3</p>
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                  selectedLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lessons */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4 capitalize">{selectedLevel} Lessons</h4>
          
          <div className="space-y-3">
            {filteredLessons.map((lesson, idx) => (
              <div key={lesson.id} className={`p-4 rounded-lg border ${
                lesson.locked ? 'bg-gray-800 border-gray-700 opacity-50' : 'bg-gray-800 border-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed ? 'bg-green-500' : lesson.locked ? 'bg-gray-700' : 'bg-blue-500'
                    }`}>
                      {lesson.completed ? '✓' : lesson.locked ? '🔒' : idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-400">{lesson.duration}</p>
                    </div>
                  </div>
                  {lesson.completed ? (
                    <Badge variant="success">Completed</Badge>
                  ) : lesson.locked ? (
                    <Badge variant="default">Locked</Badge>
                  ) : (
                    <Button size="sm">Start Lesson</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Strategy Guides */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Strategy Guides</h4>
          
          <div className="space-y-3">
            {strategies.map((strategy, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium mb-1">{strategy.name}</h5>
                    <p className="text-sm text-gray-400">{strategy.description}</p>
                  </div>
                  <Badge variant="default">{strategy.difficulty}</Badge>
                </div>
                <Button size="sm" variant="secondary" className="mt-2">Read Guide</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Certifications */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Certification Progress</h4>
          
          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{cert.name}</p>
                    <p className="text-sm text-gray-400">{cert.completed}/{cert.required} lessons completed</p>
                  </div>
                  <span className="text-2xl">{cert.progress === 100 ? '🏆' : '📜'}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${cert.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
