import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { PredictionMarket, OutcomeToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PredictionMarket", function () {
    // Define fixture for test setup
    async function deployPredictionMarketFixture() {
        // Get signers
        const [owner, user1, user2] = await ethers.getSigners();

        // Deploy Mock USDC token
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
        await mockUSDC.waitForDeployment();

        const mockUSDCAddress = await mockUSDC.getAddress();

        // Mint USDC to test accounts (1,000,000 USDC with 6 decimals)
        const mintAmount = 1_000_000n * 10n ** 6n;
        await mockUSDC.transfer(user1.address, mintAmount);
        await mockUSDC.transfer(user2.address, mintAmount);

        // Deploy PredictionMarket contract
        const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        const predictionMarket = await PredictionMarket.deploy(mockUSDCAddress);
        await predictionMarket.waitForDeployment();

        return { predictionMarket, mockUSDC, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should deploy correctly", async function () {
            const { predictionMarket, mockUSDC } = await loadFixture(deployPredictionMarketFixture);

            expect(await predictionMarket.getAddress()).to.be.properAddress;
            expect(await mockUSDC.getAddress()).to.be.properAddress;
        });

        it("Should set correct collateral token", async function () {
            const { predictionMarket, mockUSDC } = await loadFixture(deployPredictionMarketFixture);

            const collateralToken = await predictionMarket.collateralToken();
            expect(collateralToken).to.equal(await mockUSDC.getAddress());
        });

        it("Should start with marketCount = 0", async function () {
            const { predictionMarket } = await loadFixture(deployPredictionMarketFixture);

            expect(await predictionMarket.marketCount()).to.equal(0);
        });
    });

    describe("Market Creation", function () {
        it("Should allow owner to create a market", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will ETH hit $5k by end of 2026?";
            const duration = 7 * 24 * 60 * 60; // 7 days in seconds

            await expect(predictionMarket.connect(owner).createMarket(question, duration))
                .to.emit(predictionMarket, "MarketCreated");

            expect(await predictionMarket.marketCount()).to.equal(1);
        });

        it("Should deploy outcome tokens when creating market", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will BTC reach $100k?";
            const duration = 30 * 24 * 60 * 60; // 30 days

            await predictionMarket.connect(owner).createMarket(question, duration);

            const market = await predictionMarket.markets(0);

            // Verify YES and NO token addresses are set
            expect(market.yesToken).to.be.properAddress;
            expect(market.noToken).to.be.properAddress;
            expect(market.yesToken).to.not.equal(ethers.ZeroAddress);
            expect(market.noToken).to.not.equal(ethers.ZeroAddress);
            expect(market.yesToken).to.not.equal(market.noToken);

            // Verify token names
            const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);
            const noToken = await ethers.getContractAt("OutcomeToken", market.noToken);

            expect(await yesToken.name()).to.include("YES");
            expect(await noToken.name()).to.include("NO");
        });

        it("Should not allow non-owner to create market", async function () {
            const { predictionMarket, user1 } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will SOL flip ETH?";
            const duration = 7 * 24 * 60 * 60;

            await expect(
                predictionMarket.connect(user1).createMarket(question, duration)
            ).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
        });

        it("Should not allow creating market with empty question", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const duration = 7 * 24 * 60 * 60;

            await expect(
                predictionMarket.connect(owner).createMarket("", duration)
            ).to.be.revertedWith("PredictionMarket: question cannot be empty");
        });

        it("Should not allow creating market with zero duration", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will ETH hit $5k?";

            await expect(
                predictionMarket.connect(owner).createMarket(question, 0)
            ).to.be.revertedWith("PredictionMarket: duration must be greater than zero");
        });
    });

    describe("Share Purchasing", function () {
        it("Should allow users to buy YES shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will ETH hit $5k?";
            const duration = 7 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration);

            const market = await predictionMarket.markets(0);
            const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);

            // User approves and buys YES shares
            const buyAmount = 100n * 10n ** 6n; // 100 USDC
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            await expect(predictionMarket.connect(user1).buyShares(0, true, buyAmount))
                .to.emit(predictionMarket, "SharesPurchased")
                .withArgs(0, user1.address, true, buyAmount);

            // Verify user received YES tokens
            expect(await yesToken.balanceOf(user1.address)).to.equal(buyAmount);
        });

        it("Should allow users to buy NO shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will BTC reach $100k?";
            const duration = 30 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration);

            const market = await predictionMarket.markets(0);
            const noToken = await ethers.getContractAt("OutcomeToken", market.noToken);

            // User approves and buys NO shares
            const buyAmount = 200n * 10n ** 6n; // 200 USDC
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            await expect(predictionMarket.connect(user1).buyShares(0, false, buyAmount))
                .to.emit(predictionMarket, "SharesPurchased")
                .withArgs(0, user1.address, false, buyAmount);

            // Verify user received NO tokens
            expect(await noToken.balanceOf(user1.address)).to.equal(buyAmount);
        });

        it("Should transfer collateral when buying shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will ETH hit $10k?";
            const duration = 7 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration);

            const buyAmount = 500n * 10n ** 6n; // 500 USDC
            const initialUserBalance = await mockUSDC.balanceOf(user1.address);
            const initialContractBalance = await mockUSDC.balanceOf(await predictionMarket.getAddress());

            // User approves and buys shares
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            // Verify collateral was transferred
            expect(await mockUSDC.balanceOf(user1.address)).to.equal(initialUserBalance - buyAmount);
            expect(await mockUSDC.balanceOf(await predictionMarket.getAddress())).to.equal(initialContractBalance + buyAmount);
        });

        it("Should update total shares when buying", async function () {
            const { predictionMarket, mockUSDC, owner, user1, user2 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will SOL hit $500?";
            const duration = 14 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration);

            const buyAmount1 = 100n * 10n ** 6n;
            const buyAmount2 = 200n * 10n ** 6n;

            // User1 buys YES shares
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount1);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount1);

            // User2 buys NO shares
            await mockUSDC.connect(user2).approve(await predictionMarket.getAddress(), buyAmount2);
            await predictionMarket.connect(user2).buyShares(0, false, buyAmount2);

            const market = await predictionMarket.markets(0);
            expect(market.totalYesShares).to.equal(buyAmount1);
            expect(market.totalNoShares).to.equal(buyAmount2);
        });

        it("Should not allow buying after market ends", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market with short duration
            const question = "Will ETH hit $5k?";
            const duration = 60; // 1 minute
            await predictionMarket.connect(owner).createMarket(question, duration);

            // Fast-forward time past market end
            await time.increase(duration + 1);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            // Attempt to buy shares should fail
            await expect(
                predictionMarket.connect(user1).buyShares(0, true, buyAmount)
            ).to.be.revertedWith("PredictionMarket: betting period has ended");
        });

        it("Should not allow buying with zero amount", async function () {
            const { predictionMarket, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will BTC hit $100k?";
            const duration = 7 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration);

            await expect(
                predictionMarket.connect(user1).buyShares(0, true, 0)
            ).to.be.revertedWith("PredictionMarket: amount must be greater than zero");
        });

        it("Should not allow buying from non-existent market", async function () {
            const { predictionMarket, user1 } = await loadFixture(deployPredictionMarketFixture);

            const buyAmount = 100n * 10n ** 6n;

            await expect(
                predictionMarket.connect(user1).buyShares(999, true, buyAmount)
            ).to.be.revertedWith("PredictionMarket: market does not exist");
        });
    });
});
