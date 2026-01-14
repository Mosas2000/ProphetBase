// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

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

    /**
     * @notice Initializes the PredictionMarket contract
     * @dev Sets the contract deployer as the initial owner
     */
    constructor() Ownable(msg.sender) {}
}
