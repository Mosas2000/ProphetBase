'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface SystemStatus {
  platform: 'OPERATIONAL' | 'DEGRADED' | 'EMERGENCY';
  trading: boolean;
  marketCreation: boolean;
  resolution: boolean;
  withdrawals: boolean;
}

export function EmergencyControls() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    platform: 'OPERATIONAL',
    trading: true,
    marketCreation: true,
    resolution: true,
    withdrawals: true,
  });

  const [pauseReason, setPauseReason] = useState('');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleEmergencyShutdown = () => {
    if (confirm('⚠️ EMERGENCY SHUTDOWN - This will pause ALL platform activity. Continue?')) {
      setSystemStatus({
        platform: 'EMERGENCY',
        trading: false,
        marketCreation: false,
        resolution: false,
        withdrawals: false,
      });
      alert('Emergency shutdown activated!');
    }
  };

  const handleResumeAll = () => {
    if (confirm('Resume all platform operations?')) {
      setSystemStatus({
        platform: 'OPERATIONAL',
        trading: true,
        marketCreation: true,
        resolution: true,
        withdrawals: true,
      });
      alert('Platform operations resumed!');
    }
  };

  const toggleFeature = (feature: keyof Omit<SystemStatus, 'platform'>) => {
    setSystemStatus({
      ...systemStatus,
      [feature]: !systemStatus[feature],
      platform: systemStatus[feature] ? 'DEGRADED' : systemStatus.platform,
    });
  };

  const getPlatformStatusColor = () => {
    switch (systemStatus.platform) {
      case 'OPERATIONAL': return 'success';
      case 'DEGRADED': return 'warning';
      case 'EMERGENCY': return 'error';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Emergency Controls</h2>
              <p className="text-sm text-gray-400 mt-1">Platform-wide system controls</p>
            </div>
            <Badge variant={getPlatformStatusColor()} className="text-lg px-4 py-2">
              {systemStatus.platform}
            </Badge>
          </div>

          {/* Emergency Actions */}
          <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-red-400 mb-4">⚠️ Emergency Actions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-red-400">Emergency Shutdown</p>
                  <p className="text-sm text-gray-400">Immediately pause all platform operations</p>
                </div>
                <Button
                  variant="error"
                  onClick={handleEmergencyShutdown}
                  disabled={systemStatus.platform === 'EMERGENCY'}
                >
                  Activate
                </Button>
              </div>

              {systemStatus.platform === 'EMERGENCY' && (
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div>
                    <p className="font-medium text-green-400">Resume Operations</p>
                    <p className="text-sm text-gray-400">Restore all platform functionality</p>
                  </div>
                  <Button
                    variant="success"
                    onClick={handleResumeAll}
                  >
                    Resume All
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Feature Controls */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Feature Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trading */}
              <Card className={!systemStatus.trading ? 'border-red-500' : 'border-green-500'}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Trading</h4>
                      <p className="text-sm text-gray-400">Buy/sell market shares</p>
                    </div>
                    <Badge variant={systemStatus.trading ? 'success' : 'error'}>
                      {systemStatus.trading ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <Button
                    variant={systemStatus.trading ? 'error' : 'success'}
                    size="sm"
                    onClick={() => toggleFeature('trading')}
                    className="w-full"
                  >
                    {systemStatus.trading ? 'Pause Trading' : 'Resume Trading'}
                  </Button>
                </div>
              </Card>

              {/* Market Creation */}
              <Card className={!systemStatus.marketCreation ? 'border-red-500' : 'border-green-500'}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Market Creation</h4>
                      <p className="text-sm text-gray-400">Create new markets</p>
                    </div>
                    <Badge variant={systemStatus.marketCreation ? 'success' : 'error'}>
                      {systemStatus.marketCreation ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <Button
                    variant={systemStatus.marketCreation ? 'error' : 'success'}
                    size="sm"
                    onClick={() => toggleFeature('marketCreation')}
                    className="w-full"
                  >
                    {systemStatus.marketCreation ? 'Pause Creation' : 'Resume Creation'}
                  </Button>
                </div>
              </Card>

              {/* Resolution */}
              <Card className={!systemStatus.resolution ? 'border-red-500' : 'border-green-500'}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Market Resolution</h4>
                      <p className="text-sm text-gray-400">Resolve market outcomes</p>
                    </div>
                    <Badge variant={systemStatus.resolution ? 'success' : 'error'}>
                      {systemStatus.resolution ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <Button
                    variant={systemStatus.resolution ? 'error' : 'success'}
                    size="sm"
                    onClick={() => toggleFeature('resolution')}
                    className="w-full"
                  >
                    {systemStatus.resolution ? 'Pause Resolution' : 'Resume Resolution'}
                  </Button>
                </div>
              </Card>

              {/* Withdrawals */}
              <Card className={!systemStatus.withdrawals ? 'border-red-500' : 'border-green-500'}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Withdrawals</h4>
                      <p className="text-sm text-gray-400">Withdraw funds</p>
                    </div>
                    <Badge variant={systemStatus.withdrawals ? 'success' : 'error'}>
                      {systemStatus.withdrawals ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <Button
                    variant={systemStatus.withdrawals ? 'error' : 'success'}
                    size="sm"
                    onClick={() => toggleFeature('withdrawals')}
                    className="w-full"
                  >
                    {systemStatus.withdrawals ? 'Pause Withdrawals' : 'Resume Withdrawals'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Pause Reason */}
          {systemStatus.platform !== 'OPERATIONAL' && (
            <Card className="border border-yellow-500">
              <div className="p-4">
                <h4 className="font-medium mb-3">Pause Reason</h4>
                <TextArea
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  placeholder="Explain why the platform or features are paused..."
                  rows={3}
                />
                <p className="text-sm text-gray-400 mt-2">
                  This message will be displayed to users on the platform
                </p>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* System Health */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">System Health</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Uptime</p>
              <p className="text-2xl font-bold text-green-400">99.9%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Active Markets</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">24h Volume</p>
              <p className="text-2xl font-bold">$125K</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Actions */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Recent Admin Actions</h3>
          
          <div className="space-y-2">
            {[
              { action: 'Trading Paused', admin: '0xAdmin...1234', time: '2024-01-20 14:30', reason: 'Scheduled maintenance' },
              { action: 'Trading Resumed', admin: '0xAdmin...1234', time: '2024-01-20 15:00', reason: 'Maintenance complete' },
              { action: 'Market #5 Resolved', admin: '0xAdmin...5678', time: '2024-01-20 12:15', reason: 'Normal resolution' },
            ].map((log, idx) => (
              <Card key={idx}>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-400">
                        By {log.admin} • {log.time}
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs">
                      {log.reason}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Warning */}
      <Card className="border border-yellow-500">
        <div className="p-6">
          <h3 className="font-semibold text-yellow-400 mb-3">⚠️ Important Notes</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              • Emergency controls should only be used in critical situations
            </p>
            <p className="text-gray-300">
              • All actions are logged and auditable
            </p>
            <p className="text-gray-300">
              • Users will be notified of any platform status changes
            </p>
            <p className="text-gray-300">
              • Always provide a clear reason when pausing features
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
