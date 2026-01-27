export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  avatar: string;
  verified: boolean;
  isPublic: boolean;
  stats: TradingStats;
  badges: Badge[];
  joinedAt: number;
}

export interface TradingStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  totalVolume: number;
  averageReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
}

export class UserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  createProfile(
    userId: string,
    username: string,
    bio: string = '',
    avatar: string = ''
  ): UserProfile {
    const profile: UserProfile = {
      id: userId,
      username,
      bio,
      avatar,
      verified: false,
      isPublic: true,
      stats: {
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        totalVolume: 0,
        averageReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      },
      badges: [],
      joinedAt: Date.now(),
    };

    this.profiles.set(userId, profile);
    return profile;
  }

  updateProfile(
    userId: string,
    updates: Partial<Pick<UserProfile, 'bio' | 'avatar' | 'isPublic'>>
  ): UserProfile {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Profile not found');

    Object.assign(profile, updates);
    this.profiles.set(userId, profile);
    return profile;
  }

  updateStats(userId: string, stats: Partial<TradingStats>): void {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Profile not found');

    Object.assign(profile.stats, stats);
    this.checkAndAwardBadges(profile);
  }

  awardBadge(userId: string, badge: Omit<Badge, 'earnedAt'>): void {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Profile not found');

    const exists = profile.badges.some((b) => b.id === badge.id);
    if (!exists) {
      profile.badges.push({
        ...badge,
        earnedAt: Date.now(),
      });
    }
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  getPublicProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter((p) => p.isPublic);
  }

  togglePrivacy(userId: string): boolean {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Profile not found');

    profile.isPublic = !profile.isPublic;
    return profile.isPublic;
  }

  private checkAndAwardBadges(profile: UserProfile): void {
    if (profile.stats.totalTrades >= 100 && !this.hasBadge(profile, 'centurion')) {
      this.awardBadge(profile.id, {
        id: 'centurion',
        name: 'Centurion',
        description: '100+ trades executed',
        icon: '🏆',
      });
    }

    if (profile.stats.winRate >= 60 && !this.hasBadge(profile, 'sharpshooter')) {
      this.awardBadge(profile.id, {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: '60%+ win rate',
        icon: '🎯',
      });
    }

    if (profile.stats.totalPnL >= 100000 && !this.hasBadge(profile, 'whale')) {
      this.awardBadge(profile.id, {
        id: 'whale',
        name: 'Whale',
        description: '$100k+ total profit',
        icon: '🐋',
      });
    }
  }

  private hasBadge(profile: UserProfile, badgeId: string): boolean {
    return profile.badges.some((b) => b.id === badgeId);
  }
}
