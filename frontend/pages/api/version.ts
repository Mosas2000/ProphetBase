import type { NextApiRequest, NextApiResponse } from 'next';

// Example version and changelog data
const versionInfo = {
  version: '1.0.0',
  build: '20260128',
  lastUpdate: '2026-01-28T12:00:00Z',
  changelog: [
    {
      version: '1.0.0',
      date: '2026-01-28',
      changes: [
        'Initial release',
        'Mobile PWA support',
        'Gamification and achievements',
        'REST API endpoints for integration',
      ],
    },
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(versionInfo);
}
