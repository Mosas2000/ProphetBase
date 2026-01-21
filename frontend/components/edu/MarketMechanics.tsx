'use client';

import { Card } from '@/components/ui/Card';

export function MarketMechanics() {
  return (
    <div className="space-y-6">
      {/* How Markets Work */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">How Prediction Markets Work</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">1. Market Creation</h4>
              <p className="text-sm text-gray-400">
                A market is created with a binary question (YES or NO). Each share represents $1 if the outcome is correct.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">2. Trading</h4>
              <p className="text-sm text-gray-400">
                Users buy and sell shares. Prices reflect the market's collective probability estimate (e.g., 65¢ = 65% chance).
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">3. Resolution</h4>
              <p className="text-sm text-gray-400">
                When the event occurs, the market resolves. Correct shares pay $1, incorrect shares become worthless.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Price Discovery */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Price Discovery</h4>
          
          <div className="mb-4">
            <p className="text-gray-400 mb-4">
              Prices are determined by supply and demand through our Automated Market Maker (AMM).
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-400 mb-1">YES Price</p>
                  <p className="text-3xl font-bold text-green-400">65¢</p>
                </div>
                <div className="text-2xl">+</div>
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-400 mb-1">NO Price</p>
                  <p className="text-3xl font-bold text-red-400">35¢</p>
                </div>
                <div className="text-2xl">=</div>
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-400 mb-1">Total</p>
                  <p className="text-3xl font-bold">$1.00</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center">
                YES and NO prices always sum to $1
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* AMM Explanation */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Automated Market Maker (AMM)</h4>
          
          <div className="space-y-3">
            <p className="text-gray-400">
              Our AMM automatically adjusts prices based on trading activity:
            </p>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="font-medium mb-2">When users buy YES shares:</p>
              <ul className="text-sm text-gray-400 space-y-1 ml-4">
                <li>• YES price increases</li>
                <li>• NO price decreases</li>
                <li>• Reflects higher probability of YES outcome</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="font-medium mb-2">When users sell YES shares:</p>
              <ul className="text-sm text-gray-400 space-y-1 ml-4">
                <li>• YES price decreases</li>
                <li>• NO price increases</li>
                <li>• Reflects lower probability of YES outcome</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Fee Structure */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Fee Structure</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-sm">Trading Fee</span>
              <span className="font-bold">1-2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-sm">Withdrawal Fee</span>
              <span className="font-bold">Free</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-sm">Deposit Fee</span>
              <span className="font-bold">Free</span>
            </div>
          </div>

          <div className="mt-4 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-semibold text-blue-400">Pro Tip:</span> Higher-level users receive fee discounts up to 20%
            </p>
          </div>
        </div>
      </Card>

      {/* Example Trade */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Example Trade</h4>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Market</p>
                <p className="font-medium">Will Bitcoin reach $100k by 2024?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">You buy</p>
                  <p className="font-bold">100 YES shares @ 65¢</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cost</p>
                  <p className="font-bold">$65</p>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-400 mb-2">Potential Outcomes:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">If YES wins:</span>
                    <span className="text-green-400 font-bold">+$35 profit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">If NO wins:</span>
                    <span className="text-red-400 font-bold">-$65 loss</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
