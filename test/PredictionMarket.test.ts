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

            await expect(predictionMarket.connect(owner).createMarket(question, duration, 0))
                .to.emit(predictionMarket, "MarketCreated");

            expect(await predictionMarket.marketCount()).to.equal(1);
        });

        it("Should deploy outcome tokens when creating market", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will BTC reach $100k?";
            const duration = 30 * 24 * 60 * 60; // 30 days

            await predictionMarket.connect(owner).createMarket(question, duration, 0);

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
                predictionMarket.connect(user1).createMarket(question, duration, 0)
            ).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
        });

        it("Should not allow creating market with empty question", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const duration = 7 * 24 * 60 * 60;

            await expect(
                predictionMarket.connect(owner).createMarket("", duration, 0)
            ).to.be.revertedWith("PredictionMarket: question cannot be empty");
        });

        it("Should not allow creating market with zero duration", async function () {
            const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

            const question = "Will ETH hit $5k?";

            await expect(
                predictionMarket.connect(owner).createMarket(question, 0, 0)
            ).to.be.revertedWith("PredictionMarket: duration must be greater than zero");
        });
    });

    describe("Share Purchasing", function () {
        it("Should allow users to buy YES shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will ETH hit $5k?";
            const duration = 7 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

            const market = await predictionMarket.markets(0);
            const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);

            // User approves and buys YES shares
            const buyAmount = 100n * 10n ** 6n; // 100 USDC
            const fee = (buyAmount * 2n) / 100n; // 2% fee
            const netAmount = buyAmount - fee;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            await expect(predictionMarket.connect(user1).buyShares(0, true, buyAmount))
                .to.emit(predictionMarket, "SharesPurchased")
                .withArgs(0, user1.address, true, netAmount, fee);

            // Verify user received YES tokens (net amount after fee)
            expect(await yesToken.balanceOf(user1.address)).to.equal(netAmount);
        });

        it("Should allow users to buy NO shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will BTC reach $100k?";
            const duration = 30 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

            const market = await predictionMarket.markets(0);
            const noToken = await ethers.getContractAt("OutcomeToken", market.noToken);

            // User approves and buys NO shares
            const buyAmount = 200n * 10n ** 6n; // 200 USDC
            const fee = (buyAmount * 2n) / 100n; // 2% fee
            const netAmount = buyAmount - fee;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount);

            await expect(predictionMarket.connect(user1).buyShares(0, false, buyAmount))
                .to.emit(predictionMarket, "SharesPurchased")
                .withArgs(0, user1.address, false, netAmount, fee);

            // Verify user received NO tokens (net amount after fee)
            expect(await noToken.balanceOf(user1.address)).to.equal(netAmount);
        });

        it("Should transfer collateral when buying shares", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will ETH hit $10k?";
            const duration = 7 * 24 * 60 * 60;
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

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
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

            const buyAmount1 = 100n * 10n ** 6n;
            const buyAmount2 = 200n * 10n ** 6n;

            // User1 buys YES shares
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), buyAmount1);
            await predictionMarket.connect(user1).buyShares(0, true, buyAmount1);

            // User2 buys NO shares
            await mockUSDC.connect(user2).approve(await predictionMarket.getAddress(), buyAmount2);
            await predictionMarket.connect(user2).buyShares(0, false, buyAmount2);

            const market = await predictionMarket.markets(0);
            const fee1 = (buyAmount1 * 2n) / 100n;
            const fee2 = (buyAmount2 * 2n) / 100n;
            expect(market.totalYesShares).to.equal(buyAmount1 - fee1);
            expect(market.totalNoShares).to.equal(buyAmount2 - fee2);
        });

        it("Should not allow buying after market ends", async function () {
            const { predictionMarket, mockUSDC, owner, user1 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market with short duration
            const question = "Will ETH hit $5k?";
            const duration = 60; // 1 minute
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

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
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

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

    describe("Market Resolution and Claims", function () {
        // Helper function to create a market with shares purchased
        async function createMarketWithShares() {
            const { predictionMarket, mockUSDC, owner, user1, user2 } = await loadFixture(deployPredictionMarketFixture);

            // Create a market
            const question = "Will ETH hit $5k?";
            const duration = 7 * 24 * 60 * 60; // 7 days
            await predictionMarket.connect(owner).createMarket(question, duration, 0);

            // User1 buys YES shares
            const yesAmount = 100n * 10n ** 6n;
            await mockUSDC.connect(user1).approve(await predictionMarket.getAddress(), yesAmount);
            await predictionMarket.connect(user1).buyShares(0, true, yesAmount);

            // User2 buys NO shares
            const noAmount = 200n * 10n ** 6n;
            await mockUSDC.connect(user2).approve(await predictionMarket.getAddress(), noAmount);
            await predictionMarket.connect(user2).buyShares(0, false, noAmount);

            return { predictionMarket, mockUSDC, owner, user1, user2, duration };
        }

        describe("Market Resolution", function () {
            it("Should allow owner to resolve market after endTime", async function () {
                const { predictionMarket, owner, duration } = await createMarketWithShares();

                // Fast-forward time past market end
                await time.increase(duration + 1);

                // Resolve market
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const market = await predictionMarket.markets(0);
                expect(market.status).to.equal(1); // MarketStatus.Resolved
                expect(market.outcome).to.equal(true);
                expect(market.resolutionTime).to.be.greaterThan(0);
            });

            it("Should not allow non-owner to resolve market", async function () {
                const { predictionMarket, user1, duration } = await createMarketWithShares();

                // Fast-forward time past market end
                await time.increase(duration + 1);

                await expect(
                    predictionMarket.connect(user1).resolveMarket(0, true)
                ).to.be.revertedWithCustomError(predictionMarket, "OwnableUnauthorizedAccount");
            });

            it("Should not allow resolving before endTime", async function () {
                const { predictionMarket, owner } = await createMarketWithShares();

                // Try to resolve immediately without waiting
                await expect(
                    predictionMarket.connect(owner).resolveMarket(0, true)
                ).to.be.revertedWith("PredictionMarket: betting period has not ended");
            });

            it("Should not allow resolving already resolved market", async function () {
                const { predictionMarket, owner, duration } = await createMarketWithShares();

                // Fast-forward time and resolve
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                // Try to resolve again
                await expect(
                    predictionMarket.connect(owner).resolveMarket(0, false)
                ).to.be.revertedWith("PredictionMarket: market is not open");
            });

            it("Should emit MarketResolved event", async function () {
                const { predictionMarket, owner, duration } = await createMarketWithShares();

                // Fast-forward time past market end
                await time.increase(duration + 1);

                const currentTime = await time.latest();

                await expect(predictionMarket.connect(owner).resolveMarket(0, true))
                    .to.emit(predictionMarket, "MarketResolved")
                    .withArgs(0, true, currentTime + 1);
            });
        });

        describe("Claiming Winnings", function () {
            it("Should allow winner to claim winnings (YES wins)", async function () {
                const { predictionMarket, mockUSDC, owner, user1, duration } = await createMarketWithShares();

                // Fast-forward and resolve with YES winning
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const market = await predictionMarket.markets(0);
                const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);
                const initialBalance = await yesToken.balanceOf(user1.address);

                // User1 claims winnings
                const initialUSDC = await mockUSDC.balanceOf(user1.address);
                await expect(predictionMarket.connect(user1).claimWinnings(0))
                    .to.emit(predictionMarket, "WinningsClaimed")
                    .withArgs(0, user1.address, initialBalance);

                // Verify payout
                expect(await mockUSDC.balanceOf(user1.address)).to.equal(initialUSDC + initialBalance);
            });

            it("Should allow winner to claim winnings (NO wins)", async function () {
                const { predictionMarket, mockUSDC, owner, user2, duration } = await createMarketWithShares();

                // Fast-forward and resolve with NO winning
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, false);

                const market = await predictionMarket.markets(0);
                const noToken = await ethers.getContractAt("OutcomeToken", market.noToken);
                const initialBalance = await noToken.balanceOf(user2.address);

                // User2 claims winnings
                const initialUSDC = await mockUSDC.balanceOf(user2.address);
                await expect(predictionMarket.connect(user2).claimWinnings(0))
                    .to.emit(predictionMarket, "WinningsClaimed")
                    .withArgs(0, user2.address, initialBalance);

                // Verify payout
                expect(await mockUSDC.balanceOf(user2.address)).to.equal(initialUSDC + initialBalance);
            });

            it("Should burn winning tokens when claiming", async function () {
                const { predictionMarket, owner, user1, duration } = await createMarketWithShares();

                // Fast-forward and resolve with YES winning
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const market = await predictionMarket.markets(0);
                const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);

                // Verify user has tokens before claiming
                const balanceBefore = await yesToken.balanceOf(user1.address);
                expect(balanceBefore).to.be.greaterThan(0);

                // Claim winnings
                await predictionMarket.connect(user1).claimWinnings(0);

                // Verify tokens were burned
                expect(await yesToken.balanceOf(user1.address)).to.equal(0);
            });

            it("Should transfer correct collateral amount", async function () {
                const { predictionMarket, mockUSDC, owner, user1, duration } = await createMarketWithShares();

                // Fast-forward and resolve with YES winning
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const market = await predictionMarket.markets(0);
                const yesToken = await ethers.getContractAt("OutcomeToken", market.yesToken);
                const winningShares = await yesToken.balanceOf(user1.address);

                const initialUSDC = await mockUSDC.balanceOf(user1.address);

                // Claim winnings
                await predictionMarket.connect(user1).claimWinnings(0);

                // Verify 1:1 payout ratio
                const finalUSDC = await mockUSDC.balanceOf(user1.address);
                expect(finalUSDC - initialUSDC).to.equal(winningShares);
            });

            it("Should not allow claiming before resolution", async function () {
                const { predictionMarket, user1 } = await createMarketWithShares();

                // Try to claim from open market
                await expect(
                    predictionMarket.connect(user1).claimWinnings(0)
                ).to.be.revertedWith("PredictionMarket: market is not resolved");
            });

            it("Should not allow claiming with zero balance", async function () {
                const { predictionMarket, owner } = await loadFixture(deployPredictionMarketFixture);

                // Create market and resolve without buying shares
                const question = "Will BTC hit $100k?";
                const duration = 7 * 24 * 60 * 60;
                await predictionMarket.connect(owner).createMarket(question, duration, 0);

                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const [, user1] = await ethers.getSigners();

                // Try to claim without holding shares
                await expect(
                    predictionMarket.connect(user1).claimWinnings(0)
                ).to.be.revertedWith("PredictionMarket: no winning shares to claim");
            });

            it("Should not allow loser to claim", async function () {
                const { predictionMarket, owner, user2, duration } = await createMarketWithShares();

                // Fast-forward and resolve with YES winning (user2 bought NO shares)
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                // User2 (who bought NO shares) tries to claim
                await expect(
                    predictionMarket.connect(user2).claimWinnings(0)
                ).to.be.revertedWith("PredictionMarket: no winning shares to claim");
            });

            it("Should update market total shares after claiming", async function () {
                const { predictionMarket, owner, user1, duration } = await createMarketWithShares();

                // Fast-forward and resolve with YES winning
                await time.increase(duration + 1);
                await predictionMarket.connect(owner).resolveMarket(0, true);

                const marketBefore = await predictionMarket.markets(0);
                const totalYesBefore = marketBefore.totalYesShares;

                const yesToken = await ethers.getContractAt("OutcomeToken", marketBefore.yesToken);
                const userBalance = await yesToken.balanceOf(user1.address);

                // Claim winnings
                await predictionMarket.connect(user1).claimWinnings(0);

                const marketAfter = await predictionMarket.markets(0);
                expect(marketAfter.totalYesShares).to.equal(totalYesBefore - userBalance);
            });
        });
    });
});
