'use client';

import { useState } from 'react';

interface ShareData {
  marketId: string;
  marketQuestion: string;
  outcome?: 'YES' | 'NO';
  profit?: number;
  position?: number;
}

export default function SocialSharing() {
  const [shareData, setShareData] = useState<ShareData>({
    marketId: '42',
    marketQuestion: 'Will BTC reach $100k by EOY 2024?',
    outcome: 'YES',
    profit: 2450,
    position: 5000,
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const generateShareText = (platform: string) => {
    const { marketQuestion, outcome, profit, position } = shareData;

    const baseUrl = 'https://prophetbase.com';
    const marketUrl = `${baseUrl}/market/${shareData.marketId}`;

    switch (platform) {
      case 'twitter':
        if (profit) {
          return `Just made $${profit.toLocaleString()} profit on ProphetBase! 🚀\n\nMarket: "${marketQuestion}"\nOutcome: ${outcome}\n\nJoin me: ${marketUrl}\n\n#ProphetBase #PredictionMarkets #Crypto`;
        }
        return `Trading on ProphetBase: "${marketQuestion}"\n\nWhat's your prediction? ${marketUrl}\n\n#ProphetBase #PredictionMarkets`;

      case 'telegram':
        return `🎯 ProphetBase Trade Alert!\n\nMarket: ${marketQuestion}\n${
          profit
            ? `Profit: $${profit.toLocaleString()}`
            : `Position: $${position?.toLocaleString()}`
        }\nOutcome: ${outcome}\n\nCheck it out: ${marketUrl}`;

      case 'discord':
        return `**ProphetBase Trade Update**\n\nMarket: *${marketQuestion}*\n${
          profit
            ? `💰 Profit: **$${profit.toLocaleString()}**`
            : `📊 Position: **$${position?.toLocaleString()}**`
        }\n🎲 Outcome: **${outcome}**\n\n🔗 ${marketUrl}`;

      case 'reddit':
        return `[ProphetBase] ${profit ? 'Made' : 'Trading'} ${
          profit
            ? `$${profit.toLocaleString()} profit`
            : `with $${position?.toLocaleString()}`
        } on: "${marketQuestion}"\n\nOutcome: ${outcome}\n\nLink: ${marketUrl}`;

      default:
        return marketUrl;
    }
  };

  const shareToTwitter = () => {
    const text = generateShareText('twitter');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = (platform: string) => {
    const text = generateShareText(platform);
    navigator.clipboard.writeText(text);
    setCopiedText(platform);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const shareToNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ProphetBase Trade',
          text: generateShareText('twitter'),
          url: `https://prophetbase.com/market/${shareData.marketId}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Share Your Trade
        </h2>
        <p className="text-sm text-gray-600">
          Spread the word about your predictions and profits
        </p>
      </div>

      {/* Preview Card */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {shareData.marketQuestion}
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div>
                <span className="text-gray-600">Outcome:</span>
                <span
                  className={`ml-2 font-semibold ${
                    shareData.outcome === 'YES'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {shareData.outcome}
                </span>
              </div>
              {shareData.profit && (
                <div>
                  <span className="text-gray-600">Profit:</span>
                  <span className="ml-2 font-bold text-green-600">
                    ${shareData.profit.toLocaleString()}
                  </span>
                </div>
              )}
              {shareData.position && !shareData.profit && (
                <div>
                  <span className="text-gray-600">Position:</span>
                  <span className="ml-2 font-semibold">
                    ${shareData.position.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-4xl">🎯</div>
        </div>

        <div className="text-xs text-gray-500">
          prophetbase.com/market/{shareData.marketId}
        </div>
      </div>

      {/* Social Platforms */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Twitter */}
        <button
          onClick={shareToTwitter}
          className="flex items-center space-x-3 p-4 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
        >
          <span className="text-2xl">𝕏</span>
          <div className="text-left flex-1">
            <div className="font-semibold">Share on Twitter</div>
            <div className="text-xs opacity-90">Post to your timeline</div>
          </div>
        </button>

        {/* Telegram */}
        <button
          onClick={() => copyToClipboard('telegram')}
          className="flex items-center space-x-3 p-4 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors relative"
        >
          <span className="text-2xl">✈️</span>
          <div className="text-left flex-1">
            <div className="font-semibold">Share on Telegram</div>
            <div className="text-xs opacity-90">
              {copiedText === 'telegram'
                ? '✓ Copied!'
                : 'Copy formatted message'}
            </div>
          </div>
        </button>

        {/* Discord */}
        <button
          onClick={() => copyToClipboard('discord')}
          className="flex items-center space-x-3 p-4 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div className="text-left flex-1">
            <div className="font-semibold">Share on Discord</div>
            <div className="text-xs opacity-90">
              {copiedText === 'discord'
                ? '✓ Copied!'
                : 'Copy formatted message'}
            </div>
          </div>
        </button>

        {/* Reddit */}
        <button
          onClick={() => copyToClipboard('reddit')}
          className="flex items-center space-x-3 p-4 bg-[#FF4500] text-white rounded-lg hover:bg-[#e03d00] transition-colors"
        >
          <span className="text-2xl">🤖</span>
          <div className="text-left flex-1">
            <div className="font-semibold">Share on Reddit</div>
            <div className="text-xs opacity-90">
              {copiedText === 'reddit' ? '✓ Copied!' : 'Copy formatted post'}
            </div>
          </div>
        </button>
      </div>

      {/* Copy Link */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Direct Link
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={`https://prophetbase.com/market/${shareData.marketId}`}
            readOnly
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={() => copyToClipboard('link')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copiedText === 'link' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Native Share (Mobile) */}
      {navigator.share && (
        <button
          onClick={shareToNative}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
        >
          <span>📤</span>
          <span className="font-medium">Share via...</span>
        </button>
      )}

      {/* Share Stats */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Share Performance
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Total Shares</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Referrals</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$450</div>
            <div className="text-sm text-gray-600">Referral Earnings</div>
          </div>
        </div>
      </div>

      {/* Custom Share Templates */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Share Templates
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setShareData({ ...shareData, profit: 2450 })}
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="font-medium text-gray-900">🎉 Victory Post</div>
            <div className="text-sm text-gray-600">
              Share your winning trade
            </div>
          </button>
          <button
            onClick={() =>
              setShareData({ ...shareData, profit: undefined, position: 5000 })
            }
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="font-medium text-gray-900">📊 Position Update</div>
            <div className="text-sm text-gray-600">
              Share your current position
            </div>
          </button>
          <button
            onClick={() =>
              setShareData({
                ...shareData,
                profit: undefined,
                position: undefined,
              })
            }
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="font-medium text-gray-900">
              🤔 Market Discussion
            </div>
            <div className="text-sm text-gray-600">Start a conversation</div>
          </button>
        </div>
      </div>
    </div>
  );
}
