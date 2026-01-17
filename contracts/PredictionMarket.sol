// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
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
contract PredictionMarket is Ownable, Pausable {
    using SafeERC20 for IERC20;
    
    /// @notice Market categories for classification
    enum Category {
        DeFi,      // Decentralized Finance
        Crypto,    // Cryptocurrency prices/events
        Politics,  // Political events
        Sports,    // Sports outcomes
        Other      // Miscellaneous
    }
    
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
        Category category;        // Market category
    }

    /// @notice Mapping from market ID to Market struct
    mapping(uint256 => Market) public markets;

    /// @notice Total number of markets created
    uint256 public marketCount;
    
    /// @notice Fee percentage (2%)
    uint256 public constant FEE_PERCENTAGE = 2;
    
    /// @notice Total fees collected across all markets
    uint256 public totalFeesCollected;
    
    /// @notice Fees collected per market
    mapping(uint256 => uint256) public feesCollected;
    
    /// @notice Markets by category for filtering
    mapping(Category => uint256[]) private marketsByCategory;

    /// @notice The ERC20 token used as collateral for all markets
    /// @dev Users must deposit this token to purchase outcome shares
    IERC20 public immutable collateralToken;

    /// @notice Emitted when a new prediction market is created
    /// @param marketId The unique identifier for the market
    /// @param question The prediction question
    /// @param yesToken Address of the YES outcome token
    /// @param noToken Address of the NO outcome token
    /// @param endTime Timestamp when betting closes
    /// @param category Market category
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address yesToken,
        address noToken,
        uint256 endTime,
        Category category
    );

    /// @notice Emitted when a user purchases outcome shares
    /// @param marketId The market identifier
    /// @param buyer The address of the buyer
    /// @param outcome True for YES shares, false for NO shares
    /// @param amount The number of shares purchased
    /// @param fee The fee collected
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed buyer,
        bool outcome,
        uint256 amount,
        uint256 fee
    );
    
    /// @notice Emitted when a user sells outcome shares
    /// @param marketId The market identifier
    /// @param seller The address of the seller
    /// @param outcome True for YES shares, false for NO shares
    /// @param amount The number of shares sold
    event SharesSold(
        uint256 indexed marketId,
        address indexed seller,
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
    
    /// @notice Emitted when fees are withdrawn
    /// @param owner The contract owner
    /// @param amount The amount withdrawn
    event FeesWithdrawn(
        address indexed owner,
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
        uint256 duration,
        Category category
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
            totalNoShares: 0,
            category: category
        });
        
        // Add to category mapping
        marketsByCategory[category].push(marketId);

        marketCount++;

        emit MarketCreated(
            marketId,
            question,
            address(yesToken),
            address(noToken),
            endTime,
            category
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
    ) external whenNotPaused {
        require(marketId < marketCount, "PredictionMarket: market does not exist");
        require(amount > 0, "PredictionMarket: amount must be greater than zero");

        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Open, "PredictionMarket: market is not open");
        require(block.timestamp < market.endTime, "PredictionMarket: betting period has ended");

        // Calculate fee (2%)
        uint256 fee = (amount * FEE_PERCENTAGE) / 100;
        uint256 netAmount = amount - fee;
        
        // Collect fees
        feesCollected[marketId] += fee;
        totalFeesCollected += fee;

        // Transfer collateral from user to contract
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        // Mint outcome tokens based on user's choice (using net amount)
        if (buyYes) {
            OutcomeToken(market.yesToken).mint(msg.sender, netAmount);
            market.totalYesShares += netAmount;
        } else {
            OutcomeToken(market.noToken).mint(msg.sender, netAmount);
            market.totalNoShares += netAmount;
        }

        emit SharesPurchased(marketId, msg.sender, buyYes, netAmount, fee);
    }
    
    /**
     * @notice Allows users to sell their outcome shares before market resolution
     * @param marketId The ID of the market
     * @param sellYes True to sell YES shares, false to sell NO shares
     * @param amount The amount of shares to sell
     * @dev Burns the user's outcome tokens and returns collateral 1:1
     */
    function sellShares(
        uint256 marketId,
        bool sellYes,
        uint256 amount
    ) external whenNotPaused {
        require(marketId < marketCount, "PredictionMarket: market does not exist");
        require(amount > 0, "PredictionMarket: amount must be greater than zero");

        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Open, "PredictionMarket: market is not open");
        require(block.timestamp < market.endTime, "PredictionMarket: betting period has not ended");

        // Get the appropriate token
        address tokenAddress = sellYes ? market.yesToken : market.noToken;
        OutcomeToken token = OutcomeToken(tokenAddress);
        
        // Check user has enough tokens
        require(token.balanceOf(msg.sender) >= amount, "PredictionMarket: insufficient token balance");

        // Burn the user's tokens
        token.burn(msg.sender, amount);
        
        // Update market totals
        if (sellYes) {
            market.totalYesShares -= amount;
        } else {
            market.totalNoShares -= amount;
        }

        // Transfer collateral back to user (1:1 ratio)
        collateralToken.safeTransfer(msg.sender, amount);

        emit SharesSold(marketId, msg.sender, sellYes, amount);
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
    
    /**
     * @notice Get all markets in a specific category
     * @param category The category to filter by
     * @return Array of market IDs in the category
     */
    function getMarketsByCategory(Category category) external view returns (uint256[] memory) {
        return marketsByCategory[category];
    }
    
    /**
     * @notice Withdraw collected fees (owner only)
     * @dev Transfers all collected fees to the contract owner
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = totalFeesCollected;
        require(amount > 0, "PredictionMarket: no fees to withdraw");
        
        totalFeesCollected = 0;
        collateralToken.safeTransfer(owner(), amount);
        
        emit FeesWithdrawn(owner(), amount);
    }
    
    /**
     * @notice Pause the contract (owner only)
     * @dev Prevents buying and selling shares when paused
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause the contract (owner only)
     * @dev Resumes normal operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
