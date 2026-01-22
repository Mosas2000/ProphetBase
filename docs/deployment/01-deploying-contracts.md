# Deploying to Base Mainnet

## Prerequisites
- Hardhat project configured
- Private key with ETH on Base
- BaseScan API key (for verification)

## Environment Setup

Create `.env` file:
```bash
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_api_key
BASE_RPC_URL=https://mainnet.base.org
```

## Deployment Steps

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Run Deployment Script
```bash
npx hardhat run scripts/deploy.ts --network baseMainnet
```

### 3. Verify on BaseScan
```bash
npx hardhat verify --network baseMainnet DEPLOYED_ADDRESS
```

## Post-Deployment

### Update Frontend
1. Copy deployed address
2. Update `frontend/lib/contracts.ts`
3. Commit changes

### Test Deployment
1. Create a test market
2. Buy shares
3. Verify on BaseScan

## Mainnet Checklist
- [ ] Contracts audited
- [ ] Tests passing (100% coverage)
- [ ] Deployment script tested on testnet
- [ ] Frontend updated with new addresses
- [ ] BaseScan verification complete
- [ ] Initial liquidity provided
- [ ] Monitoring setup

## Common Issues

### Insufficient Funds
Ensure wallet has enough ETH for:
- Contract deployment gas
- Initial transactions
- Buffer for price fluctuations

### Verification Failed
- Check API key is correct
- Ensure contract source matches
- Wait a few minutes and retry

## Next Steps
- [Deploying Frontend](./02-deploying-frontend.md)
- [Monitoring](./03-monitoring.md)
