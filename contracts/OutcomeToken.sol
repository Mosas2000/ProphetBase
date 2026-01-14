// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title OutcomeToken
 * @author ProphetBase
 * @notice ERC20 token representing shares in a prediction market outcome (YES or NO)
 * @dev This token can only be minted and burned by the associated PredictionMarket contract.
 * Each market has two OutcomeTokens: one for YES and one for NO outcomes.
 * Users purchase these tokens to express their prediction, and winning tokens can be
 * redeemed for the underlying collateral after market resolution.
 */
contract OutcomeToken is ERC20 {
    /// @notice The PredictionMarket contract that controls this token
    /// @dev Only this address can mint and burn tokens
    address public immutable market;

    /**
     * @notice Restricts function access to only the PredictionMarket contract
     */
    modifier onlyMarket() {
        require(msg.sender == market, "OutcomeToken: caller is not the market");
        _;
    }

    /**
     * @notice Initializes the OutcomeToken
     * @param name The token name (e.g., "ProphetBase YES - Will ETH hit 5k?")
     * @param symbol The token symbol (e.g., "YES-ETH5K")
     * @param _market The address of the PredictionMarket contract
     */
    constructor(
        string memory name,
        string memory symbol,
        address _market
    ) ERC20(name, symbol) {
        require(_market != address(0), "OutcomeToken: market address cannot be zero");
        market = _market;
    }

    /**
     * @notice Mints outcome tokens to a user
     * @dev Can only be called by the PredictionMarket contract
     * @param to The address to receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyMarket {
        _mint(to, amount);
    }

    /**
     * @notice Burns outcome tokens from a user
     * @dev Can only be called by the PredictionMarket contract
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burn(address from, uint256 amount) external onlyMarket {
        _burn(from, amount);
    }
}
