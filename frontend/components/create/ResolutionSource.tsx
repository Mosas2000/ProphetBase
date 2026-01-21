'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface DataSource {
  id: string;
  name: string;
  type: 'API' | 'ORACLE' | 'MANUAL' | 'SOCIAL';
  description: string;
  icon: string;
  reliability: number;
}

const dataSources: DataSource[] = [
  {
    id: 'coingecko',
    name: 'CoinGecko API',
    type: 'API',
    description: 'Cryptocurrency price data from CoinGecko',
    icon: '🦎',
    reliability: 98,
  },
  {
    id: 'chainlink',
    name: 'Chainlink Oracle',
    type: 'ORACLE',
    description: 'Decentralized oracle network for reliable data',
    icon: '🔗',
    reliability: 99,
  },
  {
    id: 'coinmarketcap',
    name: 'CoinMarketCap',
    type: 'API',
    description: 'Crypto market data and rankings',
    icon: '📊',
    reliability: 97,
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    type: 'SOCIAL',
    description: 'Official announcements and verified accounts',
    icon: '🐦',
    reliability: 85,
  },
  {
    id: 'manual',
    name: 'Manual Resolution',
    type: 'MANUAL',
    description: 'Resolved by market creator with community oversight',
    icon: '👤',
    reliability: 75,
  },
];

interface ResolutionSourceProps {
  onSourceSelect?: (source: string, criteria: string) => void;
}

export function ResolutionSource({ onSourceSelect }: ResolutionSourceProps) {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [criteria, setCriteria] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [customSource, setCustomSource] = useState(false);

  const handleSelectSource = (sourceId: string) => {
    setSelectedSource(sourceId);
    setCustomSource(false);
  };

  const handleSave = () => {
    if (onSourceSelect) {
      const fullCriteria = customSource
        ? `Custom: ${criteria}`
        : `${dataSources.find(s => s.id === selectedSource)?.name}: ${criteria}`;
      onSourceSelect(selectedSource, fullCriteria);
    }
  };

  const selectedSourceData = dataSources.find(s => s.id === selectedSource);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Resolution Source</h3>
        <p className="text-sm text-gray-400">
          Specify how and where the market outcome will be determined
        </p>
      </div>

      {/* Data Sources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Select Data Source</h4>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomSource(!customSource)}
          >
            {customSource ? 'Use Preset' : 'Custom Source'}
          </Button>
        </div>

        {!customSource ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataSources.map(source => (
              <Card
                key={source.id}
                className={`cursor-pointer transition-all ${
                  selectedSource === source.id
                    ? 'border-2 border-blue-500'
                    : 'hover:border-gray-600'
                }`}
                onClick={() => handleSelectSource(source.id)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{source.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{source.name}</h5>
                        <Badge variant="default" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{source.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Reliability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${source.reliability}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{source.reliability}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-4">
              <Input
                label="Custom Source Name"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                placeholder="e.g., Official Website, Government Database"
              />
            </div>
          </Card>
        )}
      </div>

      {/* Resolution Criteria */}
      {selectedSource && (
        <Card className="border border-blue-500">
          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Resolution Criteria</h4>
              <p className="text-sm text-gray-400 mb-4">
                Provide specific, unambiguous criteria for how the market will be resolved
              </p>

              <TextArea
                label="Detailed Criteria"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder="e.g., Market resolves YES if Bitcoin price on CoinGecko exceeds $100,000 at any point before the end date. Price will be checked at market close time."
                rows={4}
              />
            </div>

            {!customSource && selectedSourceData?.type === 'API' && (
              <Input
                label="API Endpoint / Data URL (Optional)"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://api.coingecko.com/api/v3/..."
              />
            )}

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <h5 className="font-medium text-yellow-400 mb-2">⚠️ Resolution Guidelines</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Be specific about the exact metric and threshold</li>
                <li>• Specify the exact time when the outcome will be checked</li>
                <li>• Account for edge cases and potential ambiguities</li>
                <li>• Link to the exact data source when possible</li>
              </ul>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Resolution Source
            </Button>
          </div>
        </Card>
      )}

      {/* Examples */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Good Resolution Criteria Examples</h4>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Badge variant="success">✓ Good</Badge>
                <p className="text-sm font-medium">Price Prediction</p>
              </div>
              <p className="text-sm text-gray-400">
                "Resolves YES if Bitcoin price on CoinGecko (BTC/USD) is $100,000 or higher at market close time (UTC). 
                Price will be taken from the CoinGecko API endpoint at the exact close time."
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Badge variant="success">✓ Good</Badge>
                <p className="text-sm font-medium">Event Outcome</p>
              </div>
              <p className="text-sm text-gray-400">
                "Resolves YES if Apple officially announces Vision Pro launch date via press release or earnings call 
                before market close. Announcement must be from official Apple channels."
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Badge variant="error">✗ Bad</Badge>
                <p className="text-sm font-medium">Vague Criteria</p>
              </div>
              <p className="text-sm text-gray-400">
                "Resolves YES if Bitcoin goes up a lot."
                <span className="block mt-1 text-red-400 text-xs">
                  ❌ Too vague - no specific price, source, or timeframe
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Oracle Integration */}
      {selectedSourceData?.type === 'ORACLE' && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">🔗 Oracle Integration</h4>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">
                Chainlink oracles provide decentralized, tamper-proof data feeds for automatic market resolution.
              </p>
              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
                <p className="font-medium mb-2">Benefits:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>✓ Automatic resolution - no manual intervention needed</li>
                  <li>✓ Trustless and verifiable on-chain</li>
                  <li>✓ Eliminates resolution disputes</li>
                  <li>✓ Real-time price feeds from multiple sources</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
