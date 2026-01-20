'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Referral() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  // Mock referral data
  const referralCode = address ? address.slice(0, 10).toUpperCase() : '';
  const referralLink = `https://prophetbase.app/ref/${referralCode}`;
  
  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 245.50,
    pendingRewards: 45.25,
  };

  const referrals = [
    { address: '0x1234...5678', trades: 45, earned: 22.50, status: 'active' },
    { address: '0x2345...6789', trades: 32, earned: 16.00, status: 'active' },
    { address: '0x3456...7890', trades: 28, earned: 14.00, status: 'active' },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) {
    return (
      <Card>
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Referral Program</h3>
          <p className="text-gray-500 mb-4">Connect your wallet to start earning rewards</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-4">🎁 Referral Program</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Earn 5% of your referrals' trading fees forever!
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
          <div className="text-sm font-medium mb-2">Your Referral Link</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm"
            />
            <Button onClick={copyReferralLink}>
              {copied ? '✓ Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Referrals</div>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.activeReferrals}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Earned</div>
            <div className="text-2xl font-bold text-blue-600">${stats.totalEarned}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">${stats.pendingRewards}</div>
          </div>
        </div>

        <Button fullWidth className="bg-green-600 hover:bg-green-700">
          Claim ${stats.pendingRewards} Rewards
        </Button>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Your Referrals</h3>
        <div className="space-y-3">
          {referrals.map((referral, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <div className="font-mono text-sm mb-1">{referral.address}</div>
                <div className="text-xs text-gray-500">
                  {referral.trades} trades • ${referral.earned} earned
                </div>
              </div>
              <Badge variant="green">{referral.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="text-2xl">1️⃣</div>
            <div>
              <h4 className="font-semibold mb-1">Share Your Link</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your unique referral link with friends
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">2️⃣</div>
            <div>
              <h4 className="font-semibold mb-1">They Trade</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When they trade, you earn 5% of their fees
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">3️⃣</div>
            <div>
              <h4 className="font-semibold mb-1">Earn Forever</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue earning as long as they trade
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
