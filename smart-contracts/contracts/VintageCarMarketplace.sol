// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

interface IVintageCarNFT is IERC721 {
    function getTokenIdByVIN(string memory vin) external view returns (uint256);
}

interface INFTAuction {
    function createAuction(
        uint256 _nftId,
        uint256 _startingPrice,
        uint256 _buyoutPrice,
        uint256 _duration,
        address _nftOwner
    ) external;

    function endAuction(uint256 _nftId) external;

    function cancelAuction(uint256 _nftId, address _nftOwner) external;
}

contract VintageCarMarketplace is
    ReentrancyGuard,
    Ownable,
    Pausable,
    ERC721Holder
{
    IVintageCarNFT public vintageCarNFT;
    INFTAuction public auctionContract;

    uint256 public marketplaceFeePercentage;
    address public feeRecipient;

    enum ListingType {
        FixedPrice,
        Auction
    }

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        ListingType listingType;
    }

    mapping(uint256 => Listing) public listings;

    event ListingCreated(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        ListingType listingType
    );
    event ListingUpdated(uint256 indexed tokenId, uint256 newPrice);
    event ListingCancelled(uint256 indexed tokenId);
    event CarSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event AuctionCreated(
        uint256 indexed tokenId,
        uint256 startingPrice,
        uint256 buyoutPrice,
        uint256 duration
    );
    event AuctionEnded(uint256 indexed tokenId);
    event MarketplaceFeeUpdated(uint256 newFeePercentage);
    event FeeRecipientUpdated(address newFeeRecipient);
    event MarketplaceFeesWithdrawn(uint256 amount);
    event AuctionContractUpdated(address newAuctionContract);

    constructor(
        address _vintageCarNFT,
        uint256 _initialFeePercentage,
        address _initialFeeRecipient
    ) Ownable(msg.sender) {
        vintageCarNFT = IVintageCarNFT(_vintageCarNFT);
        marketplaceFeePercentage = _initialFeePercentage;
        feeRecipient = _initialFeeRecipient;
    }

    function createFixedPriceListing(uint256 tokenId, uint256 price)
        external
        whenNotPaused
        nonReentrant
    {
        _createListing(tokenId, price, ListingType.FixedPrice);
    }

    function createAuctionListing(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 buyoutPrice,
        uint256 duration
    ) external whenNotPaused nonReentrant {
        require(
            address(auctionContract) != address(0),
            "Auction contract not set"
        );
      
        _createListing(tokenId, startingPrice, ListingType.Auction);

        vintageCarNFT.transferFrom(
            msg.sender,
            address(auctionContract),
            tokenId
        );
        auctionContract.createAuction(
            tokenId,
            startingPrice,
            buyoutPrice,
            duration,
            msg.sender
        );

        emit AuctionCreated(tokenId, startingPrice, buyoutPrice, duration);
    }

    function _createListing(
        uint256 tokenId,
        uint256 price,
        ListingType listingType
    ) internal {
        require(
            vintageCarNFT.ownerOf(tokenId) == msg.sender,
            "Not owner of the token"
        );
        require(price > 0, "Price must be greater than zero");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listingType: listingType
        });

        emit ListingCreated(tokenId, msg.sender, price, listingType);
    }

    function updateListing(uint256 tokenId, uint256 newPrice)
        external
        whenNotPaused
        nonReentrant
    {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Not the seller");
        require(newPrice > 0, "Price must be greater than zero");
        require(
            listing.listingType == ListingType.FixedPrice,
            "Can only update fixed price listings"
        );

        listing.price = newPrice;
        emit ListingUpdated(tokenId, newPrice);
    }

    function cancelListing(uint256 tokenId)
        external
        whenNotPaused
        nonReentrant
    {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Not the seller");

        if (listing.listingType == ListingType.Auction) {
            require(
                address(auctionContract) != address(0),
                "Auction contract not set"
            );
            auctionContract.cancelAuction(tokenId, msg.sender);
        }

        listing.isActive = false;
        emit ListingCancelled(tokenId);
    }

    function buyCar(uint256 tokenId)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(
            listing.listingType == ListingType.FixedPrice,
            "Not a fixed price listing"
        );
        require(msg.value >= listing.price, "Insufficient payment");

        _processSale(listing, msg.sender, listing.price);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }

    function endAuction(uint256 tokenId) external whenNotPaused nonReentrant {
        require(
            address(auctionContract) != address(0),
            "Auction contract not set"
        );
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(
            listing.listingType == ListingType.Auction,
            "Not an auction listing"
        );

        auctionContract.endAuction(tokenId);
        listing.isActive = false;

        emit AuctionEnded(tokenId);
    }

    function _processSale(
        Listing storage listing,
        address buyer,
        uint256 price
    ) internal {
        address seller = listing.seller;
        uint256 tokenId = listing.tokenId;

        listing.isActive = false;

        uint256 feeAmount = (price * marketplaceFeePercentage) / 10000;
        uint256 sellerAmount = price - feeAmount;

        vintageCarNFT.transferFrom(seller, buyer, tokenId);

        payable(feeRecipient).transfer(feeAmount);
        payable(seller).transfer(sellerAmount);

        emit CarSold(tokenId, seller, buyer, price);
    }

    function getListing(uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return listings[tokenId];
    }

    function setMarketplaceFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee percentage too high");
        marketplaceFeePercentage = newFeePercentage;
        emit MarketplaceFeeUpdated(newFeePercentage);
    }

    function setFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = newFeeRecipient;
        emit FeeRecipientUpdated(newFeeRecipient);
    }

    function withdrawMarketplaceFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
        emit MarketplaceFeesWithdrawn(balance);
    }

    function updateContractAddresses(
        address _vintageCarNFT,
        address _auctionContract
    ) external onlyOwner {
        require(_vintageCarNFT != address(0), "Invalid NFT contract address");
        vintageCarNFT = IVintageCarNFT(_vintageCarNFT);
        auctionContract = INFTAuction(_auctionContract);
        emit AuctionContractUpdated(_auctionContract);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
