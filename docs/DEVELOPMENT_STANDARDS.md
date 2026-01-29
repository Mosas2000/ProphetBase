# Code Documentation Standards

All code in ProphetBase must follow these documentation standards.

## TypeScript Standards (TSDoc)

We use TSDoc for all exported functions, interfaces, and classes.

```typescript
/**
 * Calculates the potential payout for a given stake.
 * 
 * @param amount - The amount to stake in USDC
 * @param probability - The current market probability (0-1)
 * @returns The estimated payout if the outcome is correct
 * 
 * @example
 * const payout = calculatePayout(100, 0.5); // returns 200
 */
export function calculatePayout(amount: number, probability: number): number {
  return amount / probability;
}
```

## Markdown Standards

- **Headers**: Use Title Case.
- **Links**: Use relative links for internal documents.
- **Diagrams**: Use Mermaid.js for flowcharts and sequences.

## Linting

Documentation coverage is enforced via:
- `eslint-plugin-tsdoc`
- custom scripts in `scripts/validate-docs.ts`
