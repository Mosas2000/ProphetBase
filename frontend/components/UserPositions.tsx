'use client';

import { ERC20_ABI, PREDICTION_MARKET_ABI } from '@/lib/abi';
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts';
import { useCallback, useState } from 'react';
import { formatUnits } from 'viem';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

/**
 * Market status enum
 */
enum MarketStatus {
  Open = 0,
  Resolved = 1,
  Cancelled = 2,
}

/**
 * Market data structure
 */
interface Market {
  question: string;
  endTime: bigint;
  resolutionTime: bigint;
  status: MarketStatus;
  outcome: boolean;
  yesToken: string;
  noToken: string;
  totalYesShares: bigint;
  totalNoShares: bigint;
}

/**
 * User position in a market
 */
interface UserPosition {
  marketId: number;
  market: Market;
  yesShares: bigint;
  noShares: bigint;
  isWinning: boolean;
}

/**
 * PositionCard - Display individual position
 */
function PositionCard({ position }: { position: UserPosition }) {
  const [isClaiming, setIsClaiming] = useState(false);

  const {
    writeContract: claimWrite,
    data: claimHash,
    isPending: isClaimPending,
  } = useWriteContract();
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } =
    useWaitForTransactionReceipt({
      hash: claimHash,
    });

  const totalShares = position.yesShares + position.noShares;
  const estimatedValue = formatUnits(totalShares, 6); // 1:1 ratio with USDC (6 decimals)

  const handleClaim = useCallback(() => {
    setIsClaiming(true);
    claimWrite({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [BigInt(position.marketId)],
    });
  }, [claimWrite, position.marketId]);

  const isResolved = position.market.status === MarketStatus.Resolved;
  const canClaim = isResolved && position.isWinning && !isClaimSuccess;

  // Status configuration
  const statusConfig = {
    [MarketStatus.Open]: {
      label: 'Active',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    [MarketStatus.Resolved]: {
      label: 'Resolved',
      color: position.isWinning
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-gray-100 text-gray-700 border-gray-200',
      dot: position.isWinning ? 'bg-green-500' : 'bg-gray-500',
    },
    [MarketStatus.Cancelled]: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-500',
    },
  };

  const status = statusConfig[position.market.status];

  return (
    <div
      className={`rounded-xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        position.isWinning && isResolved
          ? 'border-green-300 bg-gradient-to-br from-green-50/50 to-white'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.color}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`}
          />
          {status.label}
        </div>
        <span className="text-xs text-gray-500 font-mono">
          #{position.marketId}
        </span>
      </div>

      {/* Question */}
      <h3 className="mb-4 text-lg font-bold text-gray-900 line-clamp-2">
        {position.market.question}
      </h3>

      {/* Winning Badge */}
      {position.isWinning && isResolved && (
        <div className="mb-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">You Won!</span>
          </div>
        </div>
      )}

      {/* Shares Display */}
      <div className="mb-4 space-y-2">
        {position.yesShares > BigInt(0) && (
          <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 p-3">
            <span className="text-sm font-medium text-green-700">
              YES Shares
            </span>
            <span className="font-bold text-green-700">
              {formatUnits(position.yesShares, 6)}
            </span>
          </div>
        )}
        {position.noShares > BigInt(0) && (
          <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 p-3">
            <span className="text-sm font-medium text-red-700">NO Shares</span>
            <span className="font-bold text-red-700">
              {formatUnits(position.noShares, 6)}
            </span>
          </div>
        )}
      </div>

      {/* Estimated Value */}
      <div className="mb-4 rounded-lg bg-gray-50 border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estimated Value</span>
          <span className="font-bold text-gray-900">{estimatedValue} USDC</span>
        </div>
      </div>

      {/* Resolved Outcome */}
      {isResolved && (
        <div
          className={`mb-4 rounded-lg p-3 text-center ${
            position.market.outcome
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="text-xs font-medium text-gray-600 mb-1">
            Market Outcome
          </div>
          <div
            className={`text-lg font-bold ${
              position.market.outcome ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {position.market.outcome ? '✓ YES' : '✗ NO'}
          </div>
        </div>
      )}

      {/* Claim Button */}
      {canClaim && (
        <button
          onClick={handleClaim}
          disabled={isClaimPending || isClaimConfirming}
          className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClaimPending || isClaimConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Claiming...
            </span>
          ) : (
            'Claim Winnings'
          )}
        </button>
      )}

      {/* Claimed Success */}
      {isClaimSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-sm">Winnings Claimed!</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * UserPositions - Display all user positions across markets
 */
export default function UserPositions() {
  const { address, isConnected } = useAccount();

  // Fetch market count
  const { data: marketCount, isLoading: isLoadingCount } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCount',
  });

  // Hardcoded individual market queries (no hooks in loops!)
  const market0 = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'markets',
    args: [BigInt(0)],
  });

  const market1 = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'markets',
    args: [BigInt(1)],
  });

  const market2 = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'markets',
    args: [BigInt(2)],
  });

  const market3 = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'markets',
    args: [BigInt(3)],
  });

  const market4 = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'markets',
    args: [BigInt(4)],
  });

  // Hardcoded YES token balance queries for each market
  const yes0Balance = useReadContract({
    address: (market0.data as Market | undefined)?.yesToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market0.data as Market | undefined)?.yesToken,
    },
  });

  const yes1Balance = useReadContract({
    address: (market1.data as Market | undefined)?.yesToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market1.data as Market | undefined)?.yesToken,
    },
  });

  const yes2Balance = useReadContract({
    address: (market2.data as Market | undefined)?.yesToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market2.data as Market | undefined)?.yesToken,
    },
  });

  const yes3Balance = useReadContract({
    address: (market3.data as Market | undefined)?.yesToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market3.data as Market | undefined)?.yesToken,
    },
  });

  const yes4Balance = useReadContract({
    address: (market4.data as Market | undefined)?.yesToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market4.data as Market | undefined)?.yesToken,
    },
  });

  // Hardcoded NO token balance queries for each market
  const no0Balance = useReadContract({
    address: (market0.data as Market | undefined)?.noToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market0.data as Market | undefined)?.noToken,
    },
  });

  const no1Balance = useReadContract({
    address: (market1.data as Market | undefined)?.noToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market1.data as Market | undefined)?.noToken,
    },
  });

  const no2Balance = useReadContract({
    address: (market2.data as Market | undefined)?.noToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market2.data as Market | undefined)?.noToken,
    },
  });

  const no3Balance = useReadContract({
    address: (market3.data as Market | undefined)?.noToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market3.data as Market | undefined)?.noToken,
    },
  });

  const no4Balance = useReadContract({
    address: (market4.data as Market | undefined)?.noToken as
      | `0x${string}`
      | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!(market4.data as Market | undefined)?.noToken,
    },
  });

  // Collect all markets and balances
  const allMarketData = [
    {
      market: market0.data as Market | undefined,
      yesBalance: yes0Balance.data as bigint | undefined,
      noBalance: no0Balance.data as bigint | undefined,
      id: 0,
    },
    {
      market: market1.data as Market | undefined,
      yesBalance: yes1Balance.data as bigint | undefined,
      noBalance: no1Balance.data as bigint | undefined,
      id: 1,
    },
    {
      market: market2.data as Market | undefined,
      yesBalance: yes2Balance.data as bigint | undefined,
      noBalance: no2Balance.data as bigint | undefined,
      id: 2,
    },
    {
      market: market3.data as Market | undefined,
      yesBalance: yes3Balance.data as bigint | undefined,
      noBalance: no3Balance.data as bigint | undefined,
      id: 3,
    },
    {
      market: market4.data as Market | undefined,
      yesBalance: yes4Balance.data as bigint | undefined,
      noBalance: no4Balance.data as bigint | undefined,
      id: 4,
    },
  ];

  // Check loading state
  const isLoading =
    isLoadingCount ||
    market0.isLoading ||
    market1.isLoading ||
    market2.isLoading ||
    market3.isLoading ||
    market4.isLoading ||
    yes0Balance.isLoading ||
    yes1Balance.isLoading ||
    yes2Balance.isLoading ||
    yes3Balance.isLoading ||
    yes4Balance.isLoading ||
    no0Balance.isLoading ||
    no1Balance.isLoading ||
    no2Balance.isLoading ||
    no3Balance.isLoading ||
    no4Balance.isLoading;

  // Build user positions
  const positions: UserPosition[] = allMarketData
    .map(({ market, yesBalance, noBalance, id }) => {
      const yesShares = yesBalance || BigInt(0);
      const noShares = noBalance || BigInt(0);

      if (!market || (yesShares === BigInt(0) && noShares === BigInt(0))) {
        return null;
      }

      // Determine if this is a winning position
      const isWinning =
        market.status === MarketStatus.Resolved &&
        ((market.outcome && yesShares > BigInt(0)) ||
          (!market.outcome && noShares > BigInt(0)));

      return {
        marketId: id,
        market,
        yesShares,
        noShares,
        isWinning,
      };
    })
    .filter((p): p is UserPosition => p !== null);

  // Not connected state
  if (!isConnected) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600">
          Connect your wallet to view your positions
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="mt-4 text-gray-600">Loading your positions...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (positions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No Positions Yet
        </h3>
        <p className="text-gray-600">
          You haven't purchased any shares yet. Start trading to see your
          positions here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Positions</h2>
          <p className="text-gray-600">
            {positions.length}{' '}
            {positions.length === 1 ? 'position' : 'positions'}
          </p>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {positions.map((position) => (
          <PositionCard key={position.marketId} position={position} />
        ))}
      </div>
    </div>
  );
}
