import type { NextApiRequest, NextApiResponse } from 'next';

// Example portfolio data
const portfolio = {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(portfolio);
}
