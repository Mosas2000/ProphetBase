# ProphetBase - Crypto-Native Prediction Markets on Base

A decentralized prediction market protocol for crypto events, built on Base.

## Overview

ProphetBase enables users to create and participate in prediction markets for cryptocurrency and blockchain-related events. Built on Base for fast, low-cost transactions.

## Features

- **Decentralized Markets**: Create prediction markets for any crypto event
- **Base Network**: Lightning-fast transactions with minimal fees
- **Trustless Settlement**: Smart contract-based resolution and payouts
- **TypeScript Support**: Full type safety for development

## Tech Stack

- **Smart Contracts**: Solidity 0.8.24
- **Framework**: Hardhat with TypeScript
- **Network**: Base (Mainnet & Sepolia Testnet)
- **Libraries**: OpenZeppelin Contracts

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A wallet with ETH on Base network

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ProphetBase
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `PRIVATE_KEY`: Your wallet's private key (without 0x prefix)
- `BASESCAN_API_KEY`: Your Basescan API key for contract verification

### Development

Compile contracts:
```bash
npx hardhat compile
```

Run tests:
```bash
npx hardhat test
```

Run local node:
```bash
npx hardhat node
```

### Deployment

Deploy to Base Sepolia testnet:
```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

Deploy to Base mainnet:
```bash
npx hardhat run scripts/deploy.ts --network base
```

### Verification

Verify contracts on Basescan:
```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Creating Markets

Create a single market:
```bash
npm run create-market:base
```

Create multiple markets at once:
```bash
npm run create-markets:base
```

To customize the markets being created, edit `scripts/create-additional-markets.ts` and modify the `marketsToCreate` array:

```typescript
const marketsToCreate: MarketConfig[] = [
    { 
        question: "Your question here?", 
        duration: 30 * 24 * 60 * 60 // Duration in seconds
    },
    // Add more markets...
];
```

All created markets are automatically saved to `markets.json` for easy reference.


## Project Structure

```
ProphetBase/
├── contracts/          # Solidity smart contracts
├── scripts/           # Deployment scripts
├── deploy/            # Deployment configurations
├── test/              # Test files
├── hardhat.config.ts  # Hardhat configuration
└── README.md          # This file
```

## Networks

- **Base Mainnet**: Chain ID 8453
- **Base Sepolia**: Chain ID 84532 (Testnet)

## Security

⚠️ **Important**: Never commit your `.env` file or expose your private keys.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Resources

- [Base Documentation](https://docs.base.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
