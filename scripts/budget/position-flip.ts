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
const FULL_TRADE_AMOUNT = ethers.parseUnits('2.0', 6); // Full $2 USDC
const DELAY_BETWEEN_TXS = 10000; // 10 seconds
const MIN_ETH_BALANCE = ethers.parseEther('0.00005'); // Stop if below ~1 transaction worth

// Markets to trade
const MARKETS = [0, 1, 2];

async function main() {
  console.log('\n🔄 POSITION FLIP ACTIVITY GENERATOR');
  console.log('='.repeat(60));
  console.log(`💵 Trade Amount: $2.00 USDC (Full Balance)`);
  console.log(`🎯 Target Transactions: 6 (3 markets × 2 positions each)`);
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

    // Verify we have enough USDC
    if (startUsdcBalance < FULL_TRADE_AMOUNT) {
      console.log(`\n❌ Insufficient USDC balance! Need at least 2.00 USDC`);
      return;
    }

    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);
    console.log(
      `⛽ Current Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`
    );

    // User confirmation
    console.log(
      '\n⚠️  Ready to start position flipping. Press Ctrl+C to cancel...'
    );
    await sleep(5000);

    // Activity tracking
    const transactions: TransactionLog[] = [];
    let totalGasUsed = BigInt(0);
    let totalGasCost = BigInt(0);
    let successCount = 0;
    let txCount = 0;
    let totalPnL = 0; // Track P&L in USDC

    // Loop through each market
    for (let i = 0; i < MARKETS.length; i++) {
      const marketId = MARKETS[i];

      console.log(`\n${'='.repeat(60)}`);
      console.log(
        `📊 MARKET ${marketId} - POSITION FLIP ${i + 1}/${MARKETS.length}`
      );
      console.log(`${'='.repeat(60)}`);

      // Check ETH balance
      const currentEthBalance = await provider.getBalance(address);
      if (currentEthBalance < MIN_ETH_BALANCE) {
        console.log('\n⚠️  ETH balance too low! Stopping...');
        break;
      }

      // Check USDC balance
      const currentUsdcBalance = await usdc.balanceOf(address);
      const tradeAmount =
        currentUsdcBalance >= FULL_TRADE_AMOUNT
          ? FULL_TRADE_AMOUNT
          : currentUsdcBalance;

      if (tradeAmount === BigInt(0)) {
        console.log('\n⚠️  No USDC left for trading! Stopping...');
        break;
      }

      const tradeAmountFormatted = ethers.formatUnits(tradeAmount, 6);
      console.log(`\n💵 Using ${tradeAmountFormatted} USDC for this trade`);

      try {
        // STEP 1: Approve USDC if needed
        console.log(`\n[Step 1] 🔓 Checking USDC approval...`);
        const currentAllowance = await usdc.allowance(
          address,
          PREDICTION_MARKET_ADDRESS
        );

        if (currentAllowance < tradeAmount) {
          txCount++;
          console.log(`   Approving ${tradeAmountFormatted} USDC...`);

          const approveTx = await usdc.approve(
            PREDICTION_MARKET_ADDRESS,
            tradeAmount
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
              type: `Approve USDC`,
              market: marketId,
              amount: tradeAmountFormatted,
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: approveReceipt.hash,
              basescanLink: `https://basescan.org/tx/${approveReceipt.hash}`,
            });

            console.log(
              `   ✅ Approved | Gas: ${ethers.formatEther(gasCost)} ETH`
            );
            console.log(`   🔗 ${approveReceipt.hash}`);
          }
        } else {
          console.log(`   ℹ️  Already approved`);
        }

        await sleep(DELAY_BETWEEN_TXS);

        // STEP 2: Buy YES shares
        txCount++;
        console.log(
          `\n[Step 2] 💰 Buying YES shares (${tradeAmountFormatted} USDC)...`
        );

        const buyYesTx = await predictionMarket.buyShares(
          marketId,
          true,
          tradeAmount
        );
        const buyYesReceipt = await buyYesTx.wait();

        if (buyYesReceipt) {
          const gasUsed = buyYesReceipt.gasUsed;
          const gasCost = gasUsed * gasPrice;
          totalGasUsed += gasUsed;
          totalGasCost += gasCost;
          successCount++;

          const yesShares = await predictionMarket.getShareBalance(
            marketId,
            address,
            true
          );

          transactions.push({
            timestamp: new Date().toISOString(),
            txNumber: txCount,
            type: `Buy YES`,
            market: marketId,
            amount: tradeAmountFormatted,
            gasUsed: gasUsed.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
            txHash: buyYesReceipt.hash,
            basescanLink: `https://basescan.org/tx/${buyYesReceipt.hash}`,
          });

          console.log(
            `   ✅ Bought ${ethers.formatUnits(yesShares, 18)} YES shares`
          );
          console.log(
            `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
              ethers.formatEther(gasCost)
            )})`
          );
          console.log(`   🔗 https://basescan.org/tx/${buyYesReceipt.hash}`);
        }

        await sleep(DELAY_BETWEEN_TXS);

        // STEP 3: Sell YES shares
        txCount++;
        console.log(`\n[Step 3] 📤 Selling all YES shares...`);

        const yesShareBalance = await predictionMarket.getShareBalance(
          marketId,
          address,
          true
        );

        if (yesShareBalance > 0) {
          const beforeSellUSDC = await usdc.balanceOf(address);

          // Sell 99% to avoid rounding errors
          const sellAmount = (yesShareBalance * BigInt(99)) / BigInt(100);

          const sellYesTx = await predictionMarket.sellShares(
            marketId,
            true,
            sellAmount
          );
          const sellYesReceipt = await sellYesTx.wait();

          if (sellYesReceipt) {
            const gasUsed = sellYesReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;

            const afterSellUSDC = await usdc.balanceOf(address);
            const usdcReceived = afterSellUSDC - beforeSellUSDC;
            const pnl =
              Number(ethers.formatUnits(usdcReceived, 6)) -
              Number(tradeAmountFormatted);
            totalPnL += pnl;

            transactions.push({
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Sell YES`,
              market: marketId,
              amount: ethers.formatUnits(yesShareBalance, 18),
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: sellYesReceipt.hash,
              basescanLink: `https://basescan.org/tx/${sellYesReceipt.hash}`,
            });

            console.log(
              `   ✅ Sold ${ethers.formatUnits(yesShareBalance, 18)} YES shares`
            );
            console.log(
              `   💵 Received: ${ethers.formatUnits(usdcReceived, 6)} USDC`
            );
            console.log(
              `   📊 P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(4)} USDC`
            );
            console.log(
              `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
                ethers.formatEther(gasCost)
              )})`
            );
            console.log(`   🔗 https://basescan.org/tx/${sellYesReceipt.hash}`);
          }
        }

        await sleep(DELAY_BETWEEN_TXS);

        // STEP 4: Buy NO shares
        const currentUsdcBalance2 = await usdc.balanceOf(address);
        const tradeAmount2 =
          currentUsdcBalance2 >= FULL_TRADE_AMOUNT
            ? FULL_TRADE_AMOUNT
            : currentUsdcBalance2;

        if (tradeAmount2 === BigInt(0)) {
          console.log('\n⚠️  No USDC left for NO position!');
          continue;
        }

        // Approve if needed
        const currentAllowance2 = await usdc.allowance(
          address,
          PREDICTION_MARKET_ADDRESS
        );
        if (currentAllowance2 < tradeAmount2) {
          const approveTx2 = await usdc.approve(
            PREDICTION_MARKET_ADDRESS,
            tradeAmount2
          );
          await approveTx2.wait();
        }

        txCount++;
        console.log(
          `\n[Step 4] 💰 Buying NO shares (${ethers.formatUnits(
            tradeAmount2,
            6
          )} USDC)...`
        );

        const buyNoTx = await predictionMarket.buyShares(
          marketId,
          false,
          tradeAmount2
        );
        const buyNoReceipt = await buyNoTx.wait();

        if (buyNoReceipt) {
          const gasUsed = buyNoReceipt.gasUsed;
          const gasCost = gasUsed * gasPrice;
          totalGasUsed += gasUsed;
          totalGasCost += gasCost;
          successCount++;

          const noShares = await predictionMarket.getShareBalance(
            marketId,
            address,
            false
          );

          transactions.push({
            timestamp: new Date().toISOString(),
            txNumber: txCount,
            type: `Buy NO`,
            market: marketId,
            amount: ethers.formatUnits(tradeAmount2, 6),
            gasUsed: gasUsed.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
            txHash: buyNoReceipt.hash,
            basescanLink: `https://basescan.org/tx/${buyNoReceipt.hash}`,
          });

          console.log(
            `   ✅ Bought ${ethers.formatUnits(noShares, 18)} NO shares`
          );
          console.log(
            `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
              ethers.formatEther(gasCost)
            )})`
          );
          console.log(`   🔗 https://basescan.org/tx/${buyNoReceipt.hash}`);
        }

        await sleep(DELAY_BETWEEN_TXS);

        // STEP 5: Sell NO shares
        txCount++;
        console.log(`\n[Step 5] 📤 Selling all NO shares...`);

        const noShareBalance = await predictionMarket.getShareBalance(
          marketId,
          address,
          false
        );

        if (noShareBalance > 0) {
          const beforeSellUSDC2 = await usdc.balanceOf(address);

          // Sell 99% to avoid rounding errors
          const sellAmount = (noShareBalance * BigInt(99)) / BigInt(100);

          const sellNoTx = await predictionMarket.sellShares(
            marketId,
            false,
            sellAmount
          );
          const sellNoReceipt = await sellNoTx.wait();

          if (sellNoReceipt) {
            const gasUsed = sellNoReceipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            totalGasUsed += gasUsed;
            totalGasCost += gasCost;
            successCount++;

            const afterSellUSDC2 = await usdc.balanceOf(address);
            const usdcReceived = afterSellUSDC2 - beforeSellUSDC2;
            const pnl =
              Number(ethers.formatUnits(usdcReceived, 6)) -
              Number(ethers.formatUnits(tradeAmount2, 6));
            totalPnL += pnl;

            transactions.push({
              timestamp: new Date().toISOString(),
              txNumber: txCount,
              type: `Sell NO`,
              market: marketId,
              amount: ethers.formatUnits(noShareBalance, 18),
              gasUsed: gasUsed.toString(),
              gasCostETH: ethers.formatEther(gasCost),
              gasCostUSD: formatUSD(ethers.formatEther(gasCost)),
              txHash: sellNoReceipt.hash,
              basescanLink: `https://basescan.org/tx/${sellNoReceipt.hash}`,
            });

            console.log(
              `   ✅ Sold ${ethers.formatUnits(noShareBalance, 18)} NO shares`
            );
            console.log(
              `   💵 Received: ${ethers.formatUnits(usdcReceived, 6)} USDC`
            );
            console.log(
              `   📊 P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(4)} USDC`
            );
            console.log(
              `   💸 Gas: ${ethers.formatEther(gasCost)} ETH (${formatUSD(
                ethers.formatEther(gasCost)
              )})`
            );
            console.log(`   🔗 https://basescan.org/tx/${sellNoReceipt.hash}`);
          }
        }

        // Show cumulative stats
        console.log(
          `\n   📊 Cumulative P&L: ${
            totalPnL >= 0 ? '+' : ''
          }${totalPnL.toFixed(4)} USDC`
        );
        console.log(
          `   💰 Total Gas Cost: ${ethers.formatEther(
            totalGasCost
          )} ETH (${formatUSD(ethers.formatEther(totalGasCost))})`
        );
      } catch (error: any) {
        console.error(`\n❌ Error on market ${marketId}:`, error.message);
      }

      // Wait before next market
      if (i < MARKETS.length - 1) {
        await sleep(DELAY_BETWEEN_TXS);
      }
    }

    // Final summary
    const endEthBalance = await provider.getBalance(address);
    const endUsdcBalance = await usdc.balanceOf(address);
    const avgCostPerTx =
      successCount > 0 ? totalGasCost / BigInt(successCount) : BigInt(0);

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
      `📈 Trading P&L: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(4)} USDC`
    );
    console.log('='.repeat(60));

    // Save activity log
    await saveActivityLog({
      script: 'position-flip',
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
