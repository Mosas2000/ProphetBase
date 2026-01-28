import type { NextApiRequest, NextApiResponse } from 'next';

// Example market data
const markets = [
  {
    id: '1',
    name: 'ETH > $3500 by March',
    status: 'active',
    volume: 12000,
    endTime: '2026-03-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'BTC < $40k by April',
    status: 'active',
    volume: 8000,
    endTime: '2026-04-01T00:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(markets);
}
