'use client';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-7xl mb-6 opacity-50">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 max-w-md mb-8">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// No Markets Empty State
export function NoMarketsEmpty({ onCreateMarket }: { onCreateMarket?: () => void }) {
  return (
    <EmptyState
      icon="🎯"
      title="No Markets Found"
      description="There are no prediction markets matching your criteria. Try adjusting your filters or create a new market."
      actionLabel="Create Market"
      onAction={onCreateMarket}
      secondaryActionLabel="Clear Filters"
      onSecondaryAction={() => window.location.reload()}
    />
  );
}

// No Positions Empty State
export function NoPositionsEmpty({ onBrowseMarkets }: { onBrowseMarkets?: () => void }) {
  return (
    <EmptyState
      icon="💼"
      title="No Active Positions"
      description="You don't have any active positions yet. Start trading to build your portfolio!"
      actionLabel="Browse Markets"
      onAction={onBrowseMarkets}
    />
  );
}

// No Trade History Empty State
export function NoTradeHistoryEmpty({ onStartTrading }: { onStartTrading?: () => void }) {
  return (
    <EmptyState
      icon="📊"
      title="No Trade History"
      description="Your trading history is empty. Make your first trade to start tracking your performance."
      actionLabel="Start Trading"
      onAction={onStartTrading}
    />
  );
}

// No Notifications Empty State
export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon="🔔"
      title="No Notifications"
      description="You're all caught up! No new notifications at this time."
    />
  );
}

// No Search Results Empty State
export function NoSearchResultsEmpty({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description={`No results found for "${searchQuery}". Try different keywords or browse all markets.`}
      actionLabel="Clear Search"
      onAction={() => window.location.reload()}
    />
  );
}

// Wallet Not Connected Empty State
export function WalletNotConnectedEmpty({ onConnect }: { onConnect?: () => void }) {
  return (
    <EmptyState
      icon="👛"
      title="Wallet Not Connected"
      description="Connect your wallet to view your portfolio, trade markets, and manage your positions."
      actionLabel="Connect Wallet"
      onAction={onConnect}
    />
  );
}

// Coming Soon Empty State
export function ComingSoonEmpty({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon="🚀"
      title="Coming Soon"
      description={`${feature} is currently under development. Stay tuned for updates!`}
      actionLabel="Back to Home"
      onAction={() => window.location.href = '/'}
    />
  );
}

// No Liquidity Empty State
export function NoLiquidityEmpty({ onAddLiquidity }: { onAddLiquidity?: () => void }) {
  return (
    <EmptyState
      icon="💧"
      title="No Liquidity Positions"
      description="You haven't provided liquidity to any markets yet. Earn fees by becoming a liquidity provider!"
      actionLabel="Add Liquidity"
      onAction={onAddLiquidity}
    />
  );
}

// Maintenance Empty State
export function MaintenanceEmpty() {
  return (
    <EmptyState
      icon="🔧"
      title="Under Maintenance"
      description="We're currently performing scheduled maintenance. We'll be back shortly!"
      actionLabel="Check Status"
      onAction={() => window.open('https://status.prophetbase.com', '_blank')}
    />
  );
}
