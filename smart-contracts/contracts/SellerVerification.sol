// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SellerVerification is Ownable {
    struct SellerInfo {
        bytes32 idNumberHash;
        bool isVerified;
        uint256 verificationTimestamp;
    }

    mapping(address => SellerInfo) private sellers;
    string private encryptedDatabaseIpfsUrl;

    event SellerVerified(address indexed seller, uint256 timestamp);
    event VerificationRevoked(address indexed seller, uint256 timestamp);
    event SellerInfoUpdated(address indexed seller, uint256 timestamp);
    event EncryptedDatabaseIpfsUrlUpdated(uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function setEncryptedDatabaseIpfsUrl(string memory _url) external onlyOwner {
        require(bytes(_url).length > 0, "Invalid IPFS URL");
        encryptedDatabaseIpfsUrl = _url;
        emit EncryptedDatabaseIpfsUrlUpdated(block.timestamp);
    }

    function getEncryptedDatabaseIpfsUrl() external view onlyOwner returns (string memory) {
        return encryptedDatabaseIpfsUrl;
    }

    function verifySeller(address seller, bytes32 idNumberHash) external onlyOwner {
        require(seller != address(0), "Invalid seller address");
        require(idNumberHash != bytes32(0), "Invalid ID number hash");

        sellers[seller] = SellerInfo({
            idNumberHash: idNumberHash,
            isVerified: true,
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

    function updateSellerInfo(address seller, bytes32 newIdNumberHash) external onlyOwner {
        require(seller != address(0), "Invalid seller address");
        require(sellers[seller].isVerified, "Seller is not verified");
        require(newIdNumberHash != bytes32(0), "Invalid ID number hash");

        SellerInfo storage sellerInfo = sellers[seller];
        sellerInfo.idNumberHash = newIdNumberHash;

        emit SellerInfoUpdated(seller, block.timestamp);
    }

    function isSellerVerified(address seller) external view returns (bool) {
        return sellers[seller].isVerified;
    }

    function getSellerInfo(address seller) external view returns (SellerInfo memory) {
        return sellers[seller];
    }
}
