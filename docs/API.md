# ProphetBase API Documentation

This document outlines the core Smart Contract interfaces and Frontend Hooks used in ProphetBase.

## Smart Contracts

### PredictionMarket.sol
Address: `See frontend/lib/contracts.ts` (Dynamic based on network)

#### Read Functions
- `marketCount()`: Returns the total number of markets created.
- `markets(uint256 marketId)`: Returns struct details of a specific market.
  - `question`: string
  - `endTime`: timestamp
  - `outcome`: bool
  - `resolved`: bool
- `getMarketDetails(uint256 marketId)`: Helper to get all details in one call.

#### Write Functions
- `createMarket(string question, uint256 duration)`: Creates a new prediction market.
- `buyShare(uint256 marketId, bool isYes)`: Buy shares. Requires ETH value.
- `resolveMarket(uint256 marketId, bool outcome)`: Admin only. Resolves market.
- `claimWinnings(uint256 marketId)`: Claims payout for winning shares.

### Events
- `MarketCreated(uint256 indexed marketId, string question)`
- `SharesPurchased(uint256 indexed marketId, address indexed buyer, bool isYes, uint256 amount)`
- `MarketResolved(uint256 indexed marketId, bool outcome)`

## Frontend Hooks

### `useMarket(marketId: number)`
Retrieves data for a single market.
```typescript
const { data, isLoading } = useReadContract({
  address: PREDICTION_MARKET_ADDRESS,
  abi: PREDICTION_MARKET_ABI,
  functionName: 'markets',
  args: [BigInt(marketId)]
})
```

### `useWatchlist()`
Manages local user watchlist.
- `addToWatchlist(id)`
- `removeFromWatchlist(id)`
- `watchlist`: Array of market IDs.

### `useSearch()`
Context hook for global search state (if applicable using Context API).

## Error Handling
Standard RPC errors are caught and displayed via `react-hot-toast`.
- `Execution reverted`: Contract logic failure (e.g., "Market ended").
- `User rejected`: Wallet signature denied.
