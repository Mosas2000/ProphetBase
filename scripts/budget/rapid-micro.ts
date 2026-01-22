import { ethers } from 'hardhat';
import {
  formatUSD,
  saveActivityLog,
  sleep,
  type TransactionLog,
} from './helpers';

// Contract addresses on Base
const PREDICTION_MARKET_ADDRESS = '0x27177c0edc143CA33119fafD907e8600deF5Ba74';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Configuration
const TRADE_AMOUNT = ethers.parseUnits('0.02', 6); // Ultra-small: 0.02 USDC
const TARGET_TRANSACTIONS = 100;
const DELAY_BETWEEN_TXS = 2000; // 2 seconds (faster)
const MIN_ETH_BALANCE = ethers.parseEther('0.00005'); // Stop if below ~1 transaction worth
const BUDGET_LIMIT_ETH = ethers.parseEther('0.0002'); // Auto-stop approaching limit

// Market IDs to rotate through
const MARKETS = [0, 1, 2];

// Simple progress bar
function drawProgressBar(
  current: number,
  total: number,
  width: number = 40
): string {
  const percentage = Math.min(current / total, 1);
  const filled = Math.floor(percentage * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = (percentage * 100).toFixed(1);
  return `[${bar}] ${percent}% (${current}/${total})`;
}

async function main() {
  console.log('\n⚡ RAPID MICRO-TRADES ACTIVITY GENERATOR');
  console.log('='.repeat(60));
  console.log(`💵 Trade Amount: 0.02 USDC (Ultra-small)`);
  console.log(`🎯 Target Transactions: ${TARGET_TRANSACTIONS}`);
  console.log(`⏱️  Delay Between Txs: ${DELAY_BETWEEN_TXS / 1000}s`);
  console.log(`⚠️  This is AGGRESSIVE - monitor gas costs closely!`);
  console.log('='.repeat(60));

  try {
    // Get signer
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`\n📍 Your address: ${address}`);

    // Get provider
    const provider = deployer.provider!;

    // Connect to contracts
    const predictionMarket = await ethers.getContractAt(
      [
        'function buyShares(uint256 marketId, bool outcome, uint256 amount) external',
        'function sellShares(uint256 marketId, bool outcome, uint256 amount) external',
        'function getShareBalance(uint256 marketId, address user, bool outcome) view returns (uint256)',
      ],
      PREDICTION_MARKET_ADDRESS
    );

    const usdc = await ethers.getContractAt(
      [
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function balanceOf(address account) view returns (uint256)',
        'function allowance(address owner, address spender) view returns (uint256)',
      ],
      USDC_ADDRESS
    );

    // Check initial balances
    const startEthBalance = await provider.getBalance(address);
    const startUsdcBalance = await usdc.balanceOf(address);

    console.log(
      `\n💰 Starting ETH Balance: ${ethers.formatEther(
        startEthBalance
      )} ETH (${formatUSD(ethers.formatEther(startEthBalance))})`
    );
    console.log(
      `💵 Starting USDC Balance: ${ethers.formatUnits(
        startUsdcBalance,
        6
      )} USDC`
    );

    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);
    console.log(
      `⛽ Current Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`
    );

    // Estimate total cost
    const estimatedGasPerTx = 200000;
    const estimatedCostPerTx = BigInt(estimatedGasPerTx) * gasPrice;
    const totalEstimatedCost = estimatedCostPerTx * BigInt(TARGET_TRANSACTIONS);
    console.log(
      `\n📊 Estimated total gas cost: ${ethers.formatEther(
        totalEstimatedCost
      )} ETH (${formatUSD(ethers.formatEther(totalEstimatedCost))})`
    );

    // Risk warning
    console.log('\n⚠️  RISK WARNING:');
    console.log('   - This will execute 100 transactions rapidly');
    console.log('   - Gas costs may exceed benefits from trading');
    console.log('   - Monitor your ETH balance closely');
    console.log('   - Will auto-stop if approaching budget limit');

    // User confirmation
    console.log('\n⚠️  Press Ctrl+C within 10 seconds to cancel...');
    await sleep(10000);

    // Activity tracking
    const transactions: TransactionLog[] = [];
    let totalGasUsed = BigInt(0);
    let totalGasCost = BigInt(0);
    let successCount = 0;
    let txCount = 0;
    let failureCount = 0;

    console.log('\n🚀 Starting rapid micro-trades...\n');

    // Main trading loop
    const cycles = Math.ceil(TARGET_TRANSACTIONS / 2); // Each cycle is approve + buy/sell

    for (let cycle = 0; cycle < cycles; cycle++) {
      // Check ETH balance
      const currentEthBalance = await provider.getBalance(address);
      const ethSpent = startEthBalance - currentEthBalance;

      if (currentEthBalance < MIN_ETH_BALANCE) {
        console.log('\n⚠️  ETH balance too low! Stopping...');
        break;
      }

      if (ethSpent > BUDGET_LIMIT_ETH) {
        console.log('\n⚠️  Approaching budget limit! Stopping for safety...');
        break;
      }

      // Determine market and outcome
      const marketId = MARKETS[cycle % MARKETS.length];
      const outcome = cycle % 2 === 0;
      const outcomeName = outcome ? 'YES' : 'NO';

      try {
        // Approve USDC if needed (try to minimize approvals)
        const currentAllowance = await usdc.allowance(
          address,
          PREDICTION_MARKET_ADDRESS
        );
        if (currentAllowance < TRADE_AMOUNT) {
          // Approve for multiple trades at once to save gas
          const approvalAmount = TRADE_AMOUNT * BigInt(10);
          const approveTx = await usdc.approve(
            PREDICTION_MARKET_ADDRESS,
            approvalAmount
          );
          const approveReceipt = await approveTx.wait();

          if (approveReceipt) {
            const gasUsed = approveReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;
            txCount++;
          }
        }

        // Buy shares
        txCount++;
        const buyTx = await predictionMarket.buyShares(
          marketId,
          outcome,
          TRADE_AMOUNT
        );
        const buyReceipt = await buyTx.wait();

        if (buyReceipt) {
          const gasUsed = buyReceipt.gasUsed;
          const gasCost = gasUsed * gasPrice;
          totalGasUsed += gasUsed;
          totalGasCost += gasCost;
          successCount++;

          transactions.push({
            timestamp: new Date().toISOString(),
            txNumber: txCount,
            type: `Buy ${outcomeName}`,
            market: marketId,
            amount: '0.02',
            gasUsed: gasUsed.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
            txHash: buyReceipt.hash,
            basescanLink: `https://basescan.org/tx/${buyReceipt.hash}`,
          });

          // Update progress bar every transaction
          process.stdout.write(
            `\r${drawProgressBar(txCount, TARGET_TRANSACTIONS)} | Gas: ${ethers
              .formatEther(totalGasCost)
              .substring(0, 8)} ETH`
          );
        }

        await sleep(DELAY_BETWEEN_TXS);

        // Sell shares immediately
        txCount++;
        const shareBalance = await predictionMarket.getShareBalance(
          marketId,
          address,
          outcome
        );

        if (shareBalance > 0) {
          // Sell 99% to avoid rounding errors
          const sellAmount = (shareBalance * BigInt(99)) / BigInt(100);

          const sellTx = await predictionMarket.sellShares(
            marketId,
            outcome,
            sellAmount
          );
          const sellReceipt = await sellTx.wait();

          if (sellReceipt) {
            const gasUsed = sellReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;

            transactions.push({
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Sell ${outcomeName}`,
              market: marketId,
              amount: ethers.formatUnits(shareBalance, 18),
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: sellReceipt.hash,
              basescanLink: `https://basescan.org/tx/${sellReceipt.hash}`,
            });

            // Update progress bar
            process.stdout.write(
              `\r${drawProgressBar(
                txCount,
                TARGET_TRANSACTIONS
              )} | Gas: ${ethers.formatEther(totalGasCost).substring(0, 8)} ETH`
            );
          }
        }

        // Very short delay
        await sleep(DELAY_BETWEEN_TXS);

        // Stop if we hit target
        if (txCount >= TARGET_TRANSACTIONS) {
          break;
        }
      } catch (error: any) {
        failureCount++;
        // Silent failure, just continue
        if (failureCount > 5) {
          console.log('\n\n❌ Too many failures, stopping...');
          break;
        }
      }
    }

    // Clear progress bar line
    console.log('\n');

    // Final summary
    const endEthBalance = await provider.getBalance(address);
    const endUsdcBalance = await usdc.balanceOf(address);
    const avgCostPerTx =
      successCount > 0 ? totalGasCost / BigInt(successCount) : BigInt(0);
    const successRate = (successCount / TARGET_TRANSACTIONS) * 100;

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL SUMMARY - RAPID MICRO-TRADES');
    console.log('='.repeat(60));
    console.log(
      `✅ Total Transactions Completed: ${successCount}/${TARGET_TRANSACTIONS}`
    );
    console.log(`❌ Failed Transactions: ${failureCount}`);
    console.log(`⛽ Total Gas Used: ${totalGasUsed.toString()}`);
    console.log(
      `💸 Total Gas Cost: ${ethers.formatEther(totalGasCost)} ETH (${formatUSD(
        ethers.formatEther(totalGasCost)
      )})`
    );
    console.log(
      `📊 Average Cost Per Transaction: ${ethers.formatEther(
        avgCostPerTx
      )} ETH (${formatUSD(ethers.formatEther(avgCostPerTx))})`
    );
    console.log(`💰 Starting ETH: ${ethers.formatEther(startEthBalance)} ETH`);
    console.log(`💰 Remaining ETH: ${ethers.formatEther(endEthBalance)} ETH`);
    console.log(
      `💰 ETH Spent: ${ethers.formatEther(startEthBalance - endEthBalance)} ETH`
    );
    console.log(
      `💵 Remaining USDC: ${ethers.formatUnits(endUsdcBalance, 6)} USDC`
    );
    console.log(`📈 Success Rate: ${successRate.toFixed(2)}%`);
    console.log('='.repeat(60));

    // Warning if costs are high
    const costPercentage =
      (Number(totalGasCost) / Number(startEthBalance)) * 100;
    if (costPercentage > 50) {
      console.log(
        `\n⚠️  WARNING: Gas costs consumed ${costPercentage.toFixed(
          1
        )}% of your ETH!`
      );
    }

    // Save activity log
    await saveActivityLog({
      script: 'rapid-micro',
      startBalance: {
        eth: ethers.formatEther(startEthBalance),
        usdc: ethers.formatUnits(startUsdcBalance, 6),
      },
      transactions,
      summary: {
        totalTransactions: successCount,
        totalGasUsed: totalGasUsed.toString(),
        totalGasCostETH: ethers.formatEther(totalGasCost),
        totalGasCostUSD: formatUSD(ethers.formatEther(totalGasCost)),
        averageCostPerTx: ethers.formatEther(avgCostPerTx),
        remainingETH: ethers.formatEther(endEthBalance),
        remainingUSDC: ethers.formatUnits(endUsdcBalance, 6),
        successRate: `${successRate.toFixed(2)}%`,
        startTime: transactions[0]?.timestamp || '',
        endTime: transactions[transactions.length - 1]?.timestamp || '',
      },
    });

    console.log(`\n💾 Activity log saved to budget-activity-log.json`);

    // Show some transaction links
    if (transactions.length > 0) {
      console.log(`\n🔗 Sample transaction links:`);
      console.log(`   First: ${transactions[0].basescanLink}`);
      if (transactions.length > 1) {
        console.log(
          `   Last: ${transactions[transactions.length - 1].basescanLink}`
        );
      }
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
