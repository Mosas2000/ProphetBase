import React, { useState } from 'react';

interface QuickTradeProps {
  onTrade: (side: 'buy' | 'sell', amount: number) => void;
  symbol: string;
  price: number;
}

export const QuickTrade: React.FC<QuickTradeProps> = ({
  onTrade,
  symbol,
  price,
}) => {
  const [amount, setAmount] = useState(0);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [voiceActive, setVoiceActive] = useState(false);

  function handleTrade() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([50, 30, 50]);
    }
    onTrade(side, amount);
  }

  function handleVoiceCommand() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice commands not supported');
      return;
    }
    setVoiceActive(true);
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes('buy')) setSide('buy');
      if (transcript.includes('sell')) setSide('sell');
      const amt = transcript.match(/\d+(\.\d+)?/);
      if (amt) setAmount(Number(amt[0]));
      setVoiceActive(false);
    };
    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex flex-col gap-2 z-50 md:hidden">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">
          {symbol} @ {price}
        </span>
        <button
          className="ml-2 px-3 py-1 rounded bg-gray-200 text-xs"
          onClick={handleVoiceCommand}
          disabled={voiceActive}
        >
          {voiceActive ? 'Listening...' : '🎤 Voice'}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <button
          className={`px-4 py-2 rounded ${
            side === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setSide('buy')}
        >
          Buy
        </button>
        <button
          className={`px-4 py-2 rounded ${
            side === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setSide('sell')}
        >
          Sell
        </button>
        <input
          type="number"
          className="flex-1 border rounded px-2 py-1"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
          onClick={handleTrade}
        >
          {side === 'buy' ? 'Buy' : 'Sell'}
        </button>
      </div>
    </div>
  );
};
