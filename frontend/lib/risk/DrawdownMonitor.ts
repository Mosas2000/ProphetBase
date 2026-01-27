export interface DrawdownPeriod {
  start: number;
  end: number;
  depth: number;
  duration: number;
  recovered: boolean;
}

export class DrawdownMonitor {
  calculateCurrentDrawdown(
    currentValue: number,
    peakValue: number
  ): number {
    return ((peakValue - currentValue) / peakValue) * 100;
  }

  findDrawdownPeriods(equityCurve: Array<{ timestamp: number; value: number }>): DrawdownPeriod[] {
    const periods: DrawdownPeriod[] = [];
    let peak = equityCurve[0];
    let drawdownStart: typeof peak | null = null;

    for (let i = 1; i < equityCurve.length; i++) {
      const current = equityCurve[i];

      if (current.value > peak.value) {
        if (drawdownStart) {
          const depth = ((peak.value - equityCurve[i - 1].value) / peak.value) * 100;
          periods.push({
            start: drawdownStart.timestamp,
            end: current.timestamp,
            depth,
            duration: current.timestamp - drawdownStart.timestamp,
            recovered: true,
          });
          drawdownStart = null;
        }
        peak = current;
      } else if (!drawdownStart && current.value < peak.value) {
        drawdownStart = current;
      }
    }

    if (drawdownStart) {
      const lastValue = equityCurve[equityCurve.length - 1];
      const depth = ((peak.value - lastValue.value) / peak.value) * 100;
      periods.push({
        start: drawdownStart.timestamp,
        end: lastValue.timestamp,
        depth,
        duration: lastValue.timestamp - drawdownStart.timestamp,
        recovered: false,
      });
    }

    return periods;
  }

  estimateRecoveryTime(
    currentDrawdown: number,
    avgMonthlyReturn: number
  ): number {
    if (avgMonthlyReturn <= 0) return Infinity;
    const requiredGrowth = 1 / (1 - currentDrawdown / 100) - 1;
    return Math.log(1 + requiredGrowth) / Math.log(1 + avgMonthlyReturn);
  }

  getMaxDrawdown(periods: DrawdownPeriod[]): DrawdownPeriod | null {
    if (periods.length === 0) return null;
    return periods.reduce((max, period) =>
      period.depth > max.depth ? period : max
    );
  }
}
