# PredictionMarket Contract API

## Contract Address
See `frontend/lib/contracts.ts` for current deployment addresses.

## Core Functions

### Read Functions

#### `marketCount()`
Returns the total number of markets created.
```solidity
function marketCount() external view returns (uint256)
```

#### `markets(uint256 marketId)`
Returns market details for a given ID.
```solidity
function markets(uint256 marketId) external view returns (
    string question,
    uint256 endTime,
    bool outcome,
    bool resolved,
    uint256 yesShares,
    uint256 noShares
)
```

#### `getUserShares(uint256 marketId, address user, bool isYes)`
Returns user's share balance for a specific outcome.
```solidity
function getUserShares(
    uint256 marketId,
    address user,
    bool isYes
) external view returns (uint256)
```

### Write Functions

#### `createMarket(string question, uint256 duration)`
Creates a new prediction market.
```solidity
function createMarket(
    string memory question,
    uint256 duration
) external returns (uint256 marketId)
```
**Parameters:**
- `question`: The market question (binary YES/NO)
- `duration`: Time until market closes (in seconds)

**Returns:** New market ID

#### `buyShare(uint256 marketId, bool isYes)`
Purchase shares in a market.
```solidity
function buyShare(
    uint256 marketId,
    bool isYes
) external payable
```
**Parameters:**
- `marketId`: ID of the market
- `isYes`: true for YES shares, false for NO

**Requires:** ETH value sent with transaction

#### `resolveMarket(uint256 marketId, bool outcome)`
Resolves a market (admin only).
```solidity
function resolveMarket(
    uint256 marketId,
    bool outcome
) external onlyOwner
```

#### `claimWinnings(uint256 marketId)`
Claim winnings from a resolved market.
```solidity
function claimWinnings(uint256 marketId) external
```

## Events

### `MarketCreated`
```solidity
event MarketCreated(
    uint256 indexed marketId,
    string question,
    uint256 endTime
)
```

### `SharesPurchased`
```solidity
event SharesPurchased(
    uint256 indexed marketId,
    address indexed buyer,
    bool isYes,
    uint256 amount
)
```

### `MarketResolved`
```solidity
event MarketResolved(
    uint256 indexed marketId,
    bool outcome
)
```

### `WinningsClaimed`
```solidity
event WinningsClaimed(
    uint256 indexed marketId,
    address indexed user,
    uint256 amount
)
```

## Error Handling
- `MarketEnded`: Trading period has ended
- `MarketNotResolved`: Market hasn't been resolved yet
- `NoWinnings`: User has no winnings to claim
- `InvalidMarket`: Market ID doesn't exist
