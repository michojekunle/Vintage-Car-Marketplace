// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library AuctionLib {
    
    error NotOwner(address sender);
    error InvalidStartPrice();
    error AuctionNotActive();
    error AuctionEnded();
    error BidTooLow(uint256 currentBid, uint256 sentBid);
    error AuctionStillOngoing();
    error NotSeller(address sender);
    error BidsExist();
    error TransferFailed();
    error NotApprovedForTransfer();

    // Ensure the auction is still active
    function validateAuctionActive(bool active) internal pure {
        if (!active) revert AuctionNotActive();
    }

    // Ensure the auction has not ended yet
    function validateAuctionNotEnded(uint256 auctionEndTime) internal view {
        if (block.timestamp >= auctionEndTime) revert AuctionEnded();
    }

    // Ensure the auction has ended
    function validateAuctionEnded(uint256 auctionEndTime) internal view {
        if (block.timestamp < auctionEndTime) revert AuctionStillOngoing();
    }

    // Ensure the starting price is valid
    function validateStartPrice(uint256 startingPrice) internal pure {
        if (startingPrice <= 0) revert InvalidStartPrice();
    }

    // Ensure the bid amount is higher than the current highest bid
    function validateBidAmount(uint256 currentBid, uint256 amount) internal pure {
        if (amount <= currentBid) revert BidTooLow(currentBid, amount);
    }

    // Ensure the sender is the seller
    function validateSeller(address seller, address sender) internal pure {
        if (sender != seller) revert NotSeller(sender);
    }

    // Ensure there are no bids placed
    function validateNoBids(uint256 highestBid) internal pure {
        if (highestBid > 0) revert BidsExist();
    }

    // Ensure the sender is the owner of the NFT
    function validateOwner(address nftOwner, address sender) internal pure {
        if (nftOwner != sender) revert NotOwner(sender);
    }

    // Handle refunding the previous highest bidder
    function refundPreviousBidder(address payable previousBidder, uint256 previousBid) internal {
        if (previousBidder != address(0)) {
            (bool sent, ) = previousBidder.call{value: previousBid}("");
            if (!sent) revert TransferFailed();
        }
    }

    // Handle transferring funds using call
    function transferFunds(address payable recipient, uint256 amount) internal {
        (bool sent, ) = recipient.call{value: amount}("");
        if (!sent) revert TransferFailed();
    }

    // Ensure the contract is approved by the nft owner    
    function validateApproval(address approvedAddress, address contractAddress) internal pure {
        if (approvedAddress != contractAddress) revert NotApprovedForTransfer();
    }
}
