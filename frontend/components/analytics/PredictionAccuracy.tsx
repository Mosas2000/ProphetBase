'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAccount } from 'wagmi';

export default function PredictionAccuracy() {
  const { address } = useAccount();

  // Mock prediction accuracy data
  const calibrationData = [
    { predicted: 10, actual: 12, count: 15 },
    { predicted: 30, actual: 28, count: 22 },
    { predicted: 50, actual: 52, count: 35 },
    { predicted: 70, actual: 68, count: 28 },
    { predicted: 90, actual: 88, count: 18 },
  ];

  const accuracyScore = 78.5;
  const totalPredictions = 118;
  const wellCalibrated = calibrationData.filter(d => Math.abs(d.predicted - d.actual) <= 5).length;

  const suggestions = [
    {
      icon: '📊',
      title: 'Overconfident on High Probabilities',
      description: 'You tend to be too confident when predicting 70%+ outcomes. Consider being more conservative.',
      impact: 'Medium',
    },
    {
      icon: '🎯',
      title: 'Well Calibrated at 50%',
      description: 'Your predictions around 50% probability are very accurate. Keep up the good work!',
      impact: 'Positive',
    },
    {
      icon: '💡',
      title: 'Diversify Your Predictions',
      description: 'Try making more predictions in the 20-40% range to improve overall calibration.',
      impact: 'Low',
    },
  ];

  if (!address) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">Connect wallet to view prediction accuracy</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Prediction Accuracy</h2>

        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Calibration Score</span>
            <span className="text-3xl font-bold text-blue-600">{accuracyScore}%</span>
          </div>
          <ProgressBar value={accuracyScore} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">
            Based on {totalPredictions} predictions • {wellCalibrated}/{calibrationData.length} ranges well-calibrated
          </p>
        </div>

        {/* Calibration Curve */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Calibration Curve</h3>
          <div className="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            {/* Perfect calibration line */}
            <svg className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)]">
              <line
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="text-gray-400"
              />
              
              {/* Actual calibration line */}
              <polyline
                points={calibrationData
                  .map((d, i) => `${(i / (calibrationData.length - 1)) * 100}%,${100 - d.actual}%`)
                  .join(' ')}
                fill="none"
                stroke="#0052FF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {calibrationData.map((d, i) => (
                <circle
                  key={i}
                  cx={`${(i / (calibrationData.length - 1)) * 100}%`}
                  cy={`${100 - d.actual}%`}
                  r="5"
                  fill="#0052FF"
                  className="cursor-pointer hover:r-7"
                />
              ))}
            </svg>

            {/* Axis labels */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500">
              Actual Outcome %
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-500">
              Predicted Probability %
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Closer to the diagonal line = better calibration
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
        <div className="space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{suggestion.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <Badge
                      variant={
                        suggestion.impact === 'Positive' ? 'green' :
                        suggestion.impact === 'Medium' ? 'yellow' : 'gray'
                      }
                    >
                      {suggestion.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
