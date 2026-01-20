interface MarketProbabilityProps {
    yesShares: bigint;
    noShares: bigint;
}

export default function MarketProbability({ yesShares, noShares }: MarketProbabilityProps) {
    const total = Number(yesShares) + Number(noShares);
    const yesPercent = total === 0 ? 50 : Math.round((Number(yesShares) / total) * 100);
    const noPercent = 100 - yesPercent;

    return (
        <div className="flex gap-2">
            <div className={`
                flex-1 p-3 rounded-lg border text-center transition-colors
                bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800
            `}>
                <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">YES</div>
                <div className="text-xl font-bold text-green-800 dark:text-green-300">{yesPercent}%</div>
            </div>

            <div className={`
                flex-1 p-3 rounded-lg border text-center transition-colors
                bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800
            `}>
                <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">NO</div>
                <div className="text-xl font-bold text-red-800 dark:text-red-300">{noPercent}%</div>
            </div>
        </div>
    );
}
