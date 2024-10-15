// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SellerVerification is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

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
    event VerifierRoleGranted(address indexed account, address indexed grantor);
    event VerifierRoleRevoked(address indexed account, address indexed revoker);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not a verifier");
        _;
    }

    function setEncryptedDatabaseIpfsUrl(string memory _url) external onlyVerifier {
        require(bytes(_url).length > 0, "Invalid IPFS URL");
        encryptedDatabaseIpfsUrl = _url;
        emit EncryptedDatabaseIpfsUrlUpdated(block.timestamp);
    }

    function getEncryptedDatabaseIpfsUrl() external view onlyVerifier returns (string memory) {
        return encryptedDatabaseIpfsUrl;
    }

    function verifySeller(address seller, bytes32 idNumberHash) external onlyVerifier {
        require(seller != address(0), "Invalid seller address");
        require(idNumberHash != bytes32(0), "Invalid ID number hash");

        sellers[seller] = SellerInfo({
            idNumberHash: idNumberHash,
            isVerified: true,
            verificationTimestamp: block.timestamp
        });

        emit SellerVerified(seller, block.timestamp);
    }

    function revokeSeller(address seller) external onlyVerifier {
        require(seller != address(0), "Invalid seller address");
        require(sellers[seller].isVerified, "Seller is not verified");

        sellers[seller].isVerified = false;

        emit VerificationRevoked(seller, block.timestamp);
    }

    function updateSellerInfo(address seller, bytes32 newIdNumberHash) external onlyVerifier {
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

    function grantVerifierRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid address");
        grantRole(VERIFIER_ROLE, account);
        emit VerifierRoleGranted(account, msg.sender);
    }

    function revokeVerifierRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid address");
        revokeRole(VERIFIER_ROLE, account);
        emit VerifierRoleRevoked(account, msg.sender);
    }
}
