## 🚀 Gamification: Mobile Gamified Onboarding & Tutorial

The `GamifiedOnboarding` component guides new users through interactive onboarding steps, rewarding them for completing key actions.

**Features:**
- Step-by-step onboarding with rewards
- Interactive tutorial for wallet connect, first trade, progress tracking
- Earn coins for each completed step

**Usage:**
```tsx
import { GamifiedOnboarding } from './components/gamification';

<GamifiedOnboarding />
```
## 🔔 Gamification: Mobile Notifications

The `GamificationNotification` utility sends local and push notifications for achievements, streaks, and rewards on mobile devices.

**Features:**
- Send local notifications for achievements, streaks, rewards
- Integrate with PushNotificationManager for push notifications

**Usage:**
```ts
import { GamificationNotification } from './lib/gamification';

// Notify achievement
await GamificationNotification.notifyAchievement('First Trade');

// Notify streak
await GamificationNotification.notifyStreak(7);

// Notify reward
await GamificationNotification.notifyReward(100);
```
## 📢 Gamification: Social Sharing & Bragging

The `SocialShare` utility enables users to share achievements and badges via native share APIs or copy links/images for bragging rights.

**Features:**
- Generate shareable achievement images and links
- Integrate with native share APIs (Web Share API)
- Fallback to clipboard copy

**Usage:**
```ts
import { SocialShare } from './lib/gamification';

// Share achievement
await SocialShare.shareAchievement({
   title: 'Level Up!',
   description: 'I just reached Level 5 on ProphetBase!',
   url: 'https://prophetbase.xyz/user/123',
});

// Generate share image
const img = SocialShare.generateShareImage({
   name: 'First Trade',
   description: 'Completed your first trade',
   icon: '🎉',
});
```
## 🪙 Gamification: In-App Rewards & Virtual Currency

The `RewardService` manages virtual currency balances, earn/spend logic, and distributes rewards for achievements, streaks, referrals, and quests.

**Features:**

- Manage virtual currency balances
- Earn/spend logic
- Distribute rewards for achievements, streaks, referrals, quests
- Reset balance

**Usage:**

```ts
import { RewardService } from './lib/gamification';

// Get current balance
const balance = RewardService.getBalance();

// Earn coins
RewardService.earn(50);

// Spend coins
const success = RewardService.spend(20);

// Reset balance
RewardService.reset();
```

## 🎯 Gamification: Challenge System & Quests

The `ChallengeService` defines challenges/quests, tracks user progress, and awards quest rewards for completion.

**Features:**

- Define challenges/quests (trade X times, win Y markets)
- Track user progress
- Award quest rewards
- Reset challenges

**Usage:**

```ts
import { ChallengeService } from './lib/gamification';

// Get current challenges
const challenges = ChallengeService.getChallenges();

// Update progress for a challenge
ChallengeService.updateProgress('trade_5');

// Reset all challenges
ChallengeService.resetChallenges();
```

## 🤝 Gamification: Referral Tracking & Rewards

The `ReferralService` manages referral codes, tracks referred users, and awards referral bonuses for successful invites.

**Features:**

- Generate and manage referral codes
- Track referred users
- Award referral bonuses

**Usage:**

```ts
import { ReferralService } from './lib/gamification';

// Generate referral code
const code = ReferralService.generateCode('user123');

// Add referred user
ReferralService.addReferredUser('user456');

// Award referral bonus (returns true if awarded)
const bonus = ReferralService.awardBonus();
```

## 🏆 Gamification: Leaderboard & Ranking System

The `LeaderboardService` calculates user rankings and provides a sorted leaderboard based on XP, streaks, and achievements.

**Features:**

- Calculate user rankings
- Sort leaderboard by XP, streak, level
- Get user rank by ID

**Usage:**

```ts
import { LeaderboardService } from './lib/gamification';

const users = [
  {
    userId: '1',
    username: 'Alice',
    xp: 1200,
    streak: 5,
    level: 3,
    badges: ['first_trade'],
  },
  {
    userId: '2',
    username: 'Bob',
    xp: 900,
    streak: 7,
    level: 2,
    badges: ['volume_1k'],
  },
];
const leaderboard = LeaderboardService.getLeaderboard(users);
const rank = LeaderboardService.getUserRank(users, '1');
```

## 🔥 Gamification: Streak Tracking & Daily Rewards

The `StreakService` tracks user activity streaks and awards daily login/trading rewards for consecutive activity.

**Features:**

- Track user streaks (login, trading)
- Award daily rewards for consecutive activity
- Reset streak on inactivity

**Usage:**

```ts
import { StreakService } from './lib/gamification';

// Update streak on user activity
const streak = StreakService.updateStreak();

// Award daily reward (returns true if rewarded)
const rewarded = StreakService.awardDailyReward();
```

## 🏅 Gamification: Achievement Badges & User Levels

The `AchievementService` tracks user achievements, assigns badges, and calculates user levels based on XP.

**Features:**

- Track user actions and milestones
- Assign badges (first trade, volume, market explorer, etc.)
- Calculate user level from XP

**Usage:**

```ts
import { AchievementService } from './lib/gamification';

const userStats = { trades: 12, volume: 1500, markets: 15 };
const achievements = AchievementService.getUserAchievements(userStats);
// achievements.badges, achievements.level, achievements.xp
```

