export interface ActivityPost {
  id: string;
  userId: string;
  type: 'trade' | 'idea' | 'comment';
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  tags: string[];
}

export interface TradingIdea {
  id: string;
  userId: string;
  symbol: string;
  direction: 'bullish' | 'bearish';
  entry: number;
  target: number;
  stopLoss: number;
  rationale: string;
  timestamp: number;
  votes: number;
}

export class SocialFeedService {
  private posts: ActivityPost[] = [];
  private following: Map<string, Set<string>> = new Map();

  getFeed(userId: string, filters?: {
    type?: string;
    tags?: string[];
  }): ActivityPost[] {
    const followedUsers = this.following.get(userId) || new Set();
    let feed = this.posts.filter((post) =>
      followedUsers.has(post.userId) || post.userId === userId
    );

    if (filters?.type) {
      feed = feed.filter((post) => post.type === filters.type);
    }

    if (filters?.tags?.length) {
      feed = feed.filter((post) =>
        filters.tags!.some((tag) => post.tags.includes(tag))
      );
    }

    return feed.sort((a, b) => b.timestamp - a.timestamp);
  }

  getTrending(limit: number = 10): ActivityPost[] {
    return [...this.posts]
      .sort((a, b) => {
        const scoreA = a.likes * 2 + a.comments;
        const scoreB = b.likes * 2 + b.comments;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  follow(followerId: string, followeeId: string): void {
    if (!this.following.has(followerId)) {
      this.following.set(followerId, new Set());
    }
    this.following.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: string, followeeId: string): void {
    this.following.get(followerId)?.delete(followeeId);
  }
}
