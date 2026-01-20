import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { erc20Abi } from 'viem';

/**
 * Hook to check and manage ERC20 token approvals
 * @param tokenAddress - Token contract address
 * @param spenderAddress - Spender contract address
 * @param amount - Amount to approve
 * @returns Approval state and approve function
 */
export function useApproval(
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: bigint
) {
    const { address } = useAccount();

    const { data: allowance, refetch } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: address ? [address, spenderAddress] : undefined,
    });

    const { writeContract, isPending } = useWriteContract();

    const needsApproval = allowance !== undefined && allowance < amount;

    const approve = async () => {
        if (!address) return;

        writeContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [spenderAddress, amount],
        });
    };

    return {
        needsApproval,
        allowance: allowance || BigInt(0),
        approve,
        isApproving: isPending,
        refetch,
    };
}
