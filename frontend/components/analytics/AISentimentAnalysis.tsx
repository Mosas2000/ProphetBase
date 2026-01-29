'use client';

import { useState } from 'react';

interface SentimentData {
  score: number; // 0 to 100
  label: 'Bullish' | 'Bearish' | 'Neutral' | 'Mixed';
  sources: { name: string; weight: number; sentiment: number }[];
  summary: string;
}

const MOCK_SENTIMENT: SentimentData = {
  score: 72,
  label: 'Bullish',
  summary: 'Overall sentiment is strongly positive driven by recent technical breakthroughs and Institutional interest. Social media mentions have spiked by 40% in the last 24h.',
  sources: [
    { name: 'Twitter/X', weight: 40, sentiment: 85 },
    { name: 'News Articles', weight: 30, sentiment: 65 },
    { name: 'On-chain Data', weight: 30, sentiment: 60 }
  ]
};

/**
 * AI-powered market sentiment analysis component
 */
export default function AISentimentAnalysis() {
  const [data, setData] = useState<SentimentData>(MOCK_SENTIMENT);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8">
        <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
          AI LIVE
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Sentiment <span className="text-blue-600">DNA</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Gauge Component */}
        <div className="relative flex flex-col items-center">
          <svg className="w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={502}
              strokeDashoffset={502 - (502 * data.score) / 100}
              strokeLinecap="round"
              className="text-blue-600 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900 dark:text-white">{data.score}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.label}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
            "{data.summary}"
          </p>
          
          <div className="space-y-4">
            {data.sources.map((src) => (
              <div key={src.name}>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  <span className="text-gray-400">{src.name}</span>
                  <span className="text-gray-900 dark:text-white">{src.sentiment}% POSITIVE</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${src.sentiment}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          Analysis based on 10,000+ data points • Refreshed 5m ago
        </p>
      </div>
    </div>
  );
}
