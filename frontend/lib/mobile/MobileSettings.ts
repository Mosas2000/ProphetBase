/**
 * MobileSettings - Utility for mobile settings and preferences management
 * Features:
 * - Get/set user settings (theme, notifications, privacy)
 * - Persist settings in localStorage
 * - Reset settings to default
 */

export type MobileSettingsType = {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  privacyMode: boolean;
};

const DEFAULT_SETTINGS: MobileSettingsType = {
  theme: 'system',
  notifications: true,
  privacyMode: false,
};

export class MobileSettings {
  static get(): MobileSettingsType {
    try {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(localStorage.getItem('mobile_settings') || '{}'),
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static set(settings: Partial<MobileSettingsType>) {
    const current = MobileSettings.get();
    const updated = { ...current, ...settings };
    localStorage.setItem('mobile_settings', JSON.stringify(updated));
  }

  static reset() {
    localStorage.setItem('mobile_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
}
