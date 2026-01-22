# Frontend Utilities API

## Formatting Utilities

### formatAddress
Truncate Ethereum addresses.
```ts
import { formatAddress } from '@/lib/utils/formatAddress';

formatAddress('0x1234...5678'); // "0x1234...5678"
formatAddress(address, 6, 4); // Custom truncation
```

### formatCurrency
Format numbers as currency.
```ts
import { formatCurrency } from '@/lib/utils/formatCurrency';

formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, '€', 2); // "€1,234.56"
```

### formatNumber
Format numbers with separators.
```ts
import { formatNumber } from '@/lib/utils/formatNumber';

formatNumber(1234567); // "1,234,567"
formatNumber(1234567, 0, true); // "1.2M" (compact)
```

### formatDate
Format dates.
```ts
import { formatDate } from '@/lib/utils/formatDate';

formatDate(timestamp); // "Jan 15, 2024"
formatDate(timestamp, 'yyyy-MM-dd'); // "2024-01-15"
```

### formatDuration
Format time durations.
```ts
import { formatDuration } from '@/lib/utils/formatDuration';

formatDuration(futureDate); // "in 2 hours"
formatDuration(pastDate); // "2 hours ago"
```

## Calculation Utilities

### calculateProbability
Calculate market probabilities.
```ts
import { calculateProbability } from '@/lib/utils/calculateProbability';

const { yesPercent, noPercent } = calculateProbability(
  yesShares,
  noShares
);
```

### calculatePayout
Calculate potential payouts.
```ts
import { calculatePayout, calculateProfit } from '@/lib/utils/calculatePayout';

const payout = calculatePayout(shares, sharePrice, isWinning);
const profit = calculateProfit(shares, purchasePrice, currentPrice);
```

## Validation Utilities

### validateAddress
Validate Ethereum addresses.
```ts
import { validateAddress } from '@/lib/utils/validateAddress';

const isValid = validateAddress(address); // boolean
```

### validateAmount
Validate transaction amounts.
```ts
import { validateAmount } from '@/lib/utils/validateAmount';

const { isValid, error } = validateAmount(amount, min, max);
```

### validateMarket
Check market status.
```ts
import { isMarketOpen, canResolveMarket } from '@/lib/utils/validateMarket';

const isOpen = isMarketOpen(status, endTime);
const canResolve = canResolveMarket(status, endTime);
```

## Sharing Utilities

### copyToClipboard
Copy text to clipboard.
```ts
import { copyToClipboard } from '@/lib/utils/copyToClipboard';

const success = await copyToClipboard(text);
```

### shareToTwitter
Share to Twitter/X.
```ts
import { shareToTwitter } from '@/lib/utils/shareToTwitter';

shareToTwitter(text, url, hashtags);
```

### shareToTelegram
Share to Telegram.
```ts
import { shareToTelegram } from '@/lib/utils/shareToTelegram';

shareToTelegram(text, url);
```

## Helper Utilities

### parseError
Parse error messages.
```ts
import { parseError } from '@/lib/utils/parseError';

const message = parseError(error); // User-friendly string
```

### debounce
Debounce function calls.
```ts
import { debounce } from '@/lib/utils/debounce';

const debouncedFn = debounce(fn, 500);
```

### throttle
Throttle function calls.
```ts
import { throttle } from '@/lib/utils/throttle';

const throttledFn = throttle(fn, 1000);
```

### sleep
Delay execution.
```ts
import { sleep } from '@/lib/utils/sleep';

await sleep(1000); // Wait 1 second
```
