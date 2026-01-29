'use client';

/**
 * Service for managing social relationships and interactions
 */
export class SocialService {
  private static STORAGE_KEY = 'prophetbase-social-state';

  private static getState() {
    if (typeof window === 'undefined') return { following: [], followers: [] };
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : { following: [], followers: [] };
  }

  private static saveState(state: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  public static followUser(targetUsername: string) {
    const state = this.getState();
    if (!state.following.includes(targetUsername)) {
      state.following.push(targetUsername);
      this.saveState(state);
      this.notifyFollowers(targetUsername, true);
    }
  }

  public static unfollowUser(targetUsername: string) {
    const state = this.getState();
    state.following = state.following.filter((u: string) => u !== targetUsername);
    this.saveState(state);
    this.notifyFollowers(targetUsername, false);
  }

  public static isFollowing(username: string): boolean {
    const state = this.getState();
    return state.following.includes(username);
  }

  public static getFollowingCount(): number {
    return this.getState().following.length;
  }

  private static notifyFollowers(username: string, isFollow: boolean) {
    // In a real app, send to backend
    console.log(`[Social] ${isFollow ? 'Followed' : 'Unfollowed'} ${username}`);
  }
}

/**
 * Custom hook for following logic
 */
import { useEffect, useState } from 'react';

export function useFollow(username: string) {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setFollowing(SocialService.isFollowing(username));
  }, [username]);

  const toggleFollow = () => {
    if (following) {
      SocialService.unfollowUser(username);
      setFollowing(false);
    } else {
      SocialService.followUser(username);
      setFollowing(true);
    }
  };

  return { following, toggleFollow };
}
