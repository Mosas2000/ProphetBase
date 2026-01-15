# ProphetBase Frontend

A Next.js 14 frontend for the ProphetBase decentralized prediction market platform on Base mainnet.

## Features

- 🔗 **Wallet Connection**: RainbowKit integration for seamless wallet connectivity
- ⛓️ **Base Mainnet**: Built specifically for Base (chainId: 8453)
- 💎 **Modern Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- 🔐 **Web3 Integration**: wagmi v2 and viem for blockchain interactions
- 📱 **Responsive Design**: Mobile-first, modern UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2, viem v2, RainbowKit
- **State Management**: React Query (@tanstack/react-query)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A WalletConnect Project ID (get one at [WalletConnect Cloud](https://cloud.walletconnect.com/))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```

3. **Add your WalletConnect Project ID** to `.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with Web3 providers
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   └── Web3Provider.tsx    # Web3 provider wrapper
├── lib/
│   ├── wagmi.ts           # Wagmi configuration
│   ├── contracts.ts       # Contract addresses
│   └── abi.ts             # Contract ABIs
└── public/                # Static assets
```

## Contract Information

- **PredictionMarket**: `0x798e104BfAefC785bCDB63B58E0b620707773DAA`
- **USDC (Base)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Network**: Base Mainnet (chainId: 8453)

## Key Features

### Wallet Connection
The app uses RainbowKit for wallet connection, supporting:
- MetaMask
- Coinbase Wallet
- WalletConnect
- And more...

### Smart Contract Integration
Pre-configured ABIs and contract addresses for:
- PredictionMarket contract (create markets, buy shares, claim winnings)
- USDC token (approve, balance checks)

## Development Tips

- The app is configured for Base mainnet by default
- All contract interactions use wagmi hooks
- RainbowKit provides the wallet connection UI
- TypeScript types are enforced throughout

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Base Network](https://base.org)
- [ProphetBase Contract on Basescan](https://basescan.org/address/0x798e104BfAefC785bCDB63B58E0b620707773DAA)

## License

MIT
