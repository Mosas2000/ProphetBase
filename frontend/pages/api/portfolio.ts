import type { ApiResponse, Portfolio } from '@/types/api';
import type { NextApiRequest, NextApiResponse } from 'next';

// Example portfolio data
const portfolio: Portfolio = {
  userId: 'user123',
  positions: [
    {
      marketId: '1',
      side: 'YES',
      shares: 50,
      value: 1750,
    },
    {
      marketId: '2',
      side: 'NO',
      shares: 20,
      value: 600,
    },
  ],
  totalValue: 2350,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Portfolio>>
) {
  try {
    res.status(200).json({
      data: portfolio,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch portfolio',
      success: false,
    });
  }
}
