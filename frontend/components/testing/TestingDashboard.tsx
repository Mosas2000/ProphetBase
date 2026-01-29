'use client';

import { useEffect, useState } from 'react';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
}

interface TestMetrics {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
}

export default function TestingDashboard() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = async () => {
    try {
      // In a real implementation, this would fetch from a test results API
      // For now, we'll use mock data
      const mockSuites: TestSuite[] = [
        {
          name: 'Component Tests',
          tests: [
            { id: '1', name: 'MarketCard renders correctly', status: 'passed', duration: 45 },
            { id: '2', name: 'StatsDashboard displays data', status: 'passed', duration: 32 },
            { id: '3', name: 'CommandPalette opens on Ctrl+K', status: 'passed', duration: 28 },
          ],
          coverage: { lines: 85, functions: 78, branches: 72, statements: 84 },
        },
        {
          name: 'API Tests',
          tests: [
            { id: '4', name: 'Fetch markets endpoint', status: 'passed', duration: 156 },
            { id: '5', name: 'Create market validation', status: 'failed', duration: 89, error: 'Validation error' },
            { id: '6', name: 'User authentication', status: 'passed', duration: 234 },
          ],
          coverage: { lines: 92, functions: 88, branches: 85, statements: 91 },
        },
        {
          name: 'Visual Regression',
          tests: [
            { id: '7', name: 'Homepage screenshot', status: 'passed', duration: 1234 },
            { id: '8', name: 'Dark mode comparison', status: 'passed', duration: 1456 },
            { id: '9', name: 'Mobile viewport', status: 'skipped', duration: 0 },
          ],
          coverage: { lines: 0, functions: 0, branches: 0, statements: 0 },
        },
      ];

      setTestSuites(mockSuites);

      // Calculate overall metrics
      const allTests = mockSuites.flatMap(suite => suite.tests);
      const totalDuration = allTests.reduce((sum, test) => sum + test.duration, 0);
      
      setMetrics({
        totalTests: allTests.length,
        passed: allTests.filter(t => t.status === 'passed').length,
        failed: allTests.filter(t => t.status === 'failed').length,
        skipped: allTests.filter(t => t.status === 'skipped').length,
        duration: totalDuration,
        coverage: {
          lines: 87,
          functions: 82,
          branches: 76,
          statements: 86,
        },
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to load test results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading test results...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">No test results available</div>
      </div>
    );
  }

  const successRate = ((metrics.passed / metrics.totalTests) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Testing Dashboard
        </h1>
        <button
          onClick={loadTestResults}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tests</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalTests}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Success Rate</div>
          <div className="text-3xl font-bold text-green-600">{successRate}%</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Failed</div>
          <div className="text-3xl font-bold text-red-600">{metrics.failed}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {(metrics.duration / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Code Coverage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics.coverage).map(([key, value]) => (
            <div key={key}>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{key}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Suites */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Suites</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {testSuites.map((suite) => (
            <div key={suite.name} className="p-6">
              <button
                onClick={() => setSelectedSuite(selectedSuite === suite.name ? null : suite.name)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{suite.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-green-600">
                      ✓ {suite.tests.filter(t => t.status === 'passed').length} passed
                    </span>
                    <span className="text-red-600">
                      ✗ {suite.tests.filter(t => t.status === 'failed').length} failed
                    </span>
                    <span className="text-gray-500">
                      ⊘ {suite.tests.filter(t => t.status === 'skipped').length} skipped
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedSuite === suite.name ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {selectedSuite === suite.name && (
                <div className="mt-4 space-y-2">
                  {suite.tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '⊘'}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {test.name}
                          </div>
                          {test.error && (
                            <div className="text-xs text-red-600 mt-1">{test.error}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{test.duration}ms</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
