/**
 * Calculates potential payout for a market position
 * @param shares - Number of shares owned
 * @param sharePrice - Current price per share (in cents, 0-100)
 * @param isWinning - Whether this is the winning outcome
 * @returns Payout amount in dollars
 */
export function calculatePayout(
    shares: bigint | number,
    sharePrice: number,
    isWinning: boolean
): number {
    if (!isWinning) return 0;

    const numShares = Number(shares);
    // Each winning share is worth $1.00
    return numShares * 1.0;
}

/**
 * Calculates potential profit for a market position
 * @param shares - Number of shares owned
 * @param purchasePrice - Price paid per share (in cents)
 * @param currentPrice - Current price per share (in cents)
 * @returns Profit/loss amount in dollars
 */
export function calculateProfit(
    shares: bigint | number,
    purchasePrice: number,
    currentPrice: number
): number {
    const numShares = Number(shares);
    const costBasis = (numShares * purchasePrice) / 100;
    const currentValue = (numShares * currentPrice) / 100;

    return currentValue - costBasis;
}
