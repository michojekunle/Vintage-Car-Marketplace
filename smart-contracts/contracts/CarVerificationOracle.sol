// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

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

    bytes32 public latestRequestId;
    mapping(bytes32 => CarDetails) public verifications;
    mapping(bytes32 => bytes) private rawResponses;
    uint64 public subscriptionId;
    bytes32 public donId;

    error InvalidVIN(string vin);
    error VerificationNotFound(bytes32 requestId);

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        subscriptionId = 201; 
        donId = 0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;
    }

    function requestCarValidation(
        string memory vin,
        string memory make,
        string memory model,
        uint256 year,
        string memory source
    ) public whenNotPaused returns (bytes32) {
        if (bytes(vin).length != 17) revert InvalidVIN(vin);

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
            rawResponses[requestId] = response;
            emit VerificationFulfilled(requestId, verifications[requestId].vin, true);
        }
    }

    function getRawResponseBytes(bytes32 requestId) public view returns (bytes memory) {
        return rawResponses[requestId];
    }

    function doesRequestExist(bytes32 requestId) public view returns (bool) {
        return rawResponses[requestId].length > 0;
    }

    function isResponseReceived(bytes32 requestId) public view returns (bool) {
        return rawResponses[requestId].length > 0;
    }

    function getCarDetails(bytes32 requestId) public view returns (CarDetails memory) {
        CarDetails memory carDetails = verifications[requestId];
        if (bytes(carDetails.vin).length == 0) revert VerificationNotFound(requestId);
        return carDetails;
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
