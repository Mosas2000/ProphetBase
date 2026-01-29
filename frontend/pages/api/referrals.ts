import type { NextApiRequest, NextApiResponse } from 'next';

// Example referrals data
const referrals = {
  code: 'user123-abc123',
  referredUsers: ['user456', 'user789'],
  bonusAwarded: true,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(referrals);
}
