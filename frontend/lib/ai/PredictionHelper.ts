/**
 * AI-powered prediction helper for market analysis
 */

interface MarketData {
  id: number;
  name: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  traders: number;
  category: string;
  endDate: string;
}

interface PredictionSuggestion {
  confidence: number;
  recommendation: 'BUY_YES' | 'BUY_NO' | 'HOLD' | 'AVOID';
  reasoning: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAmount: number;
}

interface RiskAssessment {
  overallRisk: number;
  factors: {
    volatility: number;
    liquidity: number;
    timeRemaining: number;
    marketSentiment: number;
  };
  warnings: string[];
}

/**
 * Analyze market data and provide AI-powered predictions
 */
export function analyzePredictionMarket(market: MarketData): PredictionSuggestion {
  const { yesPrice, noPrice, volume, traders, endDate } = market;

  // Calculate confidence based on multiple factors
  const liquidityScore = Math.min(volume / 100000, 1) * 100;
  const participationScore = Math.min(traders / 1000, 1) * 100;
  const priceStability = 100 - Math.abs(yesPrice - 50) * 2;
  
  const confidence = (liquidityScore * 0.4 + participationScore * 0.3 + priceStability * 0.3);

  // Determine recommendation
  let recommendation: PredictionSuggestion['recommendation'];
  const reasoning: string[] = [];

  if (yesPrice < 40 && volume > 50000) {
    recommendation = 'BUY_YES';
    reasoning.push('YES shares are undervalued based on market fundamentals');
    reasoning.push(`High trading volume (${volume.toLocaleString()}) indicates strong interest`);
  } else if (yesPrice > 70 && traders > 500) {
    recommendation = 'BUY_NO';
    reasoning.push('YES shares may be overpriced');
    reasoning.push('Consider contrarian position with NO shares');
  } else if (confidence < 50) {
    recommendation = 'AVOID';
    reasoning.push('Low confidence due to insufficient market data');
  } else {
    recommendation = 'HOLD';
    reasoning.push('Market appears fairly priced');
    reasoning.push('Wait for better entry point');
  }

  // Assess risk level
  const riskLevel = confidence > 70 ? 'LOW' : confidence > 50 ? 'MEDIUM' : 'HIGH';

  // Calculate suggested amount based on risk
  const baseAmount = 100;
  const riskMultiplier = riskLevel === 'LOW' ? 1.5 : riskLevel === 'MEDIUM' ? 1.0 : 0.5;
  const suggestedAmount = baseAmount * riskMultiplier;

  return {
    confidence: Math.round(confidence),
    recommendation,
    reasoning,
    riskLevel,
    suggestedAmount: Math.round(suggestedAmount),
  };
}

/**
 * Perform comprehensive risk assessment
 */
export function assessRisk(market: MarketData): RiskAssessment {
  const { yesPrice, volume, traders, endDate } = market;

  // Calculate individual risk factors
  const volatility = Math.abs(yesPrice - 50) / 50; // 0-1 scale
  const liquidity = Math.min(volume / 100000, 1); // 0-1 scale
  const daysRemaining = Math.max(0, (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const timeRemaining = Math.min(daysRemaining / 30, 1); // 0-1 scale
  const marketSentiment = traders / 1000; // Participation as sentiment proxy

  const factors = {
    volatility: Math.round(volatility * 100),
    liquidity: Math.round(liquidity * 100),
    timeRemaining: Math.round(timeRemaining * 100),
    marketSentiment: Math.round(Math.min(marketSentiment, 1) * 100),
  };

  // Calculate overall risk (lower is better)
  const overallRisk = Math.round(
    (volatility * 0.3 + (1 - liquidity) * 0.3 + (1 - timeRemaining) * 0.2 + (1 - Math.min(marketSentiment, 1)) * 0.2) * 100
  );

  // Generate warnings
  const warnings: string[] = [];
  if (factors.volatility > 70) warnings.push('High price volatility detected');
  if (factors.liquidity < 30) warnings.push('Low liquidity may impact trade execution');
  if (factors.timeRemaining < 20) warnings.push('Market closing soon - limited time to react');
  if (factors.marketSentiment < 30) warnings.push('Low participation may indicate uncertainty');

  return {
    overallRisk,
    factors,
    warnings,
  };
}

/**
 * Generate market insights using pattern recognition
 */
export function generateMarketInsights(markets: MarketData[]): string[] {
  const insights: string[] = [];

  // Analyze trends across markets
  const avgYesPrice = markets.reduce((sum, m) => sum + m.yesPrice, 0) / markets.length;
  const totalVolume = markets.reduce((sum, m) => sum + m.volume, 0);

  if (avgYesPrice > 60) {
    insights.push('📈 Markets are generally bullish - average YES price is ' + avgYesPrice.toFixed(0) + '¢');
  } else if (avgYesPrice < 40) {
    insights.push('📉 Markets are generally bearish - average YES price is ' + avgYesPrice.toFixed(0) + '¢');
  }

  if (totalVolume > 500000) {
    insights.push('🔥 High trading activity detected across all markets');
  }

  // Category analysis
  const categoryVolume: Record<string, number> = {};
  markets.forEach(m => {
    categoryVolume[m.category] = (categoryVolume[m.category] || 0) + m.volume;
  });

  const topCategory = Object.entries(categoryVolume).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push(`💡 ${topCategory[0]} markets are most active with $${topCategory[1].toLocaleString()} volume`);
  }

  return insights;
}
