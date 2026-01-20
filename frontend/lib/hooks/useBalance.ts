import { useBalance as useWagmiBalance, useAccount } from 'wagmi';

/**
 * Hook to fetch user's ETH balance
 * @returns Balance data and loading state
 */
export function useBalance() {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useWagmiBalance({
        address,
    });

    return {
        balance: data?.value || BigInt(0),
        formatted: data?.formatted || '0',
        symbol: data?.symbol || 'ETH',
        isLoading,
        refetch,
    };
}
