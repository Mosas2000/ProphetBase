import fs from 'fs';
import { ethers } from 'hardhat';
import path from 'path';

// Types
export interface TransactionLog {
  timestamp: string;
  txNumber: number;
  type: string;
  market: number;
  amount: string;
  gasUsed: string;
  gasCostETH: string;
  gasCostUSD: string;
  txHash: string;
  basescanLink: string;
}

export interface Summary {
  totalTransactions: number;
  totalGasUsed: string;
  totalGasCostETH: string;
  totalGasCostUSD: string;
  averageCostPerTx: string;
  remainingETH: string;
  remainingUSDC: string;
  successRate: string;
  startTime: string;
  endTime: string;
}

export interface ActivityLog {
  script: string;
  startBalance: {
    eth: string;
    usdc: string;
  };
  transactions: TransactionLog[];
  summary: Summary;
}

// Constants
const ETH_USD_PRICE = 3200; // Approximate ETH price in USD
const LOG_FILE = path.join(__dirname, '../../budget-activity-log.json');

/**
 * Convert ETH amount to USD
 */
export function formatUSD(ethAmount: string | number): string {
  const eth = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  return `$${(eth * ETH_USD_PRICE).toFixed(2)}`;
}

/**
 * Calculate gas cost from gas used and gas price
 */
export function formatGas(
  gasUsed: bigint,
  gasPrice: bigint
): {
  eth: string;
  usd: string;
} {
  const gasCostWei = gasUsed * gasPrice;
  const gasCostETH = ethers.formatEther(gasCostWei);
  const gasCostUSD = (parseFloat(gasCostETH) * ETH_USD_PRICE).toFixed(4);

  return {
    eth: gasCostETH,
    usd: gasCostUSD,
  };
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Estimate transaction cost
 */
export async function estimateTxCost(
  gasLimit: number,
  provider: ethers.Provider
): Promise<{ eth: string; usd: string }> {
  const gasPrice = (await provider.getFeeData()).gasPrice || BigInt(0);
  const estimatedCost = BigInt(gasLimit) * gasPrice;
  const ethCost = ethers.formatEther(estimatedCost);
  const usdCost = (parseFloat(ethCost) * ETH_USD_PRICE).toFixed(4);

  return {
    eth: ethCost,
    usd: usdCost,
  };
}

/**
 * Check if user has sufficient balance
 */
export async function checkBalance(
  signer: ethers.Signer,
  requiredETH: string,
  requiredUSDC: string,
  usdcContract: ethers.Contract
): Promise<{ hasEnough: boolean; ethBalance: string; usdcBalance: string }> {
  const address = await signer.getAddress();
  const ethBalance = await signer.provider!.getBalance(address);
  const usdcBalance = await usdcContract.balanceOf(address);

  const ethBalanceFormatted = ethers.formatEther(ethBalance);
  const usdcBalanceFormatted = ethers.formatUnits(usdcBalance, 6);

  const hasEnoughETH =
    parseFloat(ethBalanceFormatted) >= parseFloat(requiredETH);
  const hasEnoughUSDC =
    parseFloat(usdcBalanceFormatted) >= parseFloat(requiredUSDC);

  return {
    hasEnough: hasEnoughETH && hasEnoughUSDC,
    ethBalance: ethBalanceFormatted,
    usdcBalance: usdcBalanceFormatted,
  };
}

/**
 * Log transaction to JSON file
 */
export async function logTransaction(
  scriptName: string,
  txLog: TransactionLog,
  isFirstTx: boolean = false,
  startBalance?: { eth: string; usdc: string }
): Promise<void> {
  let activityLog: ActivityLog;

  // Read existing log or create new one
  if (fs.existsSync(LOG_FILE)) {
    const fileContent = fs.readFileSync(LOG_FILE, 'utf-8');
    activityLog = JSON.parse(fileContent);
  } else {
    activityLog = {
      script: scriptName,
      startBalance: startBalance || { eth: '0', usdc: '0' },
      transactions: [],
      summary: {
        totalTransactions: 0,
        totalGasUsed: '0',
        totalGasCostETH: '0',
        totalGasCostUSD: '0',
        averageCostPerTx: '0',
        remainingETH: '0',
        remainingUSDC: '0',
        successRate: '0%',
        startTime: new Date().toISOString(),
        endTime: '',
      },
    };
  }

  // Add transaction
  activityLog.transactions.push(txLog);

  // Write to file
  fs.writeFileSync(LOG_FILE, JSON.stringify(activityLog, null, 2));
}

/**
 * Update summary in log file
 */
export async function updateSummary(summary: Partial<Summary>): Promise<void> {
  if (!fs.existsSync(LOG_FILE)) {
    console.warn('⚠️  Log file does not exist. Cannot update summary.');
    return;
  }

  const fileContent = fs.readFileSync(LOG_FILE, 'utf-8');
  const activityLog: ActivityLog = JSON.parse(fileContent);

  activityLog.summary = {
    ...activityLog.summary,
    ...summary,
    endTime: new Date().toISOString(),
  };

  fs.writeFileSync(LOG_FILE, JSON.stringify(activityLog, null, 2));
}

/**
 * Save complete activity log to file
 */
export async function saveActivityLog(activityLog: ActivityLog): Promise<void> {
  fs.writeFileSync(LOG_FILE, JSON.stringify(activityLog, null, 2));
  console.log(`\n💾 Activity log saved to: ${LOG_FILE}`);
}

/**
 * Get current ETH price (mock for now, could integrate with price oracle)
 */
export function getEthPrice(): number {
  return ETH_USD_PRICE;
}

/**
 * Format Basescan link
 */
export function getBasescanLink(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * Display progress bar
 */
export function displayProgress(
  current: number,
  total: number,
  label: string = ''
): void {
  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  process.stdout.write(
    `\r${label} [${bar}] ${percentage}% (${current}/${total})`
  );

  if (current === total) {
    console.log(); // New line when complete
  }
}

/**
 * Clear log file (for new script run)
 */
export function clearLogFile(): void {
  if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
  }
}

/**
 * Prompt user for confirmation
 */
export async function confirmStart(message: string): Promise<boolean> {
  console.log('\n' + '='.repeat(60));
  console.log(message);
  console.log('='.repeat(60));
  console.log(
    '\n⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n'
  );

  await sleep(5000);
  return true;
}
