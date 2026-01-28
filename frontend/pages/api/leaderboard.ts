import type { NextApiRequest, NextApiResponse } from 'next';

// Example leaderboard data
const leaderboard = [
  {
    userId: '1',
    username: 'Alice',
    xp: 1200,
    streak: 5,
    level: 3,
    badges: ['first_trade'],
  },
  {
    userId: '2',
    username: 'Bob',
    xp: 900,
    streak: 7,
    level: 2,
    badges: ['volume_1k'],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(leaderboard);
}
