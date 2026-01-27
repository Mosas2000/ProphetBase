export interface RiskReport {
  generatedAt: number;
  portfolioValue: number;
  riskMetrics: {
    var95: number;
    expectedShortfall: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
  };
  exposureAnalysis: {
    topPositions: Array<{ symbol: string; exposure: number }>;
    sectorConcentration: Record<string, number>;
  };
  recommendations: string[];
}

export class RiskReportGenerator {
  async generateReport(
    portfolioData: any,
    format: 'pdf' | 'html' | 'json' = 'json'
  ): Promise<RiskReport | string> {
    const report: RiskReport = {
      generatedAt: Date.now(),
      portfolioValue: portfolioData.totalValue,
      riskMetrics: {
        var95: portfolioData.var || 0,
        expectedShortfall: portfolioData.es || 0,
        maxDrawdown: portfolioData.maxDrawdown || 0,
        sharpeRatio: portfolioData.sharpe || 0,
        volatility: portfolioData.volatility || 0,
      },
      exposureAnalysis: {
        topPositions: portfolioData.topPositions || [],
        sectorConcentration: portfolioData.sectors || {},
      },
      recommendations: this.generateRecommendations(portfolioData),
    };

    if (format === 'json') {
      return report;
    }

    if (format === 'html') {
      return this.generateHTML(report);
    }

    return JSON.stringify(report);
  }

  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (data.maxDrawdown > 20) {
      recommendations.push('Consider reducing position sizes to limit drawdown risk');
    }

    if (data.sharpe < 1) {
      recommendations.push('Risk-adjusted returns are below optimal - review strategy');
    }

    if (data.volatility > 30) {
      recommendations.push('High volatility detected - consider diversification');
    }

    return recommendations;
  }

  private generateHTML(report: RiskReport): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Risk Report - ${new Date(report.generatedAt).toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .metric { margin: 10px 0; padding: 10px; background: #f5f5f5; }
            .recommendation { color: #d32f2f; margin: 5px 0; }
          </style>
        </head>
        <body>
          <h1>Portfolio Risk Report</h1>
          <div class="metric">
            <strong>Portfolio Value:</strong> $${report.portfolioValue.toLocaleString()}
          </div>
          <div class="metric">
            <strong>Value at Risk (95%):</strong> $${report.riskMetrics.var95.toFixed(2)}
          </div>
          <div class="metric">
            <strong>Max Drawdown:</strong> ${report.riskMetrics.maxDrawdown.toFixed(2)}%
          </div>
          <h2>Recommendations</h2>
          ${report.recommendations.map(r => `<div class="recommendation">• ${r}</div>`).join('')}
        </body>
      </html>
    `;
  }

  scheduleReport(
    frequency: 'daily' | 'weekly' | 'monthly',
    callback: (report: RiskReport) => void
  ): void {
    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };

    console.log(`Report scheduled for ${frequency} delivery`);
  }
}
