import type { NextApiRequest, NextApiResponse } from 'next';

// Example notifications data
const notifications = [
  {
    id: 'notif1',
    type: 'achievement',
    message: 'You earned the "First Trade" badge!',
    read: false,
    timestamp: '2026-01-28T10:00:00Z',
  },
  {
    id: 'notif2',
    type: 'market',
    message: 'Market ETH > $3500 by March is closing soon!',
    read: false,
    timestamp: '2026-01-28T09:00:00Z',
  },
  {
    id: 'notif3',
    type: 'reward',
    message: 'Referral bonus awarded: +100 XP',
    read: true,
    timestamp: '2026-01-27T18:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(notifications);
}
