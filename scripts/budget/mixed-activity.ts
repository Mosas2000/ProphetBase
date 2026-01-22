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

// Configuration - Mixed strategy
const MICRO_AMOUNT = ethers.parseUnits('0.05', 6); // 0.05 USDC
const MEDIUM_AMOUNT = ethers.parseUnits('0.20', 6); // 0.20 USDC
const LARGE_AMOUNT = ethers.parseUnits('2.0', 6); // Full $2 USDC

const MICRO_TRADES = 15;
const MEDIUM_TRADES = 5;
const POSITION_FLIPS = 3;
const TOTAL_TARGET = (MICRO_TRADES + MEDIUM_TRADES + POSITION_FLIPS) * 2; // Each includes buy + sell

const MIN_ETH_BALANCE = ethers.parseEther('0.00005'); // Stop if below ~1 transaction worth

// Market IDs
const MARKETS = [0, 1, 2];

// Random delay between 5-15 seconds
function randomDelay(): number {
  return Math.floor(Math.random() * 10000) + 5000; // 5-15 seconds
}

// Random market selection
function randomMarket(): number {
  return MARKETS[Math.floor(Math.random() * MARKETS.length)];
}

// Random outcome
function randomOutcome(): boolean {
  return Math.random() > 0.5;
}

async function main() {
  console.log('\n🎲 MIXED ACTIVITY GENERATOR');
  console.log('='.repeat(60));
  console.log(`📊 Strategy Mix:`);
  console.log(`   - ${MICRO_TRADES} micro-trades (0.05 USDC each)`);
  console.log(`   - ${MEDIUM_TRADES} medium trades (0.20 USDC each)`);
  console.log(`   - ${POSITION_FLIPS} position flips (full $2 USDC)`);
  console.log(`🎯 Total Target: ~${TOTAL_TARGET} transactions`);
  console.log(`⏱️  Variable delays: 5-15 seconds`);
  console.log(`🎲 Randomized markets and outcomes`);
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

    // User confirmation
    console.log(
      '\n⚠️  Ready to start mixed activity. Press Ctrl+C to cancel...'
    );
    await sleep(5000);

    // Activity tracking
    const transactions: TransactionLog[] = [];
    let totalGasUsed = BigInt(0);
    let totalGasCost = BigInt(0);
    let successCount = 0;
    let txCount = 0;

    // Helper function to execute a trade
    async function executeTrade(
      tradeType: string,
      amount: bigint,
      marketId: number,
      outcome: boolean
    ): Promise<void> {
      const outcomeName = outcome ? 'YES' : 'NO';
      const amountFormatted = ethers.formatUnits(amount, 6);

      try {
        // Check balances
        const currentEthBalance = await provider.getBalance(address);
        if (currentEthBalance < MIN_ETH_BALANCE) {
          console.log('\n⚠️  ETH balance too low! Skipping...');
          return;
        }

        const currentUsdcBalance = await usdc.balanceOf(address);
        if (currentUsdcBalance < amount) {
          console.log(`\n⚠️  Insufficient USDC for ${tradeType}! Skipping...`);
          return;
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(
          `${tradeType.toUpperCase()} - Market ${marketId} - ${outcomeName}`
        );
        console.log(`💵 Amount: ${amountFormatted} USDC`);
        console.log(`${'='.repeat(60)}`);

        // Approve if needed
        const currentAllowance = await usdc.allowance(
          address,
          PREDICTION_MARKET_ADDRESS
        );
        if (currentAllowance < amount) {
          txCount++;
          console.log(`\n[${txCount}] 🔓 Approving ${amountFormatted} USDC...`);

          const approveTx = await usdc.approve(
            PREDICTION_MARKET_ADDRESS,
            amount
          );
          const approveReceipt = await approveTx.wait();

          if (approveReceipt) {
            const gasUsed = approveReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;

            transactions.push({
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Approve (${tradeType})`,
              market: marketId,
              amount: amountFormatted,
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: approveReceipt.hash,
              basescanLink: `https://basescan.org/tx/${approveReceipt.hash}`,
            });

            console.log(
              `   ✅ Approved | Gas: ${ethers.formatEther(gasCost)} ETH`
            );
          }

          await sleep(randomDelay());
        }

        // Buy shares
        txCount++;
        console.log(`\n[${txCount}] 💰 Buying ${outcomeName} shares...`);

        const buyTx = await predictionMarket.buyShares(
          marketId,
          outcome,
          amount
        );
        const buyReceipt = await buyTx.wait();

        if (buyReceipt) {
          const gasUsed = buyReceipt.gasUsed;
          const gasCost = gasUsed * gasPrice;
          totalGasUsed += gasUsed;
          totalGasCost += gasCost;
          successCount++;

          const shares = await predictionMarket.getShareBalance(
            marketId,
            address,
            outcome
          );

          transactions.push({
            timestamp: new Date().toISOString(),
            txNumber: txCount,
            type: `Buy ${outcomeName} (${tradeType})`,
            market: marketId,
            amount: amountFormatted,
            gasUsed: gasUsed.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
            txHash: buyReceipt.hash,
            basescanLink: `https://basescan.org/tx/${buyReceipt.hash}`,
          });

          console.log(
            `   ✅ Bought ${ethers
              .formatUnits(shares, 18)
              .substring(0, 8)} shares`
          );
          console.log(
            `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
              ethers.formatEther(gasCost)
            )})`
          );
          console.log(`   🔗 https://basescan.org/tx/${buyReceipt.hash}`);
        }

        await sleep(randomDelay());

        // Sell shares
        txCount++;
        console.log(`\n[${txCount}] 📤 Selling ${outcomeName} shares...`);

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
              type: `Sell ${outcomeName} (${tradeType})`,
              market: marketId,
              amount: ethers.formatUnits(shareBalance, 18),
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: sellReceipt.hash,
              basescanLink: `https://basescan.org/tx/${sellReceipt.hash}`,
            });

            console.log(
              `   ✅ Sold ${ethers
                .formatUnits(shareBalance, 18)
                .substring(0, 8)} shares`
            );
            console.log(
              `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
                ethers.formatEther(gasCost)
              )})`
            );
            console.log(`   🔗 https://basescan.org/tx/${sellReceipt.hash}`);
          }
        }

        // Show progress
        console.log(
          `\n   📊 Progress: ${successCount} successful transactions`
        );
        console.log(
          `   💰 Total Gas Cost: ${ethers.formatEther(
            totalGasCost
          )} ETH (${formatUSD(ethers.formatEther(totalGasCost))})`
        );
      } catch (error: any) {
        console.error(`\n❌ Error in ${tradeType}:`, error.message);
      }
    }

    // Execute mixed strategy
    console.log('\n🚀 Starting mixed activity generation...\n');

    // Phase 1: Micro-trades
    console.log('\n' + '='.repeat(60));
    console.log('📍 PHASE 1: MICRO-TRADES');
    console.log('='.repeat(60));

    for (let i = 0; i < MICRO_TRADES; i++) {
      await executeTrade(
        `Micro #${i + 1}`,
        MICRO_AMOUNT,
        randomMarket(),
        randomOutcome()
      );
      await sleep(randomDelay());
    }

    // Phase 2: Medium trades
    console.log('\n' + '='.repeat(60));
    console.log('📍 PHASE 2: MEDIUM TRADES');
    console.log('='.repeat(60));

    for (let i = 0; i < MEDIUM_TRADES; i++) {
      await executeTrade(
        `Medium #${i + 1}`,
        MEDIUM_AMOUNT,
        randomMarket(),
        randomOutcome()
      );
      await sleep(randomDelay());
    }

    // Phase 3: Position flips (use current USDC balance for each)
    console.log('\n' + '='.repeat(60));
    console.log('📍 PHASE 3: POSITION FLIPS');
    console.log('='.repeat(60));

    for (let i = 0; i < POSITION_FLIPS; i++) {
      const currentUsdcBalance = await usdc.balanceOf(address);
      const useAmount =
        currentUsdcBalance >= LARGE_AMOUNT ? LARGE_AMOUNT : currentUsdcBalance;

      if (useAmount > 0) {
        await executeTrade(
          `Position Flip #${i + 1}`,
          useAmount,
          randomMarket(),
          randomOutcome()
        );
        await sleep(randomDelay());
      }
    }

    // Final summary
    const endEthBalance = await provider.getBalance(address);
    const endUsdcBalance = await usdc.balanceOf(address);
    const avgCostPerTx =
      successCount > 0 ? totalGasCost / BigInt(successCount) : BigInt(0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL SUMMARY - MIXED ACTIVITY');
    console.log('='.repeat(60));
    console.log(`✅ Total Transactions Completed: ${successCount}`);
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
    console.log(
      `💰 Remaining ETH: ${ethers.formatEther(endEthBalance)} ETH (${formatUSD(
        ethers.formatEther(endEthBalance)
      )})`
    );
    console.log(
      `💰 ETH Spent: ${ethers.formatEther(startEthBalance - endEthBalance)} ETH`
    );
    console.log(
      `💵 Starting USDC: ${ethers.formatUnits(startUsdcBalance, 6)} USDC`
    );
    console.log(
      `💵 Remaining USDC: ${ethers.formatUnits(endUsdcBalance, 6)} USDC`
    );
    console.log('='.repeat(60));

    // Breakdown by trade type
    const microTxs = transactions.filter((t) => t.type.includes('Micro'));
    const mediumTxs = transactions.filter((t) => t.type.includes('Medium'));
    const flipTxs = transactions.filter((t) => t.type.includes('Flip'));

    console.log(`\n📊 Breakdown by Strategy:`);
    console.log(`   Micro-trades: ${microTxs.length} transactions`);
    console.log(`   Medium trades: ${mediumTxs.length} transactions`);
    console.log(`   Position flips: ${flipTxs.length} transactions`);

    // Save activity log
    await saveActivityLog({
      script: 'mixed-activity',
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
        successRate: '100%',
        startTime: transactions[0]?.timestamp || '',
        endTime: transactions[transactions.length - 1]?.timestamp || '',
      },
    });

    console.log(`\n💾 Activity log saved to budget-activity-log.json`);
    console.log(`\n✨ Mixed activity generation complete!`);
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
