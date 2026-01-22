# OutcomeToken Contract API

## Overview
ERC20 tokens representing YES and NO shares in prediction markets.

## Token Standard
Implements ERC20 with additional market-specific functionality.

## Core Functions

### Standard ERC20

#### `balanceOf(address account)`
Returns token balance for an account.
```solidity
function balanceOf(address account) external view returns (uint256)
```

#### `transfer(address to, uint256 amount)`
Transfer tokens to another address.
```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

#### `approve(address spender, uint256 amount)`
Approve spender to use tokens.
```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

### Market-Specific

#### `mint(address to, uint256 amount)`
Mint new tokens (market contract only).
```solidity
function mint(address to, uint256 amount) external onlyMarket
```

#### `burn(address from, uint256 amount)`
Burn tokens (market contract only).
```solidity
function burn(address from, uint256 amount) external onlyMarket
```

## Token Metadata

### YES Tokens
- **Name**: "Market YES Token"
- **Symbol**: "mYES"
- **Decimals**: 18

### NO Tokens
- **Name**: "Market NO Token"
- **Symbol**: "mNO"
- **Decimals**: 18

## Events

### Standard ERC20 Events
```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
event Approval(address indexed owner, address indexed spender, uint256 value)
```

## Important Notes
- Tokens are market-specific
- Cannot be transferred after market resolution
- Winning tokens can be redeemed for payout
- Losing tokens become worthless
