/**
 * ProphetBase Contract Configuration & ABIs
 */

export const PREDICTION_MARKET_ADDRESS = '0x27177c0edc143CA33119fafD907e8600deF5Ba74' as const
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

// Re-export ABIs from abi.ts
export { PREDICTION_MARKET_ABI, ERC20_ABI } from './abi'

export const BASE_MAINNET = {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
} as const
