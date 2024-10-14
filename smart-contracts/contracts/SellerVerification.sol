// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SellerVerification is Ownable {
    struct SellerInfo {
        bytes32 nameHash;
        bool isVerified;
        string ipfsUrl;
        uint256 verificationTimestamp;
    }

    mapping(address => SellerInfo) private sellers;

    event SellerVerified(address indexed seller, uint256 timestamp);
    event VerificationRevoked(address indexed seller, uint256 timestamp);
    event SellerInfoUpdated(address indexed seller, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function verifySeller(address seller, bytes32 nameHash, string memory ipfsUrl) external onlyOwner {
        require(seller != address(0), "Invalid seller address");
        require(nameHash != bytes32(0), "Invalid name hash");
        require(bytes(ipfsUrl).length > 0, "Invalid IPFS URL");

        sellers[seller] = SellerInfo({
            nameHash: nameHash,
            isVerified: true,
            ipfsUrl: ipfsUrl,
            verificationTimestamp: block.timestamp
        });

        emit SellerVerified(seller, block.timestamp);
    }

    function revokeSeller(address seller) external onlyOwner {
        require(seller != address(0), "Invalid seller address");
        require(sellers[seller].isVerified, "Seller is not verified");

        sellers[seller].isVerified = false;

        emit VerificationRevoked(seller, block.timestamp);
    }

    function updateSellerInfo(address seller, bytes32 newNameHash, string memory newIpfsUrl) external onlyOwner {
        require(seller != address(0), "Invalid seller address");
        require(sellers[seller].isVerified, "Seller is not verified");
        require(newNameHash != bytes32(0), "Invalid name hash");
        require(bytes(newIpfsUrl).length > 0, "Invalid IPFS URL");

        SellerInfo storage sellerInfo = sellers[seller];
        sellerInfo.nameHash = newNameHash;
        sellerInfo.ipfsUrl = newIpfsUrl;

        emit SellerInfoUpdated(seller, block.timestamp);
    }

    function isSellerVerified(address seller) external view returns (bool) {
        return sellers[seller].isVerified;
    }

    function getSellerInfo(address seller) external view returns (SellerInfo memory) {
        return sellers[seller];
    }
}