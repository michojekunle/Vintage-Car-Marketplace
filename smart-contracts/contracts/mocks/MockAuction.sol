// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockAuction {
    uint256 public auctionIdCounter;

    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external returns (uint256 auctionId) {
        auctionIdCounter++;
        return auctionIdCounter;
    }

    function cancelAuction(uint256 auctionId) external {
        // Simulating auction cancellation
    }

    function finishAuction(uint256 auctionId) external {
        // Simulating auction finish
    }
}