# Frontend Components API

## UI Components

### Button
Primary action button.
```tsx
import Button from '@/components/ui/Button';

<Button onClick={handleClick} fullWidth>
  Click Me
</Button>
```

**Props:**
- `children`: ReactNode
- `fullWidth?`: boolean
- `...HTMLButtonAttributes`

### LoadingButton
Button with loading state.
```tsx
import LoadingButton from '@/components/ui/LoadingButton';

<LoadingButton 
  isLoading={isSubmitting}
  loadingText="Submitting..."
  variant="primary"
>
  Submit
</LoadingButton>
```

**Props:**
- `isLoading?`: boolean
- `loadingText?`: string
- `variant?`: 'primary' | 'secondary'
- `fullWidth?`: boolean

### Modal
Accessible modal dialog.
```tsx
import Modal from '@/components/ui/Modal';
import ModalHeader from '@/components/ui/ModalHeader';
import ModalBody from '@/components/ui/ModalBody';

<Modal isOpen={isOpen} onClose={handleClose} size="md">
  <ModalHeader onClose={handleClose}>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `size?`: 'sm' | 'md' | 'lg' | 'xl'

### Alert
Notification component.
```tsx
import Alert from '@/components/ui/Alert';

<Alert variant="success" title="Success">
  Operation completed successfully
</Alert>
```

**Props:**
- `variant?`: 'info' | 'success' | 'warning' | 'error'
- `title?`: string
- `children`: ReactNode

## Market Components

### MarketStatus
Display market status badge.
```tsx
import MarketStatus from '@/components/market/MarketStatus';

<MarketStatus status={0} />
```

**Props:**
- `status`: number (0=Open, 1=Resolved, 2=Cancelled)

### MarketProbability
Show YES/NO probabilities.
```tsx
import MarketProbability from '@/components/market/MarketProbability';

<MarketProbability 
  yesShares={BigInt(600)} 
  noShares={BigInt(400)} 
/>
```

**Props:**
- `yesShares`: bigint
- `noShares`: bigint

### BuyButton
Market buy action button.
```tsx
import BuyButton from '@/components/market/BuyButton';

<BuyButton 
  isYes={true}
  percent={60}
  onClick={handleBuy}
/>
```

**Props:**
- `isYes`: boolean
- `percent`: number
- `onClick`: MouseEventHandler

## Form Components

### SearchInput
Search input with icon.
```tsx
import SearchInput from '@/components/forms/SearchInput';

<SearchInput 
  placeholder="Search markets..."
  onChange={handleSearch}
/>
```

### AmountInput
Numeric input with currency.
```tsx
import AmountInput from '@/components/forms/AmountInput';

<AmountInput 
  currency="USDC"
  label="Amount"
  onChange={handleChange}
/>
```

**Props:**
- `currency?`: string
- `label?`: string
- All Input props
