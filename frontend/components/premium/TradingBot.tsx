'use client';

import { useState } from 'react';

interface Strategy {
  id: string;
  name: string;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
  performance: {
    trades: number;
    winRate: number;
    profit: number;
  };
}

interface Condition {
  type: 'price' | 'volume' | 'time' | 'indicator';
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: string;
}

interface Action {
  type: 'buy' | 'sell';
  amount: string;
  marketId: number;
}

export default function TradingBot() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [backtestResults, setBacktestResults] = useState<any>(null);

  const addCondition = () => {
    setConditions([...conditions, { type: 'price', operator: '>', value: '' }]);
  };

  const addAction = () => {
    setActions([...actions, { type: 'buy', amount: '', marketId: 0 }]);
  };

  const createStrategy = () => {
    if (!strategyName || conditions.length === 0 || actions.length === 0) {
      alert('Please complete all fields');
      return;
    }

    const newStrategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: strategyName,
      conditions,
      actions,
      isActive: false,
      performance: { trades: 0, winRate: 0, profit: 0 },
    };

    setStrategies([...strategies, newStrategy]);
    setShowBuilder(false);
    setStrategyName('');
    setConditions([]);
    setActions([]);
  };

  const toggleStrategy = (id: string) => {
    setStrategies(
      strategies.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const runBacktest = async (strategyId: string) => {
    // Simulate backtesting
    setBacktestResults({
      totalTrades: 156,
      winRate: 68.5,
      profit: 1234.56,
      maxDrawdown: -234.12,
      sharpeRatio: 2.34,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Bot</h1>
          <p className="text-gray-600">
            Automate your trading with custom strategies
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + New Strategy
        </button>
      </div>

      {showBuilder && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-500">
          <h2 className="text-xl font-bold mb-4">Strategy Builder</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy Name
            </label>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Strategy"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Conditions
              </label>
              <button
                onClick={addCondition}
                className="text-blue-600 text-sm hover:text-blue-700"
              >
                + Add Condition
              </button>
            </div>
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={cond.type}
                  onChange={(e) => {
                    const newConds = [...conditions];
                    newConds[idx].type = e.target.value as any;
                    setConditions(newConds);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="price">Price</option>
                  <option value="volume">Volume</option>
                  <option value="time">Time</option>
                  <option value="indicator">Indicator</option>
                </select>
                <select
                  value={cond.operator}
                  onChange={(e) => {
                    const newConds = [...conditions];
                    newConds[idx].operator = e.target.value as any;
                    setConditions(newConds);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value="=">{'='}</option>
                  <option value=">=">{'>='}</option>
                  <option value="<=">{'<='}</option>
                </select>
                <input
                  type="text"
                  value={cond.value}
                  onChange={(e) => {
                    const newConds = [...conditions];
                    newConds[idx].value = e.target.value;
                    setConditions(newConds);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Value"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Actions
              </label>
              <button
                onClick={addAction}
                className="text-blue-600 text-sm hover:text-blue-700"
              >
                + Add Action
              </button>
            </div>
            {actions.map((action, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={action.type}
                  onChange={(e) => {
                    const newActions = [...actions];
                    newActions[idx].type = e.target.value as any;
                    setActions(newActions);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
                <input
                  type="number"
                  value={action.amount}
                  onChange={(e) => {
                    const newActions = [...actions];
                    newActions[idx].amount = e.target.value;
                    setActions(newActions);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Amount"
                />
                <input
                  type="number"
                  value={action.marketId}
                  onChange={(e) => {
                    const newActions = [...actions];
                    newActions[idx].marketId = parseInt(e.target.value);
                    setActions(newActions);
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Market"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={createStrategy}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Strategy
            </button>
            <button
              onClick={() => setShowBuilder(false)}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {strategy.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {strategy.conditions.length} conditions •{' '}
                  {strategy.actions.length} actions
                </p>
              </div>
              <button
                onClick={() => toggleStrategy(strategy.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  strategy.isActive
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {strategy.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {strategy.performance.trades}
                </p>
                <p className="text-sm text-gray-600">Trades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {strategy.performance.winRate}%
                </p>
                <p className="text-sm text-gray-600">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${strategy.performance.profit.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Profit</p>
              </div>
            </div>

            <button
              onClick={() => runBacktest(strategy.id)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Run Backtest
            </button>
          </div>
        ))}
      </div>

      {backtestResults && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
          <h2 className="text-xl font-bold mb-4">Backtest Results</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {backtestResults.totalTrades}
              </p>
              <p className="text-sm text-gray-600">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {backtestResults.winRate}%
              </p>
              <p className="text-sm text-gray-600">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${backtestResults.profit}
              </p>
              <p className="text-sm text-gray-600">Total Profit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                ${backtestResults.maxDrawdown}
              </p>
              <p className="text-sm text-gray-600">Max Drawdown</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {backtestResults.sharpeRatio}
              </p>
              <p className="text-sm text-gray-600">Sharpe Ratio</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
