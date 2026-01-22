import { ethers } from 'hardhat';
import {
  estimateTxCost,
  formatUSD,
  saveActivityLog,
  sleep,
  type TransactionLog,
} from './helpers';

// Contract addresses on Base
const PREDICTION_MARKET_ADDRESS = '0x27177c0edc143CA33119fafD907e8600deF5Ba74';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Configuration
const TRADE_AMOUNT = ethers.parseUnits('0.05', 6); // 0.05 USDC
const TARGET_TRANSACTIONS = 40;
const DELAY_BETWEEN_TXS = 5000; // 5 seconds
const MIN_ETH_BALANCE = ethers.parseEther('0.00005'); // Stop if below ~1 transaction worth

// Market IDs to rotate through
const MARKETS = [0, 1, 2];

async function main() {
  console.log('\n🎯 MICRO-TRADES ACTIVITY GENERATOR');
  console.log('='.repeat(60));
  console.log(`💵 Trade Amount: 0.05 USDC`);
  console.log(`🎲 Target Transactions: ${TARGET_TRANSACTIONS}`);
  console.log(`⏱️  Delay Between Txs: ${DELAY_BETWEEN_TXS / 1000}s`);
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
    const estimatedCost = await estimateTxCost(200000, provider);
    const costPerTxETH = parseFloat(estimatedCost.eth);
    const totalEstimatedCostETH = costPerTxETH * TARGET_TRANSACTIONS;
    console.log(
      `\n📊 Estimated total gas cost: ${totalEstimatedCostETH.toFixed(
        8
      )} ETH (${formatUSD(totalEstimatedCostETH.toString())})`
    );

    // User confirmation
    console.log('\n⚠️  Ready to start trading. Press Ctrl+C to cancel...');
    await sleep(5000);

    // Activity tracking
    const transactions: TransactionLog[] = [];
    let totalGasUsed = BigInt(0);
    let totalGasCost = BigInt(0);
    let successCount = 0;
    let txCount = 0;

    // Main trading loop (20 cycles = 40 transactions)
    const cycles = TARGET_TRANSACTIONS / 2; // Each cycle is 2 txs (buy + sell)

    for (let cycle = 0; cycle < cycles; cycle++) {
      // Check balance before each cycle
      const currentEthBalance = await provider.getBalance(address);
      if (currentEthBalance < MIN_ETH_BALANCE) {
        console.log('\n⚠️  ETH balance too low! Stopping...');
        break;
      }

      // Determine market and outcome for this cycle
      const marketId = MARKETS[cycle % MARKETS.length];
      const outcome = cycle % 2 === 0; // Alternate between YES (true) and NO (false)
      const outcomeName = outcome ? 'YES' : 'NO';

      console.log(`\n${'='.repeat(60)}`);
      console.log(
        `🔄 CYCLE ${cycle + 1}/${cycles} - Market ${marketId} - ${outcomeName}`
      );
      console.log(`${'='.repeat(60)}`);

      try {
        // TRANSACTION 1: Approve USDC
        txCount++;
        console.log(
          `\n[${txCount}/${TARGET_TRANSACTIONS}] 🔓 Approving USDC...`
        );

        const currentAllowance = await usdc.allowance(
          address,
          PREDICTION_MARKET_ADDRESS
        );
        if (currentAllowance < TRADE_AMOUNT) {
          const approveTx = await usdc.approve(
            PREDICTION_MARKET_ADDRESS,
            TRADE_AMOUNT
          );
          const approveReceipt = await approveTx.wait();

          if (approveReceipt) {
            const gasUsed = approveReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;

            const txLog: TransactionLog = {
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Approve USDC`,
              market: marketId,
              amount: '0.05',
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: approveReceipt.hash,
              basescanLink: `https://basescan.org/tx/${approveReceipt.hash}`,
            };
            transactions.push(txLog);

            console.log(`   ✅ Gas Used: ${gasUsed.toString()}`);
            console.log(
              `   💸 Gas Cost: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
                ethers.formatEther(gasCost)
              )})`
            );
            console.log(`   🔗 ${txLog.basescanLink}`);
          }
        } else {
          console.log(`   ℹ️  Already approved`);
          txCount--; // Don't count this as a transaction
        }

        // Wait between transactions
        await sleep(DELAY_BETWEEN_TXS);

        // TRANSACTION 2: Buy shares
        txCount++;
        console.log(
          `\n[${txCount}/${TARGET_TRANSACTIONS}] 💰 Buying ${outcomeName} shares on Market ${marketId}...`
        );

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

          const txLog: TransactionLog = {
            timestamp: new Date().toISOString(),
            txNumber: txCount,
            type: `Buy ${outcomeName}`,
            market: marketId,
            amount: '0.05',
            gasUsed: gasUsed.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
            txHash: buyReceipt.hash,
            basescanLink: `https://basescan.org/tx/${buyReceipt.hash}`,
          };
          transactions.push(txLog);

          console.log(`   ✅ Gas Used: ${gasUsed.toString()}`);
          console.log(
            `   💸 Gas Cost: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
              ethers.formatEther(gasCost)
            )})`
          );
          console.log(
            `   💰 Running Total: ${ethers.formatEther(
              totalGasCost
            )} ETH (${formatUSD(ethers.formatEther(totalGasCost))})`
          );
          console.log(`   🔗 ${txLog.basescanLink}`);
        }

        // Wait before selling
        await sleep(DELAY_BETWEEN_TXS);

        // TRANSACTION 3: Sell shares
        txCount++;
        console.log(
          `\n[${txCount}/${TARGET_TRANSACTIONS}] 📤 Selling ${outcomeName} shares on Market ${marketId}...`
        );

        // Get share balance
        const shareBalance = await predictionMarket.getShareBalance(
          marketId,
          address,
          outcome
        );

        console.log(
          `   📊 Share Balance: ${ethers.formatUnits(shareBalance, 18)}`
        );

        if (shareBalance > 0) {
          // Sell 99% of shares to account for any rounding issues
          const sellAmount = (shareBalance * BigInt(99)) / BigInt(100);

          console.log(
            `   💱 Attempting to sell: ${ethers.formatUnits(
              sellAmount,
              18
            )} shares`
          );

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

            const txLog: TransactionLog = {
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Sell ${outcomeName}`,
              market: marketId,
              amount: ethers.formatUnits(sellAmount, 18),
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: sellReceipt.hash,
              basescanLink: `https://basescan.org/tx/${sellReceipt.hash}`,
            };
            transactions.push(txLog);

            console.log(`   ✅ Gas Used: ${gasUsed.toString()}`);
            console.log(
              `   💸 Gas Cost: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
                ethers.formatEther(gasCost)
              )})`
            );
            console.log(
              `   💰 Running Total: ${ethers.formatEther(
                totalGasCost
              )} ETH (${formatUSD(ethers.formatEther(totalGasCost))})`
            );
            console.log(`   🔗 ${txLog.basescanLink}`);
          }
        } else {
          console.log(`   ⚠️  No shares to sell`);
          txCount--; // Don't count this
        }

        // Show progress
        const remainingEth = await provider.getBalance(address);
        console.log(
          `\n   📊 Progress: ${txCount}/${TARGET_TRANSACTIONS} transactions`
        );
        console.log(`   ⛽ Total Gas Used: ${totalGasUsed.toString()}`);
        console.log(
          `   💸 Total Gas Cost: ${ethers.formatEther(
            totalGasCost
          )} ETH (${formatUSD(ethers.formatEther(totalGasCost))})`
        );
        console.log(
          `   💰 Remaining ETH: ${ethers.formatEther(remainingEth)} ETH`
        );

        // Wait before next cycle
        if (cycle < cycles - 1) {
          await sleep(DELAY_BETWEEN_TXS);
        }
      } catch (error: any) {
        console.error(`\n❌ Error in cycle ${cycle + 1}:`, error.message);
        // Continue with next cycle
      }
    }

    // Final summary
    const endEthBalance = await provider.getBalance(address);
    const endUsdcBalance = await usdc.balanceOf(address);
    const avgCostPerTx =
      txCount > 0 ? totalGasCost / BigInt(txCount) : BigInt(0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL SUMMARY');
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
    console.log(
      `💰 Remaining ETH: ${ethers.formatEther(endEthBalance)} ETH (${formatUSD(
        ethers.formatEther(endEthBalance)
      )})`
    );
    console.log(
      `💵 Remaining USDC: ${ethers.formatUnits(endUsdcBalance, 6)} USDC`
    );
    console.log(
      `📈 Success Rate: ${((successCount / TARGET_TRANSACTIONS) * 100).toFixed(
        2
      )}%`
    );
    console.log('='.repeat(60));

    // Save activity log
    await saveActivityLog({
      script: 'micro-trades',
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
        successRate: `${((successCount / TARGET_TRANSACTIONS) * 100).toFixed(
          2
        )}%`,
        startTime: transactions[0]?.timestamp || '',
        endTime: transactions[transactions.length - 1]?.timestamp || '',
      },
    });

    console.log(`\n💾 Activity log saved to budget-activity-log.json`);
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
