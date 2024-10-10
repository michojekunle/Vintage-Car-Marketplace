// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AuctionLib.sol";

contract NFTAuction is ReentrancyGuard {
    using AuctionLib for *;

    IERC721 public nftContract;

    struct Auction {
        address payable seller;
        uint256 nftId;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 auctionEndTime;
        uint256 buyoutPrice;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;

    event AuctionCreated(
        uint256 indexed nftId,
        address indexed seller,
        uint256 startingPrice,
        uint256 buyoutPrice,
        uint256 auctionEndTime
    );
    event BidPlaced(uint256 indexed nftId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed nftId, address indexed winner, uint256 amount);
    event AuctionCancelled(uint256 indexed nftId);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function createAuction(
        uint256 _nftId,
        uint256 _startingPrice,
        uint256 _buyoutPrice,
        uint256 _duration
    ) external nonReentrant {
        AuctionLib.validateOwner(nftContract.ownerOf(_nftId), msg.sender);
        AuctionLib.validateStartPrice(_startingPrice);

        nftContract.transferFrom(msg.sender, address(this), _nftId);

        auctions[_nftId] = Auction({
            seller: payable(msg.sender),
            nftId: _nftId,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            auctionEndTime: block.timestamp + _duration,
            buyoutPrice: _buyoutPrice,
            active: true
        });

        emit AuctionCreated(_nftId, msg.sender, _startingPrice, _buyoutPrice, block.timestamp + _duration);
    }

    function placeBid(uint256 _nftId) external payable nonReentrant {
        Auction storage auction = auctions[_nftId];

        AuctionLib.validateAuctionActive(auction.active);
        AuctionLib.validateAuctionNotEnded(auction.auctionEndTime);
        AuctionLib.validateBidAmount(auction.highestBid, msg.value);

        AuctionLib.refundPreviousBidder(auction.highestBidder, auction.highestBid);

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit BidPlaced(_nftId, msg.sender, msg.value);

        if (msg.value >= auction.buyoutPrice && auction.buyoutPrice > 0) {
            _endAuction(_nftId);
        }
    }

    function endAuction(uint256 _nftId) external nonReentrant {
        Auction storage auction = auctions[_nftId];

        AuctionLib.validateAuctionEnded(auction.auctionEndTime);
        AuctionLib.validateAuctionActive(auction.active);

        _endAuction(_nftId);
    }

    function cancelAuction(uint256 _nftId) external nonReentrant {
        Auction storage auction = auctions[_nftId];

        AuctionLib.validateSeller(auction.seller, msg.sender);
        AuctionLib.validateNoBids(auction.highestBid);

        auction.active = false;
        nftContract.transferFrom(address(this), msg.sender, _nftId);

        emit AuctionCancelled(_nftId);
    }

    function _endAuction(uint256 _nftId) internal {
        Auction storage auction = auctions[_nftId];
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            nftContract.transferFrom(address(this), auction.highestBidder, _nftId);
            AuctionLib.transferFunds(auction.seller, auction.highestBid);

            emit AuctionEnded(_nftId, auction.highestBidder, auction.highestBid);
        } else {
            nftContract.transferFrom(address(this), auction.seller, _nftId);
        }
    }

    receive() external payable {}
}
