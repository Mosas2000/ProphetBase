'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useRef } from 'react';

interface SharePreviewProps {
  marketName: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
}

export default function SharePreview({ marketName, yesPrice, noPrice, volume, endDate }: SharePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0052FF');
    gradient.addColorStop(1, '#6699FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add content
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('ProphetBase', 60, 100);

    ctx.font = '36px Arial';
    const maxWidth = 1080;
    const words = marketName.split(' ');
    let line = '';
    let y = 200;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        ctx.fillText(line, 60, y);
        line = word + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 60, y);

    // Prices
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#10B981';
    ctx.fillText(`YES ${yesPrice}¢`, 60, y + 150);
    
    ctx.fillStyle = '#EF4444';
    ctx.fillText(`NO ${noPrice}¢`, 600, y + 150);

    // Download
    const link = document.createElement('a');
    link.download = 'prophetbase-share.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToTwitter = () => {
    const text = `Check out this prediction market on ProphetBase: "${marketName}" - YES ${yesPrice}¢ | NO ${noPrice}¢`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const text = `${marketName}\n\nYES ${yesPrice}¢ | NO ${noPrice}¢\n\nTrade on ProphetBase`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Share This Market</h3>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="text-sm font-semibold mb-2">PROPHETBASE</div>
        <h4 className="text-xl font-bold mb-4">{marketName}</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-green-400">YES {yesPrice}¢</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">NO {noPrice}¢</div>
          </div>
        </div>
        <div className="flex justify-between text-sm opacity-90">
          <span>Volume: ${volume.toLocaleString()}</span>
          <span>Ends: {endDate}</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button onClick={shareToTwitter} className="bg-[#1DA1F2] hover:bg-[#1a8cd8]">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Share on Twitter
        </Button>
        <Button onClick={shareToTelegram} className="bg-[#0088cc] hover:bg-[#0077b3]">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Share on Telegram
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={copyLink} variant="secondary">
          📋 Copy Link
        </Button>
        <Button onClick={generateShareImage} variant="secondary">
          🖼️ Download Image
        </Button>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}
