import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { PredictionMarket, OutcomeToken } from "../typechain-types";

describe("PredictionMarket - Enhanced Features", function () {
    // Define fixture for test setup
    async function deployPredictionMarketFixture() {
        const [owner, user1, user2] = await ethers.getSigners();

        // Deploy Mock USDC
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
        await mockUSDC.waitForDeployment();

        const mockUSDCAddress = await mockUSDC.getAddress();

        // Mint USDC to test accounts
        const mintAmount = 1_000_000n * 10n ** 6n;
        await mockUSDC.transfer(user1.address, mintAmount);
        await mockUSDC.transfer(user2.address, mintAmount);

        // Deploy PredictionMarket
        const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        const predictionMarket = await PredictionMarket.deploy(mockUSDCAddress);
        await predictionMarket.waitForDeployment();

        return { predictionMarket, mockUSDC, owner, user1, user2 };
    }

    describe("Sell Shares", function () {
        it("Should allow users to sell YES shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create market
            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            // Buy shares
            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            const market = await predictionMarket.markets(0);
            const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);
            const userShares = await yesToken.balanceOf(user1.address);

            // Sell half
            const sellAmount = userShares / 2n;
            const initialUSDC = await mockUSDC.balanceOf(user1.address);

            await expect(predictionMarket.connect(user1).sellShares(0, true, sellAmount))
                .to.emit(predictionMarket, "SharesSold")
                .withArgs(0, user1.address, true, sellAmount);

            // Verify collateral returned
            expect(await mockUSDC.balanceOf(user1.address)).to.equal(initialUSDC + sellAmount);
            expect(await yesToken.balanceOf(user1.address)).to.equal(userShares - sellAmount);
        });

        it("Should allow users to sell NO shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 1);

            const buyAmount = 200n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, false, buyAmount);

            const market = await predictionMarket.markets(0);
            const noToken = await ethers.getContractAt("OutcomeToken", market.noToken);
            const userShares = await noToken.balanceOf(user1.address);

            await predictionMarket.connect(user1).sellShares(0, false, userShares);

            expect(await noToken.balanceOf(user1.address)).to.equal(0);
        });

        it("Should not allow selling more than owned", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            await expect(
                predictionMarket.connect(user1).sellShares(0, true, buyAmount * 2n)
            ).to.be.revertedWith("PredictionMarket: insufficient token balance");
        });

        it("Should not allow selling after market ends", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            const duration = 60;
            await predictionMarket.connect(owner).createMarket("Test?", duration, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            await time.increase(duration + 1);

            await expect(
                predictionMarket.connect(user1).sellShares(0, true, buyAmount)
            ).to.be.revertedWith("PredictionMarket: betting period has not ended");
        });

        it("Should update market total shares when selling", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            const marketBefore = await predictionMarket.markets(0);
            const totalBefore = marketBefore.totalYesShares;

            const sellAmount = buyAmount / 2n;
            await predictionMarket.connect(user1).sellShares(0, true, sellAmount);

            const marketAfter = await predictionMarket.markets(0);
            expect(marketAfter.totalYesShares).to.equal(totalBefore - sellAmount);
        });
    });

    describe("Categories", function () {
        it("Should create markets with different categories", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("DeFi Question?", 7 * 24 * 60 * 60, 0); // DeFi
            await predictionMarket.connect(owner).createMarket("Crypto Question?", 7 * 24 * 60 * 60, 1); // Crypto
            await predictionMarket.connect(owner).createMarket("Politics Question?", 7 * 24 * 60 * 60, 2); // Politics

            const market0 = await predictionMarket.markets(0);
            const market1 = await predictionMarket.markets(1);
            const market2 = await predictionMarket.markets(2);

            expect(market0.category).to.equal(0); // DeFi
            expect(market1.category).to.equal(1); // Crypto
            expect(market2.category).to.equal(2); // Politics
        });

        it("Should filter markets by category", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("DeFi 1", 7 * 24 * 60 * 60, 0);
            await predictionMarket.connect(owner).createMarket("Crypto 1", 7 * 24 * 60 * 60, 1);
            await predictionMarket.connect(owner).createMarket("DeFi 2", 7 * 24 * 60 * 60, 0);

            const defiMarkets = await predictionMarket.getMarketsByCategory(0);
            const cryptoMarkets = await predictionMarket.getMarketsByCategory(1);

            expect(defiMarkets.length).to.equal(2);
            expect(cryptoMarkets.length).to.equal(1);
            expect(defiMarkets[0]).to.equal(0);
            expect(defiMarkets[1]).to.equal(2);
            expect(cryptoMarkets[0]).to.equal(1);
        });

        it("Should emit category in MarketCreated event", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await expect(predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 3))
                .to.emit(predictionMarket, "MarketCreated");
        });
    });

    describe("Fees", function () {
        it("Should collect 2% fee on purchases", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            const expectedFee = (buyAmount * 2n) / 100n; // 2%
            const expectedShares = buyAmount - expectedFee;

            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            const market = await predictionMarket.markets(0);
            const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);

            // User receives net amount (after fee)
            expect(await yesToken.balanceOf(user1.address)).to.equal(expectedShares);

            // Fees collected
            expect(await predictionMarket.feesCollected(0)).to.equal(expectedFee);
            expect(await predictionMarket.totalFeesCollected()).to.equal(expectedFee);
        });

        it("Should allow owner to withdraw fees", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            const expectedFee = (buyAmount * 2n) / 100n;
            const ownerBalanceBefore = await mockUSDC.balanceOf(owner.address);

            await expect(predictionMarket.connect(owner).withdrawFees())
                .to.emit(predictionMarket, "FeesWithdrawn")
                .withArgs(owner.address, expectedFee);

            expect(await mockUSDC.balanceOf(owner.address)).to.equal(ownerBalanceBefore + expectedFee);
            expect(await predictionMarket.totalFeesCollected()).to.equal(0);
        });

        it("Should not allow non-owner to withdraw fees", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            await expect(
                predictionMarket.connect(user1).withdrawFees()
            ).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
        });

        it("Should not allow withdrawing when no fees collected", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await expect(
                predictionMarket.connect(owner).withdrawFees()
            ).to.be.revertedWith("PredictionMarket: no fees to withdraw");
        });
    });

    describe("Pause Functionality", function () {
        it("Should allow owner to pause contract", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).pause();
            expect(await predictionMarket.paused()).to.equal(true);
        });

        it("Should allow owner to unpause contract", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).pause();
            await predictionMarket.connect(owner).unpause();
            expect(await predictionMarket.paused()).to.equal(false);
        });

        it("Should not allow non-owner to pause", async function () {
            const { predictionMarket, user1 } = await loadFixture(deployPredictionMarketFixture);

            await expect(
                predictionMarket.connect(user1).pause()
            ).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
        });

        it("Should not allow buying when paused", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);
            await predictionMarket.connect(owner).pause();

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            await expect(
                predictionMarket.connect(user1).buyShares(0, true, buyAmount)
            ).to.be.revertedWithCustomError(predictionMarket, "EnforcedPause");
        });

        it("Should not allow selling when paused", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            await predictionMarket.connect(owner).createMarket("Test?", 7 * 24 * 60 * 60, 0);

            const buyAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount);

            await predictionMarket.connect(owner).pause();

            await expect(
                predictionMarket.connect(user1).sellShares(0, true, buyAmount / 2n)
            ).to.be.revertedWithCustomError(predictionMarket, "EnforcedPause");
        });

        it("Should allow resolving markets when paused", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const duration = 60;
            await predictionMarket.connect(owner).createMarket("Test?", duration, 0);
            await time.increase(duration + 1);

            await predictionMarket.connect(owner).pause();

            // Should still be able to resolve
            await expect(predictionMarket.connect(owner).resolveMarket(0, true))
                .to.emit(predictionMarket, "MarketResolved");
        });
    });
});
