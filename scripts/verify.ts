import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Contract verification script for ProphetBase
 * 
 * Why verification is important:
 * - Makes contract source code publicly visible on Basescan
 * - Allows users to read and verify the contract logic
 * - Enables direct interaction with the contract through Basescan UI
 * - Builds trust and transparency in the protocol
 * - Required for many DeFi integrations and audits
 */
async function main() {
    try {
        console.log("Starting contract verification on Basescan...\n");

        // Read deployment info from deployments.json
        const deploymentsPath = path.join(__dirname, "..", "deployments.json");

        if (!fs.existsSync(deploymentsPath)) {
            throw new Error("deployments.json not found. Please deploy the contract first.");
        }

        const deploymentsData = fs.readFileSync(deploymentsPath, "utf8");
        const deployments = JSON.parse(deploymentsData);

        // Get the latest Base deployment
        if (!deployments.base || deployments.base.length === 0) {
            throw new Error("No Base deployments found in deployments.json");
        }

        const latestDeployment = deployments.base[deployments.base.length - 1];
        const contractAddress = latestDeployment.contractAddress;
        const usdcAddress = latestDeployment.usdcAddress;

        console.log("Contract address:", contractAddress);
        console.log("USDC address:", usdcAddress);
        console.log("Network:", latestDeployment.network);
        console.log("Deployed by:", latestDeployment.deployer);
        console.log("Deployment time:", latestDeployment.timestamp);
        console.log("\nVerifying contract...");

        // Verify the contract on Basescan
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: [usdcAddress],
            });

            console.log("\n✅ Contract verified successfully!");
            console.log("\n📋 View verified contract on Basescan:");
            console.log(`https://basescan.org/address/${contractAddress}#code`);

            console.log("\n🎉 Users can now:");
            console.log("- Read the contract source code");
            console.log("- Verify the contract logic");
            console.log("- Interact with the contract through Basescan");
            console.log("- Trust the protocol with transparency");

        } catch (error: any) {
            // Handle case where contract is already verified
            if (error.message.includes("Already Verified")) {
                console.log("\n✅ Contract is already verified!");
                console.log("\n📋 View verified contract on Basescan:");
                console.log(`https://basescan.org/address/${contractAddress}#code`);
            } else {
                throw error;
            }
        }

    } catch (error: any) {
        console.error("\n❌ Verification failed!");
        console.error("Error:", error.message);

        if (error.message.includes("BASESCAN_API_KEY")) {
            console.error("\n💡 Tip: Make sure BASESCAN_API_KEY is set in your .env file");
            console.error("Get your API key from: https://basescan.org/myapikey");
        }

        process.exitCode = 1;
    }
}

// Execute verification
main()
    .then(() => {
        console.log("\n✨ Verification script completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Verification script failed!");
        console.error(error);
        process.exit(1);
    });
