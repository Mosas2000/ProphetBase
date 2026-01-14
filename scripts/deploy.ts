import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Main deployment function for ProphetBase prediction market
 * Deploys to Base mainnet using USDC as collateral token
 */
async function main() {
    try {
        console.log("Starting ProphetBase deployment to Base mainnet...\n");

        // Get the deployer signer
        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with account:", deployer.address);

        // Get deployer balance
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

        // USDC address on Base mainnet
        const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        console.log("Using USDC as collateral token:", USDC_ADDRESS);

        // Deploy PredictionMarket contract
        console.log("\nDeploying PredictionMarket contract...");
        const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        const predictionMarket = await PredictionMarket.deploy(USDC_ADDRESS);

        // Wait for deployment to be mined (5 confirmations for security)
        console.log("Waiting for deployment confirmations...");
        await predictionMarket.waitForDeployment();

        // Get deployed contract address
        const contractAddress = await predictionMarket.getAddress();
        console.log("\n✅ PredictionMarket deployed successfully!");
        console.log("Contract address:", contractAddress);

        // Get deployment transaction details
        const deploymentTx = predictionMarket.deploymentTransaction();
        if (deploymentTx) {
            console.log("Transaction hash:", deploymentTx.hash);

            // Wait for transaction receipt to get gas used
            const receipt = await deploymentTx.wait();
            if (receipt) {
                console.log("Gas used:", receipt.gasUsed.toString());
                console.log("Block number:", receipt.blockNumber);
            }
        }

        // Prepare deployment info
        const deploymentInfo = {
            network: "base",
            contractAddress: contractAddress,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            usdcAddress: USDC_ADDRESS,
            transactionHash: deploymentTx?.hash || "",
            blockNumber: deploymentTx ? (await deploymentTx.wait())?.blockNumber : 0,
        };

        // Save deployment info to deployments.json
        const deploymentsPath = path.join(__dirname, "..", "deployments.json");
        let deployments: any = {};

        // Read existing deployments if file exists
        if (fs.existsSync(deploymentsPath)) {
            const existingData = fs.readFileSync(deploymentsPath, "utf8");
            deployments = JSON.parse(existingData);
        }

        // Add new deployment
        if (!deployments.base) {
            deployments.base = [];
        }
        deployments.base.push(deploymentInfo);

        // Write to file
        fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
        console.log("\n📝 Deployment info saved to deployments.json");

        // Display next steps
        console.log("\n📋 Next Steps:");
        console.log("1. Verify the contract on Basescan:");
        console.log(`   npx hardhat verify --network base ${contractAddress} ${USDC_ADDRESS}`);
        console.log("\n2. Create your first prediction market:");
        console.log("   - Call createMarket() with your question and duration");
        console.log("\n3. Monitor your contract on Basescan:");
        console.log(`   https://basescan.org/address/${contractAddress}`);

    } catch (error) {
        console.error("\n❌ Deployment failed!");
        console.error("Error:", error);
        process.exitCode = 1;
    }
}

// Execute deployment
main()
    .then(() => {
        console.log("\n✨ Deployment script completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment script failed!");
        console.error(error);
        process.exit(1);
    });
