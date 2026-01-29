import type { NextApiRequest, NextApiResponse } from 'next';

// Example challenges data
const challenges = [
  {
    id: 'trade_5',
    title: 'Trade 5 Times',
    description: 'Complete 5 trades in any market.',
    goal: 5,
    progress: 2,
    completed: false,
    rewardXP: 50,
  },
  {
    id: 'win_3',
    title: 'Win 3 Markets',
    description: 'Win 3 prediction markets.',
    goal: 3,
    progress: 1,
    completed: false,
    rewardXP: 100,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(challenges);
}
