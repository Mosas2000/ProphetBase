import { useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';

/**
 * Hook to track transaction status
 * @param hash - Transaction hash
 * @returns Transaction status and data
 */
export function useTransaction(hash?: `0x${string}`) {
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(hash);

    const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    return {
        receipt: data,
        isLoading,
        isSuccess,
        isError,
        setTxHash,
    };
}
