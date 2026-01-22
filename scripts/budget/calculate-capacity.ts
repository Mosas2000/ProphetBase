import { ethers } from "hardhat";
import {
    estimateTxCost,
    formatUSD
} from "./helpers";

// Contract addresses
const PREDICTION_MARKET_ADDRESS = "0x27177c0edc143CA33119fafD907e8600deF5Ba74";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Gas estimates
const BUY_SHARES_GAS = 200000;
const SELL_SHARES_GAS = 180000;
const APPROVE_GAS = 50000;

async function main() {
  console.log("\n🔍 BUDGET CAPACITY CALCULATOR");
  console.log("=" .repeat(60));
  
  try {
    // Get signer
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`\n📍 Wallet Address: ${address}`);
    
    // Get provider
    const provider = deployer.provider!;
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);
    const gasPriceGwei = ethers.formatUnits(gasPrice, "gwei");
    
    console.log(`\n⛽ Current Gas Price: ${parseFloat(gasPriceGwei).toFixed(2)} Gwei`);
    
    // Get ETH balance
    const ethBalance = await provider.getBalance(address);
    const ethBalanceFormatted = ethers.formatEther(ethBalance);
    const ethBalanceUSD = formatUSD(ethBalanceFormatted);
    
    console.log(`\n💰 Your ETH Balance: ${parseFloat(ethBalanceFormatted).toFixed(4)} ETH (${ethBalanceUSD})`);
    
    // Get USDC balance
    const usdcContract = await ethers.getContractAt(
      ["function balanceOf(address) view returns (uint256)"],
      USDC_ADDRESS
    );
    const usdcBalance = await usdcContract.balanceOf(address);
    const usdcBalanceFormatted = ethers.formatUnits(usdcBalance, 6);
    
    console.log(`💵 Your USDC Balance: ${parseFloat(usdcBalanceFormatted).toFixed(2)} USDC`);
    
    // Calculate costs per transaction
    console.log("\n📊 TRANSACTION COST BREAKDOWN:");
    console.log("-".repeat(60));
    
    // Approve cost
    const approveCost = await estimateTxCost(APPROVE_GAS, provider);
    console.log(`   Approve USDC: ~${APPROVE_GAS.toLocaleString()} gas = ${parseFloat(approveCost.eth).toFixed(6)} ETH ($${approveCost.usd})`);
    
    // Buy shares cost
    const buyCost = await estimateTxCost(BUY_SHARES_GAS, provider);
    console.log(`   Buy Shares:   ~${BUY_SHARES_GAS.toLocaleString()} gas = ${parseFloat(buyCost.eth).toFixed(6)} ETH ($${buyCost.usd})`);
    
    // Sell shares cost
    const sellCost = await estimateTxCost(SELL_SHARES_GAS, provider);
    console.log(`   Sell Shares:  ~${SELL_SHARES_GAS.toLocaleString()} gas = ${parseFloat(sellCost.eth).toFixed(6)} ETH ($${sellCost.usd})`);
    
    // Average cost per complete trade cycle (approve + buy + sell)
    const avgCostPerCycle = parseFloat(approveCost.eth) + parseFloat(buyCost.eth) + parseFloat(sellCost.eth);
    const avgCostPerCycleUSD = parseFloat(approveCost.usd) + parseFloat(buyCost.usd) + parseFloat(sellCost.usd);
    
    console.log(`\n   Average per cycle (approve + buy + sell):`);
    console.log(`   ${avgCostPerCycle.toFixed(6)} ETH ($${avgCostPerCycleUSD.toFixed(4)})`);
    
    // Calculate how many transactions you can afford
    const availableETH = parseFloat(ethBalanceFormatted);
    const reserveETH = 0.05; // Keep 0.05 ETH as reserve
    const usableETH = Math.max(0, availableETH - reserveETH);
    
    const affordableCycles = Math.floor(usableETH / avgCostPerCycle);
    const affordableTransactions = affordableCycles * 2; // Each cycle = 1 buy + 1 sell
    
    console.log(`\n💡 CAPACITY ANALYSIS:`);
    console.log("-".repeat(60));
    console.log(`   Available ETH for gas: ${usableETH.toFixed(4)} ETH (${formatUSD(usableETH.toString())})`);
    console.log(`   Reserve kept: ${reserveETH.toFixed(2)} ETH (${formatUSD(reserveETH.toString())})`);
    console.log(`   You can afford approximately ${affordableTransactions} transactions`);
    
    // Strategy recommendations
    console.log(`\n🎯 RECOMMENDED STRATEGIES:`);
    console.log("-".repeat(60));
    
    // Conservative: 40 transactions (20 cycles)
    const conservativeCycles = 20;
    const conservativeTxs = conservativeCycles * 2;
    const conservativeCost = conservativeCycles * avgCostPerCycle;
    const conservativeCostUSD = conservativeCycles * avgCostPerCycleUSD;
    console.log(`\n   1️⃣  Conservative (${conservativeTxs} transactions):`);
    console.log(`       - ${conservativeCycles} complete trade cycles`);
    console.log(`       - Estimated gas cost: ${conservativeCost.toFixed(4)} ETH ($${conservativeCostUSD.toFixed(2)})`);
    console.log(`       - Remaining ETH: ${(availableETH - conservativeCost).toFixed(4)} ETH`);
    console.log(`       - Safety margin: HIGH ✅`);
    console.log(`       - Script: npm run budget:micro`);
    
    // Balanced: 60 transactions (30 cycles)
    const balancedCycles = 30;
    const balancedTxs = balancedCycles * 2;
    const balancedCost = balancedCycles * avgCostPerCycle;
    const balancedCostUSD = balancedCycles * avgCostPerCycleUSD;
    console.log(`\n   2️⃣  Balanced (${balancedTxs} transactions):`);
    console.log(`       - ${balancedCycles} complete trade cycles`);
    console.log(`       - Estimated gas cost: ${balancedCost.toFixed(4)} ETH ($${balancedCostUSD.toFixed(2)})`);
    console.log(`       - Remaining ETH: ${(availableETH - balancedCost).toFixed(4)} ETH`);
    console.log(`       - Safety margin: MEDIUM ⚠️`);
    console.log(`       - Script: npm run budget:mixed`);
    
    // Aggressive: 100 transactions (50 cycles)
    const aggressiveCycles = 50;
    const aggressiveTxs = aggressiveCycles * 2;
    const aggressiveCost = aggressiveCycles * avgCostPerCycle;
    const aggressiveCostUSD = aggressiveCycles * avgCostPerCycleUSD;
    console.log(`\n   3️⃣  Aggressive (${aggressiveTxs} transactions):`);
    console.log(`       - ${aggressiveCycles} complete trade cycles`);
    console.log(`       - Estimated gas cost: ${aggressiveCost.toFixed(4)} ETH ($${aggressiveCostUSD.toFixed(2)})`);
    console.log(`       - Remaining ETH: ${(availableETH - aggressiveCost).toFixed(4)} ETH`);
    console.log(`       - Safety margin: LOW ⚠️⚠️`);
    console.log(`       - Script: npm run budget:rapid`);
    
    // Warnings
    console.log(`\n⚠️  IMPORTANT NOTES:`);
    console.log("-".repeat(60));
    console.log(`   • Gas prices fluctuate - actual costs may vary`);
    console.log(`   • Keep reserve ETH for safety`);
    console.log(`   • Monitor gas prices during execution`);
    console.log(`   • All scripts have auto-stop if ETH < $0.10`);
    console.log(`   • USDC balance: ${parseFloat(usdcBalanceFormatted).toFixed(2)} USDC available`);
    
    // Budget check
    if (availableETH < 0.6) {
      console.log(`\n❌ WARNING: ETH balance below recommended $0.60 ETH`);
      console.log(`   Current: ${ethBalanceUSD}`);
      console.log(`   Consider adding more ETH before running scripts`);
    }
    
    if (parseFloat(usdcBalanceFormatted) < 2) {
      console.log(`\n❌ WARNING: USDC balance below recommended $2 USDC`);
      console.log(`   Current: ${parseFloat(usdcBalanceFormatted).toFixed(2)} USDC`);
      console.log(`   Consider adding more USDC before running scripts`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Capacity calculation complete!\n");
    
  } catch (error) {
    console.error("\n❌ Error calculating capacity:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
