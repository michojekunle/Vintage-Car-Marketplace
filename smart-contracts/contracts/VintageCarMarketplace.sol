// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

interface IVintageCarNFT {
    function isApprovedOrOwner(address spender, uint256 tokenId) external view returns (bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function getCarDetails(uint256 tokenId) external view returns (
        string memory make,
        string memory model,
        uint16 year,
        string memory vin,
        string memory color,
        uint32 mileage,
        string memory condition,
        uint256 lastServiceDate
    );
}

interface ICarVerificationOracle {
    function getCarDetailsByVIN(string memory vin) external view returns (
        string memory,
        string memory make,
        string memory model,
        uint256 year,
        bool isVerified,
        uint256 verificationTimestamp,
        address currentOwner
    );
    function transferOwnership(string memory vin, address newOwner) external;
}

interface IAuction {
    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external returns (uint256 auctionId);
    function cancelAuction(uint256 auctionId) external;
    function finishAuction(uint256 auctionId) external;
}

contract VintageCarMarketplace is ReentrancyGuard, Ownable, Pausable, ERC721Holder {
    IVintageCarNFT public vintageCarNFT;
    ICarVerificationOracle public carVerificationOracle;
    IAuction public auctionContract;

    uint256 public marketplaceFeePercentage;
    address public feeRecipient;

    enum ListingType { FixedPrice, Auction }

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        ListingType listingType;
        uint256 auctionId;  // Will only be used for auction listings
    }

    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 indexed tokenId, address indexed seller, uint256 price, ListingType listingType);
    event ListingUpdated(uint256 indexed tokenId, uint256 newPrice);
    event ListingCancelled(uint256 indexed tokenId);
    event CarSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event AuctionCreated(uint256 indexed tokenId, uint256 indexed auctionId, uint256 startingPrice);
    event AuctionCancelled(uint256 indexed tokenId, uint256 indexed auctionId);
    event FundsWithdrawn(address indexed seller, uint256 amount);
    event MarketplaceFeeUpdated(uint256 newFeePercentage);
    event FeeRecipientUpdated(address newFeeRecipient);
    event MarketplaceFeesWithdrawn(uint256 amount);
    event AuctionContractUpdated(address newAuctionContract);

    constructor(
        address _vintageCarNFT,
        address _carVerificationOracle,
        uint256 _initialFeePercentage,
        address _initialFeeRecipient
    ) Ownable(msg.sender) {
        vintageCarNFT = IVintageCarNFT(_vintageCarNFT);
        carVerificationOracle = ICarVerificationOracle(_carVerificationOracle);
        marketplaceFeePercentage = _initialFeePercentage;
        feeRecipient = _initialFeeRecipient;
    }

    function createFixedPriceListing(uint256 tokenId, uint256 price) external whenNotPaused nonReentrant {
        _createListing(tokenId, price, ListingType.FixedPrice);
    }

    function createAuctionListing(uint256 tokenId, uint256 startingPrice, uint256 duration) external whenNotPaused nonReentrant {
        require(address(auctionContract) != address(0), "Auction contract not set");
        _createListing(tokenId, startingPrice, ListingType.Auction);
        
        uint256 auctionId = auctionContract.createAuction(tokenId, startingPrice, duration);
        listings[tokenId].auctionId = auctionId;
        
        emit AuctionCreated(tokenId, auctionId, startingPrice);
    }

    function _createListing(uint256 tokenId, uint256 price, ListingType listingType) internal {
        require(vintageCarNFT.isApprovedOrOwner(msg.sender, tokenId), "Not owner or approved");
        require(price > 0, "Price must be greater than zero");

        (, , , string memory vin, , , ,) = vintageCarNFT.getCarDetails(tokenId);
        (, , , , bool isVerified, , address currentOwner) = carVerificationOracle.getCarDetailsByVIN(vin);

        require(isVerified, "Car is not verified");
        require(currentOwner == msg.sender, "Ownership mismatch in verification oracle");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listingType: listingType,
            auctionId: 0
        });

        emit ListingCreated(tokenId, msg.sender, price, listingType);
    }

    function updateListing(uint256 tokenId, uint256 newPrice) external whenNotPaused nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Not the seller");
        require(newPrice > 0, "Price must be greater than zero");
        require(listing.listingType == ListingType.FixedPrice, "Can only update fixed price listings");

        listing.price = newPrice;
        emit ListingUpdated(tokenId, newPrice);
    }

    function cancelListing(uint256 tokenId) external whenNotPaused nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Not the seller");

        if (listing.listingType == ListingType.Auction) {
            require(address(auctionContract) != address(0), "Auction contract not set");
            auctionContract.cancelAuction(listing.auctionId);
            emit AuctionCancelled(tokenId, listing.auctionId);
        }

        listing.isActive = false;
        emit ListingCancelled(tokenId);
    }

    function buyCar(uint256 tokenId) external payable whenNotPaused nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.listingType == ListingType.FixedPrice, "Not a fixed price listing");
        require(msg.value >= listing.price, "Insufficient payment");

        _processSale(listing, msg.sender, listing.price);

        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }

    function finishAuction(uint256 tokenId) external whenNotPaused nonReentrant {
        require(address(auctionContract) != address(0), "Auction contract not set");
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.listingType == ListingType.Auction, "Not an auction listing");

        auctionContract.finishAuction(listing.auctionId);
        // The actual transfer of NFT and funds should be handled by the Auction contract
        // Here we just update our listing status
        listing.isActive = false;
    }

    function _processSale(Listing storage listing, address buyer, uint256 price) internal {
        address seller = listing.seller;
        uint256 tokenId = listing.tokenId;

        listing.isActive = false;

        uint256 feeAmount = (price * marketplaceFeePercentage) / 10000;
        uint256 sellerAmount = price - feeAmount;

        vintageCarNFT.transferFrom(seller, buyer, tokenId);

        (, , , string memory vin, , , ,) = vintageCarNFT.getCarDetails(tokenId);
        carVerificationOracle.transferOwnership(vin, buyer);

        payable(feeRecipient).transfer(feeAmount);
        payable(seller).transfer(sellerAmount);

        emit CarSold(tokenId, seller, buyer, price);
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
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
        address _carVerificationOracle,
        address _auctionContract
    ) external onlyOwner {
        require(_vintageCarNFT != address(0) && _carVerificationOracle != address(0), "Invalid addresses");
        vintageCarNFT = IVintageCarNFT(_vintageCarNFT);
        carVerificationOracle = ICarVerificationOracle(_carVerificationOracle);
        auctionContract = IAuction(_auctionContract);
        emit AuctionContractUpdated(_auctionContract);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}