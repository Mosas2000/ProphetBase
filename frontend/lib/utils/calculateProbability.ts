/**
 * Calculates probability percentage from YES and NO shares
 * @param yesShares - Number of YES shares
 * @param noShares - Number of NO shares
 * @returns Object with yesPercent and noPercent (0-100)
 */
export function calculateProbability(
    yesShares: bigint | number,
    noShares: bigint | number
): { yesPercent: number; noPercent: number } {
    const yes = Number(yesShares);
    const no = Number(noShares);
    const total = yes + no;

    if (total === 0) {
        return { yesPercent: 50, noPercent: 50 };
    }

    const yesPercent = Math.round((yes / total) * 100);
    const noPercent = 100 - yesPercent;

    return { yesPercent, noPercent };
}
