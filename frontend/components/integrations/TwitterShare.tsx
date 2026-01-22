'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface ShareData {
  market: string;
  position: 'YES' | 'NO';
  price: number;
  profit?: number;
}

export function TwitterShare({ data }: { data?: ShareData }) {
  const [customText, setCustomText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const templates = [
    `Just traded on @ProphetBase! 🎯\n\n${data?.market || 'Market'}\nPosition: ${data?.position || 'YES'} @ ${data?.price || 65}¢\n\n#PredictionMarkets #Web3`,
    `📈 New position on @ProphetBase!\n\n"${data?.market || 'Market'}"\n\nI'm ${data?.position === 'YES' ? 'bullish' : 'bearish'} at ${data?.price || 65}¢\n\nWhat's your take? 🤔`,
    `🚀 ${data?.profit && data.profit > 0 ? `+$${data.profit} profit` : 'Trading'} on @ProphetBase\n\n${data?.market || 'Market'}\n\nJoin me: prophetbase.com`,
  ];

  const handleShare = (text: string) => {
    const tweetText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Tweet copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Share on Twitter</h3>

          {/* Templates */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-400">Quick Templates</h4>
            {templates.map((template, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-3 whitespace-pre-wrap">{template}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleShare(template)}>
                    Tweet This
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleCopy(template)}>
                    Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setCustomText(template)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Tweet */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Tweet</h4>
            <TextArea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Write your own tweet..."
              rows={4}
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                {customText.length}/280 characters
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleShare(customText)} disabled={!customText}>
                  Tweet
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setCustomText('')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Card Preview */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Share Card Preview</h4>
          
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="font-bold">ProphetBase</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{data?.market || 'Market Question'}</h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm opacity-80">Position</p>
                <p className="text-2xl font-bold">{data?.position || 'YES'}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm opacity-80">Price</p>
                <p className="text-2xl font-bold">{data?.price || 65}¢</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Stats */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Your Share Stats</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Shares</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Impressions</p>
              <p className="text-2xl font-bold">1.2K</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Clicks</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