## ⚙️ Mobile Settings & Preferences Management

The `MobileSettings` utility manages user settings (theme, notifications, privacy) with local persistence and reset capability.

**Features:**

- Get/set user settings (theme, notifications, privacy)
- Persist settings in localStorage
- Reset settings to default

**Usage:**

```ts
import { MobileSettings } from './lib/mobile';

// Get current settings
const settings = MobileSettings.get();

// Update settings
MobileSettings.set({ theme: 'dark', notifications: false });

// Reset to default
MobileSettings.reset();
```

## 🧭 Mobile Adaptive Navigation & Gesture Support

The `AdaptiveNavigation` component provides swipe gesture navigation and adaptive bottom navigation for mobile users.

**Features:**

- Swipe left/right to switch between tabs (markets, portfolio, FAQ)
- Adaptive bottom navigation bar
- Easy integration with tab state

**Usage:**

```tsx
import { AdaptiveNavigation } from './lib/mobile';

<AdaptiveNavigation
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    { key: 'markets', label: 'Markets', icon: <svg>...</svg> },
    { key: 'portfolio', label: 'Portfolio', icon: <svg>...</svg> },
    { key: 'faq', label: 'FAQ', icon: <svg>...</svg> },
  ]}
/>;
```

## 📴 Mobile Offline Mode & Local Cache

The `OfflineCache` utility provides offline access to market and portfolio data by caching them locally on the device.

**Features:**

- Cache market and portfolio data in localStorage
- Retrieve cached data when offline
- Sync cache on reconnect

**Usage:**

```ts
import { OfflineCache } from './lib/mobile';

// Cache data
OfflineCache.cacheMarkets(markets);
OfflineCache.cachePortfolio(portfolio);

// Retrieve cached data
const cachedMarkets = OfflineCache.getCachedMarkets();
const cachedPortfolio = OfflineCache.getCachedPortfolio();
```

## 🔗 Mobile Deep Linking & Universal Links

The `DeepLinkHandler` utility parses and handles app-specific deep links and universal links for mobile navigation.

**Features:**

- Parse prophetbase:// and https://prophetbase.xyz/ links
- Route to market, portfolio, onboarding, etc.
- Integrate with Next.js router

**Usage:**

```ts
import { DeepLinkHandler } from './lib/mobile';
import { useRouter } from 'next/navigation';

const router = useRouter();
const url = 'prophetbase://market/123';
DeepLinkHandler.handle(url, router);
```

## 🔒 Mobile Biometric Authentication

The `BiometricAuth` utility enables biometric authentication (FaceID, TouchID, WebAuthn) for quick and secure access on mobile devices.

**Features:**

- Prompt for biometric authentication
- Fallback to PIN if unavailable
- Returns success/failure

**Usage:**

```ts
import { BiometricAuth } from './lib/mobile';

const available = await BiometricAuth.isAvailable();
const success = await BiometricAuth.prompt(
  'Authenticate to access your portfolio'
);
```

## 👋 Mobile Onboarding & Wallet Connect

The `MobileOnboarding` component provides a step-by-step onboarding experience for mobile users, including wallet connection and feature highlights.

**Features:**

- Welcome and introduction
- Guided wallet connection (RainbowKit)
- Feature highlights and navigation

**Usage:**

```tsx
import { MobileOnboarding } from './components/mobile';

<MobileOnboarding />;
```

## 📲 Mobile Push Notification Opt-In

The `PushNotificationManager` utility enables mobile users to opt-in to push notifications, manage their subscription, and set notification preferences.

**Features:**

- Request notification permission
- Subscribe/unsubscribe to push notifications
- Manage notification preferences (localStorage)

**Usage:**

```ts
import { PushNotificationManager } from './lib/mobile';

// Request permission
const status = await PushNotificationManager.requestPermission();

// Subscribe user
const subscription = await PushNotificationManager.subscribeUser();

// Unsubscribe user
await PushNotificationManager.unsubscribeUser();

// Set/get preferences
PushNotificationManager.setPreference('marketAlerts', true);
const prefs = PushNotificationManager.getPreferences();
```

## 📱 Mobile Trading Interface

The `QuickTrade` component provides a mobile-optimized trading interface with:

- Buy/Sell toggle
- Amount input
- Haptic feedback on trade
- Voice command support (buy/sell, amount)
- Fixed bottom bar for easy thumb access

**Usage:**

```tsx
import { QuickTrade } from './components/mobile';

<QuickTrade
  symbol="ETH-USD"
  price={3200}
  onTrade={(side, amount) => {
    /* handle trade */
  }}
/>;
```

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

- **PredictionMarket**: `0x27177c0edc143CA33119fafD907e8600deF5Ba74`
- **USDC (Base)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Network**: Base Mainnet (chainId: 8453)

View on [Basescan](https://basescan.org/address/0x27177c0edc143CA33119fafD907e8600deF5Ba74)

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

| Variable                               | Description                                                                               | Required |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com/) | Yes      |

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
- [ProphetBase Contract on Basescan](https://basescan.org/address/0x27177c0edc143CA33119fafD907e8600deF5Ba74)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
