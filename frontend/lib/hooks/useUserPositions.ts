import { useReadContract, useAccount } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts';
import { PREDICTION_MARKET_ABI } from '@/lib/abi';

/**
 * Hook to fetch user's positions in a market
 * @param marketId - Market ID
 * @returns User's YES and NO share balances
 */
export function useUserPositions(marketId: number) {
    const { address } = useAccount();

    const { data: yesShares, isLoading: isLoadingYes } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'getUserShares',
        args: address ? [BigInt(marketId), address, true] : undefined,
    });

    const { data: noShares, isLoading: isLoadingNo } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'getUserShares',
        args: address ? [BigInt(marketId), address, false] : undefined,
    });

    return {
        yesShares: yesShares || BigInt(0),
        noShares: noShares || BigInt(0),
        isLoading: isLoadingYes || isLoadingNo,
    };
}
