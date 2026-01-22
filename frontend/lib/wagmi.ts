import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

if (!projectId) {
    console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

/**
 * Wagmi configuration for ProphetBase
 * Configured for Base mainnet (chainId: 8453)
 */
export const config = createConfig({
    chains: [base],
    connectors: [
        injected(),
        walletConnect({
            projectId,
            showQrModal: true,
        }),
    ],
    transports: {
        [base.id]: http(),
    },
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
