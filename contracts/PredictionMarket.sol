// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./OutcomeToken.sol";

/**
 * @title PredictionMarket
 * @author ProphetBase
 * @notice A decentralized prediction market protocol for crypto events on Base
 * @dev This contract allows users to create binary prediction markets (YES/NO outcomes)
 * and trade shares representing their predictions. Markets can be created, traded on,
 * and resolved by the contract owner.
 */
contract PredictionMarket is Ownable {
    using SafeERC20 for IERC20;
    /// @notice Possible states for a prediction market
    enum MarketStatus {
        Open,      // Market is accepting bets
        Resolved,  // Market has been resolved with an outcome
        Cancelled  // Market has been cancelled (refunds enabled)
    }

    /**
     * @notice Represents a single prediction market
     * @dev Each market has YES and NO outcome tokens that users can purchase
     */
    struct Market {
        string question;           // The question being predicted
        uint256 endTime;          // Timestamp when betting closes
        uint256 resolutionTime;   // Timestamp when market was resolved
        MarketStatus status;      // Current status of the market
        bool outcome;             // Final outcome: true = YES wins, false = NO wins
        address yesToken;         // Address of the YES outcome token contract
        address noToken;          // Address of the NO outcome token contract
        uint256 totalYesShares;   // Total YES shares minted
        uint256 totalNoShares;    // Total NO shares minted
    }

    /// @notice Mapping from market ID to Market struct
    mapping(uint256 => Market) public markets;

    /// @notice Total number of markets created
    uint256 public marketCount;

    /// @notice The ERC20 token used as collateral for all markets
    /// @dev Users must deposit this token to purchase outcome shares
    IERC20 public immutable collateralToken;

    /// @notice Emitted when a new prediction market is created
    /// @param marketId The unique identifier for the market
    /// @param question The prediction question
    /// @param yesToken Address of the YES outcome token
    /// @param noToken Address of the NO outcome token
    /// @param endTime Timestamp when betting closes
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address yesToken,
        address noToken,
        uint256 endTime
    );

    /// @notice Emitted when a user purchases outcome shares
    /// @param marketId The market identifier
    /// @param buyer The address of the buyer
    /// @param outcome True for YES shares, false for NO shares
    /// @param amount The number of shares purchased
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed buyer,
        bool outcome,
        uint256 amount
    );

    /// @notice Emitted when a market is resolved
    /// @param marketId The market identifier
    /// @param outcome The final outcome (true = YES wins, false = NO wins)
    /// @param resolutionTime The timestamp when the market was resolved
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 resolutionTime
    );

    /// @notice Emitted when a user claims their winnings
    /// @param marketId The market identifier
    /// @param claimer The address claiming winnings
    /// @param amount The amount of collateral claimed
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed claimer,
        uint256 amount
    );

    /**
     * @notice Initializes the PredictionMarket contract
     * @param _collateralToken The ERC20 token to use as collateral
     * @dev Sets the contract deployer as the initial owner
     */
    constructor(address _collateralToken) Ownable(msg.sender) {
        require(_collateralToken != address(0), "PredictionMarket: collateral token cannot be zero address");
        collateralToken = IERC20(_collateralToken);
    }

    /**
     * @notice Creates a new prediction market
     * @param question The prediction question (e.g., "Will ETH hit $5k by end of 2026?")
     * @param duration Time in seconds until betting closes
     * @return marketId The unique identifier for the newly created market
     * @dev Only the contract owner can create markets. Deploys two OutcomeToken contracts
     * for YES and NO outcomes.
     */
    function createMarket(
        string calldata question,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        require(bytes(question).length > 0, "PredictionMarket: question cannot be empty");
        require(duration > 0, "PredictionMarket: duration must be greater than zero");

        uint256 marketId = marketCount;
        uint256 endTime = block.timestamp + duration;

        // Deploy YES and NO outcome tokens
        OutcomeToken yesToken = new OutcomeToken(
            string.concat("ProphetBase YES - ", question),
            "YES",
            address(this)
        );
        
        OutcomeToken noToken = new OutcomeToken(
            string.concat("ProphetBase NO - ", question),
            "NO",
            address(this)
        );

        // Create and store the market
        markets[marketId] = Market({
            question: question,
            endTime: endTime,
            resolutionTime: 0,
            status: MarketStatus.Open,
            outcome: false,
            yesToken: address(yesToken),
            noToken: address(noToken),
            totalYesShares: 0,
            totalNoShares: 0
        });

        marketCount++;

        emit MarketCreated(
            marketId,
            question,
            address(yesToken),
            address(noToken),
            endTime
        );

        return marketId;
    }

    /**
     * @notice Allows users to purchase outcome shares in a prediction market
     * @param marketId The ID of the market to buy shares in
     * @param buyYes True to buy YES shares, false to buy NO shares
     * @param amount The amount of collateral to spend (receives 1:1 shares)
     * @dev Users must approve this contract to spend their collateral tokens first.
     * Currently uses a simple 1:1 ratio (1 collateral token = 1 outcome share).
     * AMM-based dynamic pricing will be implemented in a future version.
     */
    function buyShares(
        uint256 marketId,
        bool buyYes,
        uint256 amount
    ) external {
        require(marketId < marketCount, "PredictionMarket: market does not exist");
        require(amount > 0, "PredictionMarket: amount must be greater than zero");

        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Open, "PredictionMarket: market is not open");
        require(block.timestamp < market.endTime, "PredictionMarket: betting period has ended");

        // Transfer collateral from user to contract
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        // Mint outcome tokens based on user's choice
        if (buyYes) {
            OutcomeToken(market.yesToken).mint(msg.sender, amount);
            market.totalYesShares += amount;
        } else {
            OutcomeToken(market.noToken).mint(msg.sender, amount);
            market.totalNoShares += amount;
        }

        emit SharesPurchased(marketId, msg.sender, buyYes, amount);
    }

    /**
     * @notice Resolves a prediction market with the final outcome
     * @param marketId The ID of the market to resolve
     * @param outcome The final outcome (true = YES wins, false = NO wins)
     * @dev Only the contract owner can resolve markets. The market must be open and
     * the betting period must have ended. In future versions, this will be replaced
     * with oracle-based resolution for trustless outcomes.
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external onlyOwner {
        require(marketId < marketCount, "PredictionMarket: market does not exist");

        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Open, "PredictionMarket: market is not open");
        require(block.timestamp >= market.endTime, "PredictionMarket: betting period has not ended");

        // Update market state
        market.status = MarketStatus.Resolved;
        market.outcome = outcome;
        market.resolutionTime = block.timestamp;

        emit MarketResolved(marketId, outcome, block.timestamp);
    }

    /**
     * @notice Allows winners to claim their rewards after market resolution
     * @param marketId The ID of the market to claim winnings from
     * @return payout The amount of collateral tokens claimed
     * @dev Users must hold winning outcome tokens to claim. Currently uses a simple
     * 1:1 payout ratio (1 winning share = 1 collateral token). The winning tokens
     * are burned when claimed. Losing shares have no value and cannot be redeemed.
     */
    function claimWinnings(uint256 marketId) external returns (uint256) {
        require(marketId < marketCount, "PredictionMarket: market does not exist");

        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Resolved, "PredictionMarket: market is not resolved");

        // Determine the winning token based on the outcome
        address winningToken = market.outcome ? market.yesToken : market.noToken;
        OutcomeToken token = OutcomeToken(winningToken);

        // Get user's winning token balance
        uint256 balance = token.balanceOf(msg.sender);
        require(balance > 0, "PredictionMarket: no winning shares to claim");

        // Burn the winning tokens from the user
        token.burn(msg.sender, balance);

        // Calculate payout (1:1 ratio for now)
        uint256 payout = balance;

        // Update market's total shares
        if (market.outcome) {
            market.totalYesShares -= balance;
        } else {
            market.totalNoShares -= balance;
        }

        // Transfer collateral to user
        collateralToken.safeTransfer(msg.sender, payout);

        emit WinningsClaimed(marketId, msg.sender, payout);

        return payout;
    }
}
