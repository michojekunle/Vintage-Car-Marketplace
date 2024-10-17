// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AuctionLib.sol";
import "./VintageCarNFT.sol";

contract NFTAuction is ReentrancyGuard, IERC721Receiver {
    using AuctionLib for *;

    VintageCarNFT public nftContract;

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

    constructor(VintageCarNFT _nftContract) {
        nftContract = _nftContract;
    }

    function createAuction(
        uint256 _nftId,
        uint256 _startingPrice,
        uint256 _buyoutPrice,
        uint256 _duration,
        address _nftOwner
    ) external nonReentrant {
        AuctionLib.validateOwner(nftContract.ownerOf(_nftId), _nftOwner);
        AuctionLib.validateStartPrice(_startingPrice);

        // if (nftContract.getApproved(_nftId)) != address(this) {
        //     revert AuctionLib.NotApprovedForTransfer();
        // };
        AuctionLib.validateApproval(nftContract.getApproved(_nftId), address(this));

        nftContract.safeTransferFrom(_nftOwner, address(this), _nftId);

        auctions[_nftId] = Auction({
            seller: payable(_nftOwner),
            nftId: _nftId,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            auctionEndTime: block.timestamp + _duration,
            buyoutPrice: _buyoutPrice,
            active: true
        });

        emit AuctionCreated(_nftId, _nftOwner, _startingPrice, _buyoutPrice, block.timestamp + _duration);
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

    function cancelAuction(uint256 _nftId, address _nftOwner) external nonReentrant {
        Auction storage auction = auctions[_nftId];

        AuctionLib.validateSeller(auction.seller, _nftOwner);
        AuctionLib.validateNoBids(auction.highestBid);

        auction.active = false;
        nftContract.safeTransferFrom(address(this), _nftOwner, _nftId);

        emit AuctionCancelled(_nftId);
    }

    function _endAuction(uint256 _nftId) internal {
        Auction storage auction = auctions[_nftId];
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            nftContract.safeTransferFrom(address(this), auction.highestBidder, _nftId);
            AuctionLib.transferFunds(auction.seller, auction.highestBid);

            emit AuctionEnded(_nftId, auction.highestBidder, auction.highestBid);
        } else {
            nftContract.safeTransferFrom(address(this), auction.seller, _nftId);
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // This function simply returns a specific selector to indicate the contract can receive NFTs
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}
}
