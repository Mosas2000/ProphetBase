import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script to create a prediction market on the deployed ProphetBase contract
 * This creates a real prediction market on Base mainnet
 */
async function main() {
    try {
        console.log("Starting market creation on ProphetBase...\n");

        // Get the signer (your wallet)
        const [signer] = await ethers.getSigners();
        console.log("Creating market with account:", signer.address);

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

        console.log("Transaction submitted:", tx.hash);
        console.log("Waiting for confirmation...");

        // Wait for transaction confirmation
        const receipt = await tx.wait();

        if (!receipt) {
            throw new Error("Transaction receipt not found");
        }

        console.log("✅ Transaction confirmed!");
        console.log("Block number:", receipt.blockNumber);
        console.log("Gas used:", receipt.gasUsed.toString());

        // Get the updated market count from the contract
        const marketCount = await predictionMarket.marketCount();
        const marketId = marketCount - BigInt(1); // Market ID is count - 1 (0-indexed)

        console.log("\n📈 Market Created Successfully!");
        console.log("Market ID:", marketId.toString());

        // Get market details from the contract
        const market = await predictionMarket.markets(marketId);

        console.log("\n📋 Market Details:");
        console.log("Question:", market.question);
        console.log("End Time:", new Date(Number(market.endTime) * 1000).toISOString());
        console.log("YES Token Address:", market.yesToken);
        console.log("NO Token Address:", market.noToken);
        console.log("Status:", market.status === 0 ? "Open" : market.status === 1 ? "Resolved" : "Cancelled");

        // Prepare market info to save
        const marketInfo = {
            marketId: marketId.toString(),
            question: market.question,
            endTime: Number(market.endTime),
            endTimeISO: new Date(Number(market.endTime) * 1000).toISOString(),
            yesTokenAddress: market.yesToken,
            noTokenAddress: market.noToken,
            status: market.status === 0 ? "Open" : market.status === 1 ? "Resolved" : "Cancelled",
            createdAt: new Date().toISOString(),
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            creator: signer.address,
        };

        // Save market info to markets.json
        const marketsPath = path.join(__dirname, "..", "markets.json");
        let markets: any = { markets: [] };

        // Read existing markets if file exists
        if (fs.existsSync(marketsPath)) {
            const existingData = fs.readFileSync(marketsPath, "utf8");
            markets = JSON.parse(existingData);
        }

        // Ensure markets array exists
        if (!markets.markets) {
            markets.markets = [];
        }

        // Add new market
        markets.markets.push(marketInfo);

        // Write to file
        fs.writeFileSync(marketsPath, JSON.stringify(markets, null, 2));
        console.log("\n📝 Market info saved to markets.json");

        // Display next steps
        console.log("\n📋 Next Steps:");
        console.log("1. View your market on Basescan:");
        console.log(`   https://basescan.org/tx/${tx.hash}`);
        console.log("\n2. Users can now buy shares by calling:");
        console.log(`   buyShares(${marketId}, true/false, amount)`);
        console.log("   - true = buy YES shares");
        console.log("   - false = buy NO shares");
        console.log("\n3. After the market ends (15 days), resolve it:");
        console.log(`   resolveMarket(${marketId}, true/false)`);
        console.log("\n4. View YES token on Basescan:");
        console.log(`   https://basescan.org/token/${market.yesToken}`);
        console.log("\n5. View NO token on Basescan:");
        console.log(`   https://basescan.org/token/${market.noToken}`);

    } catch (error) {
        console.error("\n❌ Market creation failed!");

        // Provide more detailed error information
        if (error instanceof Error) {
            console.error("Error message:", error.message);

            // Check for common errors
            if (error.message.includes("Ownable: caller is not the owner")) {
                console.error("\n⚠️  Only the contract owner can create markets.");
                console.error("Make sure you're using the same account that deployed the contract.");
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
