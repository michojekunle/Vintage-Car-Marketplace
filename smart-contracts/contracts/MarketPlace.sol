// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./VintageCarNFT.sol"; //import our nft contract
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VintageCarMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

    //we'll reference the nft contract first, sth like
    VintageCarNFT public nftContract;
    uint256 public marketplaceFee = 2; // 2% fee
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public proceeds;

    event Listed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event Updated(uint256 indexed tokenId, uint256 newPrice);
    event Cancelled(uint256 indexed tokenId);
    event Bought(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event Withdrawn(address indexed seller, uint256 amount);

    constructor(VintageCarNFT _nftContract) Ownable(msg.sender) {
        nftContract = VintageCarNFT(_nftContract);
    }

    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.exists(tokenId), "NFT does not exist");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nftContract.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );
        require(price > 0, "Price must be greater than zero");
        require(!listings[tokenId].isActive, "NFT is already listed");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit Listed(tokenId, msg.sender, price);
    }

    function updateListing(
        uint256 tokenId,
        uint256 newPrice
    ) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "NFT is not listed");
        require(newPrice > 0, "Price must be greater than zero");

        listing.price = newPrice;
        listings[tokenId] = listing;

        emit Updated(tokenId, newPrice);
    }

    function cancelNFT(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "NFT is not listed");

        listing.isActive = false;
        listings[tokenId] = listing;

        emit Cancelled(tokenId);
    }

    function buyCar(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not for sale");
        require(
            msg.value == listing.price,
            "Incorrect value sent, please send the exact price"
        );

        // Calculate marketplace fee (e.g. 2%)
        uint256 fee = (listing.price * marketplaceFee) / 100;
        uint256 sellerProceeds = listing.price - fee;

        //change to inactive first, then transfer
        listing.isActive = false;
        listings[tokenId] = listing;

        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        proceeds[listing.seller] += sellerProceeds;
        proceeds[owner()] += fee; //the fee

        emit Bought(tokenId, msg.sender, listing.price);
    }

  function withdrawFunds() external nonReentrant {
    uint256 amount = proceeds[msg.sender];
    require(amount > 0, "No funds to withdraw");

    proceeds[msg.sender] = 0; 

    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed");

    emit Withdrawn(msg.sender, amount);
}


    // market place fn
    function setMarketplaceFee(uint256 _fee) external onlyOwner {
        require(_fee <= 100, "Fee cannot exceed 100%");
        marketplaceFee = _fee;
    }

    function getListing(
        uint256 tokenId
    ) external view returns (Listing memory) {
        return listings[tokenId];
    }
}
