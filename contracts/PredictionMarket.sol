// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
}
