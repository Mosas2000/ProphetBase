# Writing Component Tests

## Test Structure

### Basic Component Test
```tsx
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Testing Patterns

### Render Tests
```tsx
it('renders correctly', () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toBeInTheDocument();
});
```

### Interaction Tests
```tsx
it('handles clicks', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Click</Button>);
  await user.click(screen.getByText('Click'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Snapshot Tests
```tsx
it('matches snapshot', () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toMatchSnapshot();
});
```

### Async Tests
```tsx
it('loads data', async () => {
  render(<AsyncComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

## Testing Hooks

### Custom Hook Testing
```tsx
import { renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

it('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Mocking

### Mock Functions
```tsx
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue(Promise.resolve('async value'));
```

### Mock Modules
```tsx
jest.mock('next/link', () => {
  return ({ children }) => children;
});
```

### Mock Web3
```tsx
jest.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x123...' }),
  useBalance: () => ({ data: { formatted: '1.0' } }),
}));
```

## Best Practices
- Test user behavior, not implementation
- Use `screen` queries over `container`
- Prefer `getByRole` over `getByTestId`
- Test accessibility
- Keep tests simple and focused
