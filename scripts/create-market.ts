import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script to create a prediction market on the deployed ProphetBase contract
 * This creates a real prediction market on Base mainnet
 */
async function main() {
    try {
        console.log("Creating prediction market on ProphetBase (Base mainnet)...\n");

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

        // Define market parameters
        const question = "Will ETH reach $5000 by February 1st, 2026?";
        const duration = 15 * 24 * 60 * 60; // 15 days in seconds

        console.log("\n📊 Market Parameters:");
        console.log("Question:", question);
        console.log("Duration:", duration, "seconds (15 days)");
        console.log("End Date:", new Date(Date.now() + duration * 1000).toISOString());

        // Create the market
        console.log("\n🚀 Creating market...");
        const tx = await predictionMarket.createMarket(question, duration);
        console.log("Transaction hash:", tx.hash);

        // Wait for transaction confirmation
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("✅ Transaction confirmed!");
        console.log("Block number:", receipt?.blockNumber);
        console.log("Gas used:", receipt?.gasUsed.toString());

        // Get the market count to determine the market ID
        const marketCount = await predictionMarket.marketCount();
        const marketId = marketCount - BigInt(1); // Latest market ID is count - 1
        console.log("\n🎯 Market Created!");
        console.log("Market ID:", marketId.toString());

        // Get market details
        const market = await predictionMarket.markets(marketId);
        const endTime = new Date(Number(market.endTime) * 1000);

        console.log("\n📋 Market Details:");
        console.log("Question:", market.question);
        console.log("End Time:", endTime.toISOString());
        console.log("Status:", market.status === 0 ? "Open" : market.status === 1 ? "Resolved" : "Cancelled");
        console.log("YES Token Address:", market.yesToken);
        console.log("NO Token Address:", market.noToken);

        // Prepare market info for saving
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

        // Save market info to markets.json
        const marketsPath = path.join(__dirname, "..", "markets.json");
        let markets: any = { markets: [] };

        // Read existing markets if file exists
        if (fs.existsSync(marketsPath)) {
            const existingData = fs.readFileSync(marketsPath, "utf8");
            markets = JSON.parse(existingData);
        }

        // Add new market
        if (!markets.markets) {
            markets.markets = [];
        }
        markets.markets.push(marketInfo);

        // Write to file
        fs.writeFileSync(marketsPath, JSON.stringify(markets, null, 2));
        console.log("\n💾 Market info saved to markets.json");

        // Display next steps
        console.log("\n📋 Next Steps:");
        console.log("1. View your market on Basescan:");
        console.log(`   https://basescan.org/address/${PREDICTION_MARKET_ADDRESS}`);
        console.log("\n2. Users can now buy shares:");
        console.log(`   - Call buyShares(${marketId}, true, amount) for YES shares`);
        console.log(`   - Call buyShares(${marketId}, false, amount) for NO shares`);
        console.log("\n3. After market ends, resolve it:");
        console.log(`   - Call resolveMarket(${marketId}, outcome) where outcome is true/false`);
        console.log("\n4. Winners can claim rewards:");
        console.log(`   - Call claimWinnings(${marketId})`);

    } catch (error) {
        console.error("\n❌ Market creation failed!");

        // Provide helpful error messages
        if (error instanceof Error) {
            console.error("Error message:", error.message);

            // Check for common errors
            if (error.message.includes("only owner")) {
                console.error("\n⚠️  Only the contract owner can create markets.");
                console.error("Make sure you're using the same wallet that deployed the contract.");
            } else if (error.message.includes("insufficient funds")) {
                console.error("\n⚠️  Insufficient ETH for gas fees.");
                console.error("Please add more ETH to your wallet.");
            }
        } else {
            console.error("Error:", error);
        }

        process.exitCode = 1;
    }
}

// Execute the script
main()
    .then(() => {
        console.log("\n✨ Market creation script completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Market creation script failed!");
        console.error(error);
        process.exit(1);
    });
