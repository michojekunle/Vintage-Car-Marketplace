// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "./VintageCarNFT.sol"; //import our nft contract
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VintageCarMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }


    //we'll reference the nft contract first, sth like
 //VintageCarNFT public nftContract;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public proceeds;

        event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
        event Cancelled(uint256 indexed tokenId);



   constructor(VintageCarNFT _nftContract) Ownable(msg.sender) {
    nftContract = VintageCarNFT(_nftContract);
}



    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.exists(tokenId), "NFT does not exist");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");
        require(price > 0, "Price must be greater than zero");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit Listed(tokenId, msg.sender, price);
    }

     function cancelNFT(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "NFT is not listed");

        listing.isActive = false;
        listings[tokenId] = listing;

        emit Cancelled(tokenId);
    }

}
