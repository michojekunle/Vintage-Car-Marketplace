// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarVerificationOracle is FunctionsClient, ConfirmedOwner, Pausable {
    using FunctionsRequest for FunctionsRequest.Request;

    struct CarDetails {
        string vin;
        string make;
        string model;
        uint256 year;
        bool isVerified;
        uint256 verificationTimestamp;
    }

    event VerificationRequested(bytes32 indexed requestId, string indexed vin, address indexed requester);
    event VerificationFulfilled(bytes32 indexed requestId, string indexed vin, bool isVerified);
    event VerificationTimedOut(bytes32 indexed requestId, string indexed vin);
    event BatchVerificationRequested(bytes32[] requestIds, string[] vins, address indexed requester);

    bytes32 public latestRequestId;
    mapping(bytes32 => CarDetails) public verifications;
    mapping(address => uint256) public lastRequestTimestamp;
    uint64 public subscriptionId;
    bytes32 public donId;
    uint256 public constant REQUEST_COOLDOWN = 10 minutes;
    uint256 public constant VERIFICATION_TIMEOUT = 1 hours;

    error RateLimitExceeded(address requester, uint256 cooldownEnd);
    error InvalidVIN(string vin);
    error VerificationNotFound(bytes32 requestId);
    error VerificationTimedOutError(bytes32 requestId);
    error BatchSizeMismatch();

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        subscriptionId = 3637; 
        donId = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    }

    function requestCarValidation(
        string memory vin,
        string memory make,
        string memory model,
        uint256 year,
        string memory source
    ) public whenNotPaused returns (bytes32) {
        if (bytes(vin).length != 17) revert InvalidVIN(vin);
        if (block.timestamp - lastRequestTimestamp[msg.sender] < REQUEST_COOLDOWN) {
            revert RateLimitExceeded(msg.sender, lastRequestTimestamp[msg.sender] + REQUEST_COOLDOWN);
        }

        lastRequestTimestamp[msg.sender] = block.timestamp;

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        string[] memory args = new string[](4);
        args[0] = vin;
        args[1] = make;
        args[2] = model;
        args[3] = Strings.toString(year);
        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            uint32(300000),
            donId
        );

        latestRequestId = requestId;
        verifications[requestId] = CarDetails(vin, make, model, year, false, block.timestamp);
        emit VerificationRequested(requestId, vin, msg.sender);

        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            emit VerificationFulfilled(requestId, verifications[requestId].vin, false);
        } else {
            bool isVerified = abi.decode(response, (bool));
            verifications[requestId].isVerified = isVerified;
            verifications[requestId].verificationTimestamp = block.timestamp;
            emit VerificationFulfilled(requestId, verifications[requestId].vin, isVerified);
        }
    }

    function getVerificationResult(bytes32 requestId) public view returns (bool isVerified, uint256 timestamp) {
        CarDetails memory carDetails = verifications[requestId];
        if (bytes(carDetails.vin).length == 0) revert VerificationNotFound(requestId);
        if (block.timestamp - carDetails.verificationTimestamp > VERIFICATION_TIMEOUT) {
            revert VerificationTimedOutError(requestId);
        }
        return (carDetails.isVerified, carDetails.verificationTimestamp);
    }

    function getCarDetails(bytes32 requestId) public view returns (CarDetails memory) {
        CarDetails memory carDetails = verifications[requestId];
        if (bytes(carDetails.vin).length == 0) revert VerificationNotFound(requestId);
        return carDetails;
    }

    function checkAndTimeoutVerifications(bytes32[] memory requestIds) public {
        for (uint256 i = 0; i < requestIds.length; i++) {
            CarDetails storage carDetails = verifications[requestIds[i]];
            if (bytes(carDetails.vin).length > 0 && 
                !carDetails.isVerified && 
                block.timestamp - carDetails.verificationTimestamp > VERIFICATION_TIMEOUT) {
                emit VerificationTimedOut(requestIds[i], carDetails.vin);
                delete verifications[requestIds[i]];
            }
        }
    }

    function updateSubscriptionId(uint64 newSubscriptionId) public onlyOwner {
        subscriptionId = newSubscriptionId;
    }

    function updateDonId(bytes32 newDonId) public onlyOwner {
        donId = newDonId;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    receive() external payable {}
}