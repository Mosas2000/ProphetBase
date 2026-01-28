import type { NextApiRequest, NextApiResponse } from 'next';

// Example system status data
const status = {
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  services: {
    database: 'ok',
    blockchain: 'ok',
    cache: 'ok',
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(status);
}
