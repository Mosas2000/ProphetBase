# ProphetBase 🔮

![Deployment](https://img.shields.io/badge/deployment-live-brightgreen)
![Built on Base](https://img.shields.io/badge/Built%20on-Base-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## 🌐 Live Demo

**ProphetBase is live!** Try it now: [prophetbase.vercel.app](https://prophetbase.vercel.app)

Trade predictions on crypto, DeFi, politics, and sports with real USDC on Base L2. Decentralized, transparent, and secure prediction markets.

---

## 📸 Screenshots

> *Screenshots coming soon - check out the [live demo](https://prophetbase.vercel.app) to see ProphetBase in action!*

---

## ✨ Features

### 🎯 Core Functionality
- **Live on Base Mainnet** - Fully deployed and operational on Base L2
- **Create Prediction Markets** - Anyone can create markets on any topic
- **Trade with USDC** - Use real USDC collateral for predictions
- **Multiple Categories** - DeFi, Crypto, Politics, Sports, and more
- **Real-time Probabilities** - Dynamic pricing based on market activity
- **Claim Winnings** - Automatic payout to winners after resolution

### 💎 Advanced Features
- **Market Categories** - Organized markets by topic (DeFi, Crypto, Politics, Sports, Other)
- **Fee System** - 2% platform fee on all trades
- **Pause Functionality** - Emergency pause for security
- **Share Trading** - Buy and sell outcome shares
- **Admin Dashboard** - Market creation, fee withdrawal, and contract management
- **User Profiles** - Track your positions, history, and achievements
- **Responsive Design** - Beautiful UI that works on all devices

### 🔒 Security
- **Audited Contracts** - Comprehensive test coverage (46 passing tests)
- **Pausable** - Emergency stop functionality
- **Owner Controls** - Protected admin functions
- **Fee Collection** - Transparent fee tracking and withdrawal

---

## 🛠️ Built With

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contract libraries
- **Base L2** - Low-cost, fast blockchain

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Recharts** - Data visualization
- **Vercel** - Deployment platform

### Tools & Libraries
- **Ethers.js** - Ethereum library
- **date-fns** - Date utilities
- **React Hot Toast** - Notifications

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Base network configured in wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ProphetBase.git
cd ProphetBase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run tests
npx hardhat test

# Start frontend development server
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## 📝 Smart Contract

### Deployed Addresses

**Base Mainnet:**
- PredictionMarket: [`0x27177c0edc143CA33119fafD907e8600deF5Ba74`](https://basescan.org/address/0x27177c0edc143CA33119fafD907e8600deF5Ba74)
- USDC (Collateral): `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Contract Functions

#### User Functions
- `createMarket(question, duration, category)` - Create a new prediction market
- `buyShares(marketId, buyYes, amount)` - Purchase outcome shares
- `sellShares(marketId, sellYes, amount)` - Sell outcome shares
- `claimWinnings(marketId)` - Claim winnings after market resolution

#### Admin Functions
- `resolveMarket(marketId, outcome)` - Resolve market with outcome
- `withdrawFees()` - Withdraw collected platform fees
- `pause()` / `unpause()` - Emergency pause functionality

#### View Functions
- `markets(marketId)` - Get market details
- `getMarketsByCategory(category)` - Filter markets by category
- `totalFeesCollected` - View total platform fees

---

## 🏗️ Project Structure

```
ProphetBase/
├── contracts/              # Solidity smart contracts
│   ├── PredictionMarket.sol
│   └── OutcomeToken.sol
├── test/                   # Contract tests
│   └── PredictionMarket.test.ts
├── scripts/                # Deployment scripts
│   ├── deploy.ts
│   └── create-additional-markets.ts
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and configs
│   └── public/            # Static assets
├── docs/                   # Documentation
├── deployments.json        # Deployment history
└── hardhat.config.ts       # Hardhat configuration
```

---

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run specific test file
npx hardhat test test/PredictionMarket.test.ts
```

**Test Results:** ✅ 46/46 passing

---

## 🚢 Deployment

### Smart Contracts

```bash
# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy.ts --network baseSepolia

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.ts --network baseMainnet

# Verify contract
npx hardhat verify --network baseMainnet DEPLOYED_ADDRESS
```

### Frontend

```bash
cd frontend

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

**Environment Variables Required:**
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- `NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS` - Deployed contract address
- `NEXT_PUBLIC_USDC_ADDRESS` - USDC token address

---

## 📖 Documentation

- [User Guide](./docs/USER_GUIDE.md) - How to use ProphetBase
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built on [Base](https://base.org) - Coinbase's L2 solution
- Powered by [OpenZeppelin](https://openzeppelin.com) contracts
- UI components inspired by modern Web3 dApps
- Community feedback and testing

---

## 📞 Contact & Links

- **Live App:** [prophetbase.vercel.app](https://prophetbase.vercel.app)
- **Contract:** [BaseScan](https://basescan.org/address/0x27177c0edc143CA33119fafD907e8600deF5Ba74)
- **Issues:** [GitHub Issues](https://github.com/yourusername/ProphetBase/issues)

---

<div align="center">
  <strong>Built with ❤️ on Base</strong>
  <br />
  <sub>Making prediction markets accessible to everyone</sub>
</div>
