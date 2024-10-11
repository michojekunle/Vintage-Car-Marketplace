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
    //NFTContract public nftContract; 
    uint256 public marketplaceFee = 2;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public proceeds;


    event NFTListed(address indexed seller, uint256 indexed tokenId, uint256 price);


    constructor(NFTContract _nftContract) Ownable(msg.sender) {
        nftContract = _nftContract;
    }


    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) || 
            nftContract.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing(msg.sender, price);
        emit NFTListed(msg.sender, tokenId, price);
    }
}
