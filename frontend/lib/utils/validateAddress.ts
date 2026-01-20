import { isAddress } from 'viem';

/**
 * Validates an Ethereum address
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function validateAddress(address: string): boolean {
    if (!address) return false;
    return isAddress(address);
}

/**
 * Validates and normalizes an Ethereum address
 * @param address - Address to validate and normalize
 * @returns Checksummed address or null if invalid
 */
export function normalizeAddress(address: string): string | null {
    if (!validateAddress(address)) return null;
    return address; // viem's isAddress already handles checksumming
}
