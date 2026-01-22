# Frontend Hooks API

## Market Data Hooks

### useMarket
Fetch single market data.
```tsx
import { useMarket } from '@/lib/hooks/useMarket';

const { market, isLoading, refetch } = useMarket(marketId);
```

**Returns:**
- `market`: Market data
- `isLoading`: boolean
- `isError`: boolean
- `refetch`: () => void

### useMarkets
Get total market count.
```tsx
import { useMarkets } from '@/lib/hooks/useMarkets';

const { marketCount, isLoading } = useMarkets();
```

**Returns:**
- `marketCount`: number
- `isLoading`: boolean

### useUserPositions
Fetch user's positions in a market.
```tsx
import { useUserPositions } from '@/lib/hooks/useUserPositions';

const { yesShares, noShares, isLoading } = useUserPositions(marketId);
```

**Returns:**
- `yesShares`: bigint
- `noShares`: bigint
- `isLoading`: boolean

## Wallet Hooks

### useBalance
Get user's ETH balance.
```tsx
import { useBalance } from '@/lib/hooks/useBalance';

const { balance, formatted, symbol, refetch } = useBalance();
```

**Returns:**
- `balance`: bigint
- `formatted`: string
- `symbol`: string
- `isLoading`: boolean
- `refetch`: () => void

### useApproval
Manage ERC20 approvals.
```tsx
import { useApproval } from '@/lib/hooks/useApproval';

const { needsApproval, approve, isApproving } = useApproval(
  tokenAddress,
  spenderAddress,
  amount
);
```

**Returns:**
- `needsApproval`: boolean
- `allowance`: bigint
- `approve`: () => Promise<void>
- `isApproving`: boolean
- `refetch`: () => void

## Transaction Hooks

### useTransaction
Track transaction status.
```tsx
import { useTransaction } from '@/lib/hooks/useTransaction';

const { receipt, isLoading, isSuccess, setTxHash } = useTransaction(hash);
```

**Returns:**
- `receipt`: TransactionReceipt
- `isLoading`: boolean
- `isSuccess`: boolean
- `isError`: boolean
- `setTxHash`: (hash) => void

## UI Hooks

### useToast
Show toast notifications.
```tsx
import { useToast } from '@/lib/hooks/useToast';

const toast = useToast();

toast.success('Transaction successful!');
toast.error('Transaction failed');
toast.loading('Processing...');
```

**Methods:**
- `success(message)`: void
- `error(message)`: void
- `loading(message)`: string (returns toast ID)
- `dismiss(id?)`: void
- `promise(promise, messages)`: Promise

### useLocalStorage
Persist state in localStorage.
```tsx
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const [value, setValue] = useLocalStorage('key', defaultValue);
```

**Returns:** `[T, (value: T) => void]`

### useDebounce
Debounce a value.
```tsx
import { useDebounce } from '@/lib/hooks/useDebounce';

const debouncedValue = useDebounce(value, 500);
```

**Parameters:**
- `value`: T
- `delay?`: number (default: 500ms)

**Returns:** T

### useMediaQuery
Responsive media queries.
```tsx
import { useMediaQuery, useIsMobile } from '@/lib/hooks/useMediaQuery';

const isMobile = useIsMobile();
const isTablet = useIsTablet();
const isDesktop = useIsDesktop();
const matches = useMediaQuery('(min-width: 768px)');
```

**Returns:** boolean
