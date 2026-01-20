/**
 * Market status enum
 */
export enum MarketStatus {
    Open = 0,
    Resolved = 1,
    Cancelled = 2,
}

/**
 * Validates if a market is open for trading
 * @param status - Market status
 * @param endTime - Market end timestamp
 * @returns True if market is open
 */
export function isMarketOpen(status: number, endTime: bigint | number): boolean {
    if (status !== MarketStatus.Open) return false;

    const endTimestamp = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    const now = Math.floor(Date.now() / 1000);

    return endTimestamp > now;
}

/**
 * Validates if a market can be resolved
 * @param status - Market status
 * @param endTime - Market end timestamp
 * @returns True if market can be resolved
 */
export function canResolveMarket(status: number, endTime: bigint | number): boolean {
    if (status !== MarketStatus.Open) return false;

    const endTimestamp = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    const now = Math.floor(Date.now() / 1000);

    return endTimestamp <= now;
}
