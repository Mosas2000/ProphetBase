'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type FeatureFlags = {
  'experimental-trading': boolean;
  'new-onboarding': boolean;
  'advanced-analytics': boolean;
  'mobile-view': boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  'experimental-trading': false,
  'new-onboarding': true,
  'advanced-analytics': true,
  'mobile-view': false,
};

interface FeatureFlagContextType {
  flags: FeatureFlags;
  isEnabled: (flag: keyof FeatureFlags) => boolean;
  setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    // In a real app, fetch from a remote config service like LaunchDarkly
    const stored = localStorage.getItem('prophetbase-feature-flags');
    if (stored) {
      setFlags(JSON.parse(stored));
    }
  }, []);

  const isEnabled = (flag: keyof FeatureFlags) => flags[flag] ?? false;

  const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
    const updated = { ...flags, [flag]: value };
    setFlags(updated);
    localStorage.setItem('prophetbase-feature-flags', JSON.stringify(updated));
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isEnabled, setFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

export function Feature({ name, children, fallback = null }: { name: keyof FeatureFlags; children: ReactNode; fallback?: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(name) ? <>{children}</> : <>{fallback}</>;
}
