/**
 * PredictionMarket Contract ABI
 * Contains the essential functions for interacting with the ProphetBase contract
 */
export const PREDICTION_MARKET_ABI = [
    {
        inputs: [
            { internalType: 'string', name: 'question', type: 'string' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' }
        ],
        name: 'createMarket',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { internalType: 'bool', name: 'buyYes', type: 'bool' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'buyShares',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { internalType: 'bool', name: 'outcome', type: 'bool' }
        ],
        name: 'resolveMarket',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
        name: 'claimWinnings',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'marketCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'markets',
        outputs: [
            { internalType: 'string', name: 'question', type: 'string' },
            { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            { internalType: 'uint256', name: 'resolutionTime', type: 'uint256' },
            { internalType: 'enum PredictionMarket.MarketStatus', name: 'status', type: 'uint8' },
            { internalType: 'bool', name: 'outcome', type: 'bool' },
            { internalType: 'address', name: 'yesToken', type: 'address' },
            { internalType: 'address', name: 'noToken', type: 'address' },
            { internalType: 'uint256', name: 'totalYesShares', type: 'uint256' },
            { internalType: 'uint256', name: 'totalNoShares', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'collateralToken',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { indexed: false, internalType: 'string', name: 'question', type: 'string' },
            { indexed: false, internalType: 'address', name: 'yesToken', type: 'address' },
            { indexed: false, internalType: 'address', name: 'noToken', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'endTime', type: 'uint256' }
        ],
        name: 'MarketCreated',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
            { indexed: false, internalType: 'bool', name: 'outcome', type: 'bool' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'SharesPurchased',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { indexed: false, internalType: 'bool', name: 'outcome', type: 'bool' },
            { indexed: false, internalType: 'uint256', name: 'resolutionTime', type: 'uint256' }
        ],
        name: 'MarketResolved',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'claimer', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'WinningsClaimed',
        type: 'event'
    }
] as const

/**
 * ERC20 ABI for USDC interactions
 */
export const ERC20_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const
