# Running Tests

## Unit Tests

### Run All Tests
```bash
cd frontend
npm test
```

### Run Specific Test File
```bash
npm test Button.test.tsx
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage Report
```bash
npm test -- --coverage
```

## E2E Tests (Playwright)

### Install Browsers
```bash
npx playwright install
```

### Run E2E Tests
```bash
npx playwright test
```

### Run in UI Mode
```bash
npx playwright test --ui
```

### Run Specific Browser
```bash
npx playwright test --project=chromium
```

### Debug Mode
```bash
npx playwright test --debug
```

## Contract Tests (Hardhat)

### Run All Contract Tests
```bash
npx hardhat test
```

### Run Specific Test
```bash
npx hardhat test test/PredictionMarket.test.ts
```

### Gas Report
```bash
REPORT_GAS=true npx hardhat test
```

### Coverage
```bash
npx hardhat coverage
```

## Test Structure

### Component Tests
```
frontend/__tests__/
├── ui/
│   ├── Button.test.tsx
│   └── Modal.test.tsx
├── market/
│   └── MarketCard.test.tsx
└── ...
```

### E2E Tests
```
frontend/e2e/
├── home.spec.ts
├── market.spec.ts
└── trading.spec.ts
```

### Contract Tests
```
test/
├── PredictionMarket.test.ts
└── OutcomeToken.test.ts
```

## CI/CD Testing

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npx playwright test
```

## Best Practices
- Write tests before fixing bugs
- Aim for 80%+ coverage
- Test edge cases
- Mock external dependencies
- Keep tests fast and isolated
