// API Response Types

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
}

export interface PortfolioPosition {
  marketId: string;
  side: 'YES' | 'NO';
  shares: number;
  value: number;
}

export interface Portfolio {
  userId: string;
  positions: PortfolioPosition[];
  totalValue: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}
