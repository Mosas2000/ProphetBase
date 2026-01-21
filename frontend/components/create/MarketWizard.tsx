'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface MarketData {
  question: string;
  description: string;
  category: string;
  endDate: string;
  resolutionSource: string;
  initialLiquidity: number;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { id: 1, title: 'Question', description: 'Define your prediction market question' },
  { id: 2, title: 'Details', description: 'Add description and category' },
  { id: 3, title: 'Duration', description: 'Set market end date' },
  { id: 4, title: 'Resolution', description: 'Specify how the market will be resolved' },
  { id: 5, title: 'Liquidity', description: 'Set initial liquidity' },
  { id: 6, title: 'Review', description: 'Preview and confirm' },
];

export function MarketWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [marketData, setMarketData] = useState<MarketData>({
    question: '',
    description: '',
    category: '',
    endDate: '',
    resolutionSource: '',
    initialLiquidity: 100,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MarketData, string>>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof MarketData, string>> = {};

    switch (step) {
      case 1:
        if (!marketData.question.trim()) {
          newErrors.question = 'Question is required';
        } else if (marketData.question.length < 10) {
          newErrors.question = 'Question must be at least 10 characters';
        }
        break;
      case 2:
        if (!marketData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        if (!marketData.category) {
          newErrors.category = 'Category is required';
        }
        break;
      case 3:
        if (!marketData.endDate) {
          newErrors.endDate = 'End date is required';
        } else if (new Date(marketData.endDate) <= new Date()) {
          newErrors.endDate = 'End date must be in the future';
        }
        break;
      case 4:
        if (!marketData.resolutionSource.trim()) {
          newErrors.resolutionSource = 'Resolution source is required';
        }
        break;
      case 5:
        if (marketData.initialLiquidity < 10) {
          newErrors.initialLiquidity = 'Minimum liquidity is $10';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(5)) {
      // Submit market creation
      console.log('Creating market:', marketData);
      alert('Market created successfully!');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Input
                label="Market Question"
                value={marketData.question}
                onChange={(e) => setMarketData({ ...marketData, question: e.target.value })}
                placeholder="Will Bitcoin reach $100,000 by the end of 2024?"
                error={errors.question}
              />
              <p className="text-xs text-gray-400 mt-2">
                💡 Tip: Make your question clear, specific, and answerable with YES or NO
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <h4 className="font-medium mb-2">Good Question Examples:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Will ETH price exceed $5,000 by March 31, 2024?</li>
                <li>✓ Will the next Bitcoin halving occur before May 2024?</li>
                <li>✓ Will Ethereum 2.0 launch in Q1 2024?</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <TextArea
              label="Description"
              value={marketData.description}
              onChange={(e) => setMarketData({ ...marketData, description: e.target.value })}
              placeholder="Provide detailed context and resolution criteria..."
              rows={5}
              error={errors.description}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {['Crypto', 'Sports', 'Politics', 'Technology', 'Finance', 'Entertainment'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMarketData({ ...marketData, category: cat })}
                    className={`p-3 rounded-lg border transition-colors ${
                      marketData.category === cat
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Input
              label="Market End Date"
              type="datetime-local"
              value={marketData.endDate}
              onChange={(e) => setMarketData({ ...marketData, endDate: e.target.value })}
              error={errors.endDate}
            />

            <div>
              <p className="text-sm font-medium mb-2">Quick Presets</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '1 Day', days: 1 },
                  { label: '1 Week', days: 7 },
                  { label: '1 Month', days: 30 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() + preset.days);
                      setMarketData({ ...marketData, endDate: date.toISOString().slice(0, 16) });
                    }}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors text-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <TextArea
              label="Resolution Source"
              value={marketData.resolutionSource}
              onChange={(e) => setMarketData({ ...marketData, resolutionSource: e.target.value })}
              placeholder="e.g., CoinGecko API, Official announcement, Chainlink oracle..."
              rows={4}
              error={errors.resolutionSource}
            />

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <p className="text-sm text-yellow-400">
                ⚠️ Be specific about how and when the market will be resolved. This helps prevent disputes.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Input
              label="Initial Liquidity ($)"
              type="number"
              value={marketData.initialLiquidity}
              onChange={(e) => setMarketData({ ...marketData, initialLiquidity: parseFloat(e.target.value) })}
              error={errors.initialLiquidity}
            />

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-3">Liquidity Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Contribution:</span>
                  <span className="font-medium">${marketData.initialLiquidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Trading Fee (0.5%):</span>
                  <span className="font-medium">${(marketData.initialLiquidity * 0.005).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your LP Share:</span>
                  <span className="font-medium text-green-400">100%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Card className="border border-blue-500">
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">{marketData.question}</h4>
                  <Badge variant="default">{marketData.category}</Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-sm">{marketData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">End Date</p>
                    <p className="text-sm font-medium">
                      {new Date(marketData.endDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Initial Liquidity</p>
                    <p className="text-sm font-medium">${marketData.initialLiquidity}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Resolution Source</p>
                  <p className="text-sm">{marketData.resolutionSource}</p>
                </div>
              </div>
            </Card>

            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <p className="text-sm text-green-400">
                ✓ Everything looks good! Click "Create Market" to publish.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Create Prediction Market</h2>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep >= step.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {step.id}
                    </div>
                    <p className={`text-xs mt-2 text-center ${
                      currentStep >= step.id ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-colors ${
                        currentStep > step.id ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Market
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
