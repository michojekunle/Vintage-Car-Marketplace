// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockCarVerificationOracle {
    mapping(string => bool) public isVerified;
    mapping(string => address) public currentOwner;

    function setCarDetails(string memory vin, bool verified, address owner) external {
        isVerified[vin] = verified;
        currentOwner[vin] = owner;
    }

    function getCarDetailsByVIN(string memory vin) external view returns (
        string memory,
        string memory make,
        string memory model,
        uint256 year,
        bool _isVerified,
        uint256 verificationTimestamp,
        address _currentOwner
    ) {
        return ("", "Mock", "Car", 2000, isVerified[vin], block.timestamp, currentOwner[vin]);
    }

    function transferOwnership(string memory vin, address newOwner) external {
        currentOwner[vin] = newOwner;
    }
}