import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        // Base Mainnet
        base: {
            url: "https://mainnet.base.org",
            chainId: 8453,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            gasPrice: "auto",
        },
        // Base Sepolia Testnet
        baseSepolia: {
            url: "https://sepolia.base.org",
            chainId: 84532,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            gasPrice: "auto",
        },
        // Hardhat local network
        hardhat: {
            chainId: 31337,
        },
    },
    // Simplified config for hardhat-verify v2 compatibility
    etherscan: {
        apiKey: process.env.BASESCAN_API_KEY || "",
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;
