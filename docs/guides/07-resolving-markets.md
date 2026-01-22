# Resolving Markets

## Resolution Process
Markets are resolved after their end date has passed, determining the final outcome (YES or NO).

## Who Can Resolve
- **Current**: Contract owner/admin only
- **Future**: Decentralized oracle system

## Resolution Criteria
Markets can only be resolved when:
1. End date has passed
2. Market status is "Open"
3. Outcome is verifiable

## How Resolution Works

### Step 1: Market Closes
Trading stops automatically at the end date

### Step 2: Verification
The resolver verifies the actual outcome using reliable sources

### Step 3: Submit Resolution
Admin calls `resolveMarket()` with the correct outcome

### Step 4: Distribution
- Winning shares become claimable
- Losing shares become worthless
- Users can claim winnings

## Resolution Sources

### Crypto Markets
- CoinGecko, CoinMarketCap
- On-chain price feeds
- Timestamp-based snapshots

### Sports Markets
- Official league websites
- ESPN, major sports networks
- Final game scores

### Political Markets
- Official election results
- Government announcements
- Verified news sources

## Dispute Resolution
*Coming soon: Community dispute mechanism*

## Example Resolution

**Market**: "Will ETH reach $5k by March 31?"
**End Date**: March 31, 2024, 11:59 PM UTC
**Verification**: Check ETH price on CoinGecko at deadline
**Actual Price**: $4,850
**Resolution**: NO

## Admin Resolution Steps
```solidity
// Only contract owner
function resolveMarket(uint256 marketId, bool outcome) external onlyOwner {
    // Verify market can be resolved
    // Set outcome
    // Emit event
}
```

## After Resolution
- Market status changes to "Resolved"
- No more trading allowed
- Winners can claim payouts
- Market data remains visible

## Important Notes
- Resolutions are final and cannot be changed
- Verify outcome carefully before resolving
- Use multiple sources for verification
- Document resolution reasoning

## Future Improvements
- Chainlink oracle integration
- Community voting on outcomes
- Automated resolution for price-based markets
- Dispute period before finalization
