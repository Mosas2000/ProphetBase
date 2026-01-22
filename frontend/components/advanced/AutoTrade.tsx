'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface TradingRule {
  id: string;
  name: string;
  condition: {
    type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'VOLUME_ABOVE' | 'TIME_BEFORE';
    value: number;
  };
  action: {
    type: 'BUY_YES' | 'BUY_NO' | 'SELL_YES' | 'SELL_NO';
    amount: number;
  };
  enabled: boolean;
}

interface AutoTradeProps {
  marketId: number;
  marketName: string;
  currentPrice: number;
}

export function AutoTrade({ marketId, marketName, currentPrice }: AutoTradeProps) {
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    conditionType: 'PRICE_ABOVE' as TradingRule['condition']['type'],
    conditionValue: 0,
    actionType: 'BUY_YES' as TradingRule['action']['type'],
    actionAmount: 0,
  });

  const handleCreateRule = () => {
    const rule: TradingRule = {
      id: Date.now().toString(),
      name: newRule.name,
      condition: {
        type: newRule.conditionType,
        value: newRule.conditionValue,
      },
      action: {
        type: newRule.actionType,
        amount: newRule.actionAmount,
      },
      enabled: true,
    };

    setRules([...rules, rule]);
    setIsCreating(false);
    setNewRule({
      name: '',
      conditionType: 'PRICE_ABOVE',
      conditionValue: 0,
      actionType: 'BUY_YES',
      actionAmount: 0,
    });
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const getConditionText = (rule: TradingRule) => {
    switch (rule.condition.type) {
      case 'PRICE_ABOVE':
        return `Price rises above ${rule.condition.value}¢`;
      case 'PRICE_BELOW':
        return `Price falls below ${rule.condition.value}¢`;
      case 'VOLUME_ABOVE':
        return `Volume exceeds $${rule.condition.value.toLocaleString()}`;
      case 'TIME_BEFORE':
        return `${rule.condition.value} hours before close`;
    }
  };

  const getActionText = (rule: TradingRule) => {
    const action = rule.action.type.replace('_', ' ');
    return `${action} $${rule.action.amount}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Automated Trading</h3>
              <p className="text-sm text-gray-400 mt-1">{marketName}</p>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              + New Rule
            </Button>
          </div>

          {/* Current Market Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Current YES Price</p>
                <p className="text-2xl font-bold text-green-400">{currentPrice}¢</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Rules</p>
                <p className="text-2xl font-bold">
                  {rules.filter(r => r.enabled).length}/{rules.length}
                </p>
              </div>
            </div>
          </div>

          {/* Create New Rule */}
          {isCreating && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Create Trading Rule</h4>
                
                <Input
                  label="Rule Name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Buy when undervalued"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Condition"
                    value={newRule.conditionType}
                    onChange={(e) => setNewRule({ ...newRule, conditionType: e.target.value as any })}
                  >
                    <option value="PRICE_ABOVE">Price Above</option>
                    <option value="PRICE_BELOW">Price Below</option>
                    <option value="VOLUME_ABOVE">Volume Above</option>
                    <option value="TIME_BEFORE">Time Before Close</option>
                  </Select>

                  <Input
                    label="Value"
                    type="number"
                    value={newRule.conditionValue}
                    onChange={(e) => setNewRule({ ...newRule, conditionValue: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Action"
                    value={newRule.actionType}
                    onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value as any })}
                  >
                    <option value="BUY_YES">Buy YES</option>
                    <option value="BUY_NO">Buy NO</option>
                    <option value="SELL_YES">Sell YES</option>
                    <option value="SELL_NO">Sell NO</option>
                  </Select>

                  <Input
                    label="Amount ($)"
                    type="number"
                    value={newRule.actionAmount}
                    onChange={(e) => setNewRule({ ...newRule, actionAmount: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateRule} disabled={!newRule.name || !newRule.conditionValue || !newRule.actionAmount}>
                    Create Rule
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Active Rules */}
          <div className="space-y-3">
            {rules.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No trading rules configured</p>
                <p className="text-sm mt-2">Create your first rule to automate trading</p>
              </div>
            ) : (
              rules.map(rule => (
                <Card key={rule.id} className={!rule.enabled ? 'opacity-50' : ''}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{rule.name}</h4>
                          <Badge variant={rule.enabled ? 'success' : 'default'}>
                            {rule.enabled ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-gray-400">
                            <span className="text-blue-400">When:</span> {getConditionText(rule)}
                          </p>
                          <p className="text-gray-400">
                            <span className="text-green-400">Then:</span> {getActionText(rule)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleRule(rule.id)}
                        >
                          {rule.enabled ? 'Pause' : 'Resume'}
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => deleteRule(rule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Strategy Templates */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Strategy Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Value Buying</h5>
              <p className="text-sm text-gray-400">Buy YES when price drops below 40¢</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Profit Taking</h5>
              <p className="text-sm text-gray-400">Sell YES when price rises above 70¢</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Stop Loss</h5>
              <p className="text-sm text-gray-400">Sell if price drops 20% from entry</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Last Minute</h5>
              <p className="text-sm text-gray-400">Execute trade 1 hour before close</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
