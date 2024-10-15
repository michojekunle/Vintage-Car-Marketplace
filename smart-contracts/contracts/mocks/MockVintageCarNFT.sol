// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockVintageCarNFT is ERC721 {
    constructor() ERC721("MockVintageCarNFT", "MVNFT") {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }


    function getCarDetails(uint256 tokenId) external view returns (
        string memory make,
        string memory model,
        uint16 year,
        string memory vin,
        string memory color,
        uint32 mileage,
        string memory condition,
        uint256 lastServiceDate
    ) {
        return ("Mock", "Car", 2000, "VIN123", "Red", 50000, "Good", block.timestamp);
    }
}