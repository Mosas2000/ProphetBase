import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Interface for market configuration
 */
interface MarketConfig {
    question: string;
    duration: number; // Duration in seconds
}

/**
 * Interface for market creation result
 */
interface MarketResult {
    success: boolean;
    marketId?: string;
    question: string;
    transactionHash?: string;
    error?: string;
    marketInfo?: any;
}

/**
 * Script to create multiple prediction markets on ProphetBase
 * This allows batch creation of markets on Base mainnet
 */
async function main() {
    try {
        console.log("🚀 Creating multiple prediction markets on ProphetBase (Base mainnet)...\n");

        // Get the signer (your wallet)
        const [signer] = await ethers.getSigners();
        console.log("Using account:", signer.address);

        // Get account balance
        const balance = await ethers.provider.getBalance(signer.address);
        console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

        // Connect to the deployed PredictionMarket contract
        const PREDICTION_MARKET_ADDRESS = "0x798e104BfAefC785bCDB63B58E0b620707773DAA";
        console.log("Connecting to PredictionMarket at:", PREDICTION_MARKET_ADDRESS);

        // Get the contract factory and attach to deployed address
        const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        const predictionMarket = PredictionMarket.attach(PREDICTION_MARKET_ADDRESS);

        // Define array of markets to create
        const marketsToCreate: MarketConfig[] = [
            {
                question: "Will Bitcoin reach $150k by March 1st, 2026?",
                duration: 30 * 24 * 60 * 60 // 30 days
            },
            {
                question: "Will Base TVL exceed $10B by February 15th, 2026?",
                duration: 20 * 24 * 60 * 60 // 20 days
            },
            {
                question: "Will Coinbase launch a token in Q1 2026?",
                duration: 60 * 24 * 60 * 60 // 60 days
            }
        ];

        console.log(`\n📊 Planning to create ${marketsToCreate.length} markets:\n`);
        marketsToCreate.forEach((market, index) => {
            const endDate = new Date(Date.now() + market.duration * 1000);
            console.log(`${index + 1}. ${market.question}`);
            console.log(`   Duration: ${market.duration / (24 * 60 * 60)} days`);
            console.log(`   End Date: ${endDate.toISOString()}\n`);
        });

        // Array to store results
        const results: MarketResult[] = [];

        // Create each market
        for (let i = 0; i < marketsToCreate.length; i++) {
            const marketConfig = marketsToCreate[i];
            console.log(`\n${"=".repeat(80)}`);
            console.log(`Creating Market ${i + 1}/${marketsToCreate.length}`);
            console.log(`${"=".repeat(80)}\n`);

            try {
                console.log("📋 Question:", marketConfig.question);
                console.log("⏱️  Duration:", marketConfig.duration, "seconds");

                // Create the market
                console.log("\n🚀 Submitting transaction...");
                const tx = await predictionMarket.createMarket(
                    marketConfig.question,
                    marketConfig.duration
                );
                console.log("Transaction hash:", tx.hash);

                // Wait for confirmation
                console.log("Waiting for confirmation...");
                const receipt = await tx.wait();
                console.log("✅ Transaction confirmed!");
                console.log("Block number:", receipt?.blockNumber);
                console.log("Gas used:", receipt?.gasUsed.toString());

                // Get the market ID
                const marketCount = await predictionMarket.marketCount();
                const marketId = marketCount - BigInt(1);
                console.log("\n🎯 Market ID:", marketId.toString());

                // Get market details
                const market = await predictionMarket.markets(marketId);
                const endTime = new Date(Number(market.endTime) * 1000);

                console.log("\n📋 Market Details:");
                console.log("Question:", market.question);
                console.log("End Time:", endTime.toISOString());
                console.log("Status:", market.status === 0 ? "Open" : market.status === 1 ? "Resolved" : "Cancelled");
                console.log("YES Token:", market.yesToken);
                console.log("NO Token:", market.noToken);

                // Prepare market info
                const marketInfo = {
                    marketId: marketId.toString(),
                    question: market.question,
                    endTime: endTime.toISOString(),
                    endTimeUnix: Number(market.endTime),
                    status: "Open",
                    yesTokenAddress: market.yesToken,
                    noTokenAddress: market.noToken,
                    contractAddress: PREDICTION_MARKET_ADDRESS,
                    transactionHash: tx.hash,
                    blockNumber: receipt?.blockNumber,
                    createdAt: new Date().toISOString(),
                    network: "base"
                };

                // Store successful result
                results.push({
                    success: true,
                    marketId: marketId.toString(),
                    question: marketConfig.question,
                    transactionHash: tx.hash,
                    marketInfo
                });

                console.log("\n✅ Market created successfully!");

                // Add a small delay between market creations to avoid nonce issues
                if (i < marketsToCreate.length - 1) {
                    console.log("\n⏳ Waiting 3 seconds before next market...");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

            } catch (error) {
                console.error("\n❌ Failed to create market!");

                let errorMessage = "Unknown error";
                if (error instanceof Error) {
                    errorMessage = error.message;
                    console.error("Error message:", error.message);

                    // Check for common errors
                    if (error.message.includes("only owner")) {
                        console.error("\n⚠️  Only the contract owner can create markets.");
                    } else if (error.message.includes("insufficient funds")) {
                        console.error("\n⚠️  Insufficient ETH for gas fees.");
                    } else if (error.message.includes("nonce")) {
                        console.error("\n⚠️  Nonce error. Waiting before retry...");
                    }
                } else {
                    console.error("Error:", error);
                }

                // Store failed result
                results.push({
                    success: false,
                    question: marketConfig.question,
                    error: errorMessage
                });

                console.log("\n⚠️  Continuing with next market...");
            }
        }

        // Save all successful markets to markets.json
        console.log(`\n${"=".repeat(80)}`);
        console.log("Saving Markets to markets.json");
        console.log(`${"=".repeat(80)}\n`);

        const marketsPath = path.join(__dirname, "..", "markets.json");
        let marketsData: any = { markets: [] };

        // Read existing markets if file exists
        if (fs.existsSync(marketsPath)) {
            const existingData = fs.readFileSync(marketsPath, "utf8");
            marketsData = JSON.parse(existingData);
        }

        // Ensure markets array exists
        if (!marketsData.markets) {
            marketsData.markets = [];
        }

        // Add all successful markets
        const successfulMarkets = results.filter(r => r.success);
        successfulMarkets.forEach(result => {
            if (result.marketInfo) {
                marketsData.markets.push(result.marketInfo);
            }
        });

        // Write to file
        fs.writeFileSync(marketsPath, JSON.stringify(marketsData, null, 2));
        console.log("💾 Markets saved to markets.json");

        // Display summary
        console.log(`\n${"=".repeat(80)}`);
        console.log("Summary");
        console.log(`${"=".repeat(80)}\n`);

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        console.log(`✅ Successfully created: ${successCount} market(s)`);
        console.log(`❌ Failed: ${failCount} market(s)\n`);

        // Display successful markets
        if (successCount > 0) {
            console.log("📊 Successfully Created Markets:\n");
            results.forEach((result, index) => {
                if (result.success) {
                    console.log(`${index + 1}. Market ID: ${result.marketId}`);
                    console.log(`   Question: ${result.question}`);
                    console.log(`   TX Hash: ${result.transactionHash}`);
                    console.log(`   View on Basescan: https://basescan.org/tx/${result.transactionHash}\n`);
                }
            });
        }

        // Display failed markets
        if (failCount > 0) {
            console.log("❌ Failed Markets:\n");
            results.forEach((result, index) => {
                if (!result.success) {
                    console.log(`${index + 1}. Question: ${result.question}`);
                    console.log(`   Error: ${result.error}\n`);
                }
            });
        }

        // Display next steps
        console.log("\n📋 Next Steps:");
        console.log("1. View your markets on Basescan:");
        console.log(`   https://basescan.org/address/${PREDICTION_MARKET_ADDRESS}`);
        console.log("\n2. Users can buy shares using the market IDs above");
        console.log("\n3. After markets end, resolve them and allow winners to claim rewards");

        // Exit with error code if any markets failed
        if (failCount > 0) {
            process.exitCode = 1;
        }

    } catch (error) {
        console.error("\n❌ Script execution failed!");

        if (error instanceof Error) {
            console.error("Error message:", error.message);
        } else {
            console.error("Error:", error);
        }

        process.exitCode = 1;
    }
}

// Execute the script
main()
    .then(() => {
        console.log("\n✨ Batch market creation script completed!\n");
        process.exit(process.exitCode || 0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed with unhandled error!");
        console.error(error);
        process.exit(1);
    });
