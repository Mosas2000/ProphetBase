import type { NextApiRequest, NextApiResponse } from 'next';
import type { Achievement, ApiResponse } from '@/types/api';

// Example achievements data
const achievements: Achievement[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Completed your first trade',
    icon: '🎉',
    xp: 100,
  },
  {
    id: 'volume_1k',
    name: 'Volume 1K',
    description: 'Traded over $1,000',
    icon: '💰',
    xp: 200,
  },
  {
    id: 'markets_10',
    name: 'Market Explorer',
    description: 'Participated in 10 markets',
    icon: '🧭',
    xp: 300,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Achievement[]>>) {
  try {
    res.status(200).json({
      data: achievements,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch achievements',
      success: false,
    });
  }
}
