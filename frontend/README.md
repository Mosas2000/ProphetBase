# ProphetBase Frontend

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMosas2000%2FProphetBase&project-name=prophetbase&repository-name=prophetbase&root-directory=frontend&env=NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID&envDescription=WalletConnect%20Project%20ID%20required%20for%20wallet%20connectivity&envLink=https%3A%2F%2Fcloud.walletconnect.com%2F)

A Next.js 14 frontend for the ProphetBase decentralized prediction market platform on Base mainnet.

## 🚀 Live Demo

> **Coming Soon**: Live demo will be available after deployment

## Features

- 🔮 **Prediction Markets**: Trade YES/NO shares on crypto events
- 🔗 **Wallet Connection**: RainbowKit integration for seamless wallet connectivity
- ⛓️ **Base Mainnet**: Built specifically for Base (chainId: 8453)
- 💎 **Modern Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- 🔐 **Web3 Integration**: wagmi v2 and viem for blockchain interactions
- 📱 **Responsive Design**: Mobile-first, modern UI
- 💰 **USDC Trading**: Buy shares with USDC on Base

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

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mosas2000/ProphetBase.git
   cd ProphetBase/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```

4. **Add your WalletConnect Project ID** to `.env.local`:
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

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy ProphetBase is using Vercel:

1. **Click the Deploy button** above, or visit [Vercel](https://vercel.com/new)

2. **Import your repository**:
   - Connect your GitHub account
   - Select the ProphetBase repository
   - Set root directory to `frontend`

3. **Configure environment variables**:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect Project ID

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Getting a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID
5. Add it to your environment variables

### Manual Deployment

If deploying to another platform:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

3. **Start the production server**:
   ```bash
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
│   ├── Web3Provider.tsx    # Web3 provider wrapper
│   ├── MarketList.tsx      # Display all markets
│   ├── MarketCard.tsx      # Individual market card
│   ├── BuySharesModal.tsx  # Modal for buying shares
│   └── UserPositions.tsx   # User's positions tracker
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

View on [Basescan](https://basescan.org/address/0x798e104BfAefC785bCDB63B58E0b620707773DAA)

## Key Features

### 🎯 Market Trading
- Browse all active prediction markets
- View market details, probabilities, and end times
- Buy YES or NO shares with USDC
- Two-step transaction flow (approve + buy)

### 💼 Portfolio Management
- Track all your positions across markets
- View YES/NO share balances
- See estimated values
- Claim winnings from resolved markets

### 🔐 Wallet Connection
The app uses RainbowKit for wallet connection, supporting:
- MetaMask
- Coinbase Wallet
- WalletConnect
- Rainbow Wallet
- And more...

### 📊 Smart Contract Integration
Pre-configured ABIs and contract addresses for:
- PredictionMarket contract (create markets, buy shares, claim winnings)
- USDC token (approve, balance checks)
- ERC20 outcome tokens (YES/NO shares)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com/) | Yes |

## Troubleshooting

### Wallet Connection Issues

**Problem**: Wallet won't connect
- **Solution**: Make sure you have a valid WalletConnect Project ID set in your environment variables
- **Solution**: Try clearing your browser cache and reconnecting
- **Solution**: Ensure you're on Base mainnet (chainId: 8453)

### Transaction Failures

**Problem**: Transactions fail or revert
- **Solution**: Ensure you have enough USDC balance on Base
- **Solution**: Check that you've approved the PredictionMarket contract to spend your USDC
- **Solution**: Verify you're connected to Base mainnet, not a testnet

### Build Errors

**Problem**: Build fails on Vercel
- **Solution**: Ensure all environment variables are set correctly
- **Solution**: Check that your Node.js version is 18 or higher
- **Solution**: Clear Vercel cache and redeploy

### Markets Not Loading

**Problem**: Markets don't appear
- **Solution**: Connect your wallet first
- **Solution**: Check your internet connection
- **Solution**: Verify the contract address is correct
- **Solution**: Try refreshing the page

## Development Tips

- The app is configured for Base mainnet by default
- All contract interactions use wagmi hooks
- RainbowKit provides the wallet connection UI
- TypeScript types are enforced throughout
- Use the browser console to debug transaction issues

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Base Network](https://base.org)
- [ProphetBase Contract on Basescan](https://basescan.org/address/0x798e104BfAefC785bCDB63B58E0b620707773DAA)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
