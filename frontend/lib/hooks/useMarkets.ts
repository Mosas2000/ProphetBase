import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts';
import { PREDICTION_MARKET_ABI } from '@/lib/abi';

/**
 * Hook to fetch total market count
 * @returns Market count and loading state
 */
export function useMarkets() {
    const { data: marketCount, isLoading } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'marketCount',
    });

    return {
        marketCount: marketCount ? Number(marketCount) : 0,
        isLoading,
    };
}
