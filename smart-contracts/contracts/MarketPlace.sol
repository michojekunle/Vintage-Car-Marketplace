// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
     struct Listing {
        address seller;
        uint256 price;
    }

    //we'll reference the nft contract first, sth like IERC721 public immutable nftContract;
    uint256 public marketplaceFee = 2;



}