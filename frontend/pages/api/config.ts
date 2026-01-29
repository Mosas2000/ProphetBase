import type { NextApiRequest, NextApiResponse } from 'next';

// Example app config and feature flags
type FeatureFlags = {
  gamification: boolean;
  referrals: boolean;
  notifications: boolean;
  pwa: boolean;
  beta: boolean;
};

const config = {
  appName: 'ProphetBase',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  featureFlags: {
    gamification: true,
    referrals: true,
    notifications: true,
    pwa: true,
    beta: false,
  } as FeatureFlags,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(config);
}
