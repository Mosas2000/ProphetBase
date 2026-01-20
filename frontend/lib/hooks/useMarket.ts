import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts';
import { PREDICTION_MARKET_ABI } from '@/lib/abi';

/**
 * Hook to fetch a single market's data
 * @param marketId - Market ID to fetch
 * @returns Market data and loading state
 */
export function useMarket(marketId: number) {
    const { data, isLoading, isError, refetch } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(marketId)],
    });

    return {
        market: data,
        isLoading,
        isError,
        refetch,
    };
}
