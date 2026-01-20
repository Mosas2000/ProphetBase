'use client';

import Card from '@/components/ui/Card';

interface MarketDepthProps {
  marketId: number;
}

export default function MarketDepth({ marketId }: MarketDepthProps) {
  // Mock order book depth data
  const buyOrders = [
    { price: 65, volume: 1000, total: 650 },
    { price: 64, volume: 2500, total: 1600 },
    { price: 63, volume: 5000, total: 3150 },
    { price: 62, volume: 3000, total: 1860 },
    { price: 61, volume: 4000, total: 2440 },
  ];

  const sellOrders = [
    { price: 66, volume: 1500, total: 990 },
    { price: 67, volume: 2000, total: 1340 },
    { price: 68, volume: 4500, total: 3060 },
    { price: 69, volume: 2500, total: 1725 },
    { price: 70, volume: 3500, total: 2450 },
  ];

  const maxVolume = Math.max(
    ...buyOrders.map(o => o.volume),
    ...sellOrders.map(o => o.volume)
  );

  const totalBuyVolume = buyOrders.reduce((sum, o) => sum + o.volume, 0);
  const totalSellVolume = sellOrders.reduce((sum, o) => sum + o.volume, 0);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Market Depth</h2>

      {/* Depth Visualization */}
      <div className="mb-6">
        <div className="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {/* Buy side (left) */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 flex flex-col justify-center gap-1 pr-2">
            {buyOrders.map((order, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1 text-right">
                  <div
                    className="bg-gradient-to-l from-green-500 to-green-400 h-6 rounded-l flex items-center justify-end pr-2 text-white text-xs font-medium"
                    style={{ width: `${(order.volume / maxVolume) * 100}%` }}
                  >
                    {order.volume}
                  </div>
                </div>
                <div className="w-12 text-sm font-semibold text-green-600">{order.price}¢</div>
              </div>
            ))}
          </div>

          {/* Sell side (right) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center gap-1 pl-2">
            {sellOrders.map((order, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-12 text-sm font-semibold text-red-600">{order.price}¢</div>
                <div className="flex-1">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-400 h-6 rounded-r flex items-center pl-2 text-white text-xs font-medium"
                    style={{ width: `${(order.volume / maxVolume) * 100}%` }}
                  >
                    {order.volume}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Buy Depth</div>
          <div className="text-2xl font-bold text-green-600">{totalBuyVolume.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">shares</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sell Depth</div>
          <div className="text-2xl font-bold text-red-600">{totalSellVolume.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">shares</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Liquidity</div>
          <div className="text-2xl font-bold text-blue-600">
            ${((totalBuyVolume + totalSellVolume) / 100).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">total</div>
        </div>
      </div>

      {/* Support/Resistance */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Support Level</div>
          <div className="text-xl font-bold text-green-600">63¢</div>
          <div className="text-xs text-gray-500">Strong buy wall</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Resistance Level</div>
          <div className="text-xl font-bold text-red-600">68¢</div>
          <div className="text-xs text-gray-500">Strong sell wall</div>
        </div>
      </div>
    </Card>
  );
}
