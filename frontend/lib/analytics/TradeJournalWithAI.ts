export interface TradeEntry {
  id: string;
  timestamp: number;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  profit?: number;
  notes: string;
  tags: string[];
  emotions: string[];
  marketConditions: {
    regime: string;
    volatility: number;
    trend: string;
  };
  aiInsights?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export class TradeJournalWithAI {
  private trades: Map<string, TradeEntry> = new Map();

  addTrade(trade: Omit<TradeEntry, 'id' | 'aiInsights'>): string {
    const id = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const entry: TradeEntry = { ...trade, id };
    
    this.trades.set(id, entry);
    this.generateAIInsights(id);
    
    return id;
  }

  private generateAIInsights(tradeId: string): void {
    const trade = this.trades.get(tradeId);
    if (!trade) return;

    const insights = this.analyzeTradeWithNLP(trade);
    trade.aiInsights = insights;
  }

  private analyzeTradeWithNLP(trade: TradeEntry): TradeEntry['aiInsights'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    if (trade.profit && trade.profit > 0) {
      strengths.push('Profitable trade execution');
    } else if (trade.profit && trade.profit < 0) {
      weaknesses.push('Resulted in loss');
    }

    if (trade.notes.toLowerCase().includes('stop loss')) {
      strengths.push('Used risk management with stop loss');
    }

    if (trade.notes.toLowerCase().includes('fomo') || trade.emotions.includes('fear')) {
      weaknesses.push('Emotional trading detected');
      recommendations.push('Develop a systematic entry/exit strategy');
    }

    if (trade.marketConditions.volatility > 0.03) {
      recommendations.push('Consider reducing position size in high volatility');
    }

    const sentiment = this.extractSentiment(trade.notes);
    const summary = `Trade executed during ${trade.marketConditions.regime} market with ${sentiment} sentiment. ${trade.profit && trade.profit > 0 ? 'Positive' : 'Negative'} outcome.`;

    return { summary, strengths, weaknesses, recommendations };
  }

  private extractSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'excellent', 'confident', 'strong'];
    const negativeWords = ['bad', 'poor', 'weak', 'uncertain', 'worried'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  autoTagTrade(tradeId: string): void {
    const trade = this.trades.get(tradeId);
    if (!trade) return;

    const autoTags: string[] = [];

    if (trade.profit && trade.profit > 0) autoTags.push('winner');
    else if (trade.profit && trade.profit < 0) autoTags.push('loser');

    if (trade.marketConditions.regime === 'bull') autoTags.push('bull-market');
    else if (trade.marketConditions.regime === 'bear') autoTags.push('bear-market');

    if (trade.marketConditions.volatility > 0.03) autoTags.push('high-volatility');

    if (trade.notes.toLowerCase().includes('breakout')) autoTags.push('breakout-trade');
    if (trade.notes.toLowerCase().includes('reversal')) autoTags.push('reversal-trade');

    trade.tags = [...new Set([...trade.tags, ...autoTags])];
  }

  getTrades(filters?: {
    symbol?: string;
    action?: 'buy' | 'sell';
    tags?: string[];
    dateFrom?: number;
    dateTo?: number;
  }): TradeEntry[] {
    let trades = Array.from(this.trades.values());

    if (filters) {
      if (filters.symbol) {
        trades = trades.filter(t => t.symbol === filters.symbol);
      }
      if (filters.action) {
        trades = trades.filter(t => t.action === filters.action);
      }
      if (filters.tags && filters.tags.length > 0) {
        trades = trades.filter(t => filters.tags!.some(tag => t.tags.includes(tag)));
      }
      if (filters.dateFrom) {
        trades = trades.filter(t => t.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        trades = trades.filter(t => t.timestamp <= filters.dateTo!);
      }
    }

    return trades.sort((a, b) => b.timestamp - a.timestamp);
  }

  generatePerformanceReport(): {
    totalTrades: number;
    winRate: number;
    avgProfit: number;
    commonTags: string[];
    emotionalImpact: string;
  } {
    const trades = Array.from(this.trades.values()).filter(t => t.profit !== undefined);
    const winners = trades.filter(t => t.profit! > 0);

    const tagCounts = new Map<string, number>();
    trades.forEach(trade => {
      trade.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const commonTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    const emotionalTrades = trades.filter(t => t.emotions.length > 0);
    const emotionalImpact = emotionalTrades.length > trades.length * 0.3
      ? 'High emotional influence detected'
      : 'Disciplined trading behavior';

    return {
      totalTrades: trades.length,
      winRate: trades.length > 0 ? winners.length / trades.length : 0,
      avgProfit: trades.length > 0 ? trades.reduce((sum, t) => sum + (t.profit || 0), 0) / trades.length : 0,
      commonTags,
      emotionalImpact,
    };
  }
}
