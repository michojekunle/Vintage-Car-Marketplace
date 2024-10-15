// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CarVerificationOracle is FunctionsClient, ConfirmedOwner, Pausable, AccessControl {
    using FunctionsRequest for FunctionsRequest.Request;

    struct CarDetails {
        string vin;
        string make;
        string model;
        uint256 year;
        bool isVerified;
        uint256 verificationTimestamp;
        address currentOwner;
    }

    event VerificationRequested(bytes32 indexed requestId, string indexed vin, address indexed requester);
    event VerificationFulfilled(bytes32 indexed requestId, string indexed vin, bool isVerified);
    event OwnershipTransferred(string indexed vin, address indexed previousOwner, address indexed newOwner);

    bytes32 public latestRequestId;
    mapping(bytes32 => CarDetails) public verifications;
    mapping(bytes32 => bytes) private rawResponses;
    mapping(string => bytes32) public vinToRequestId;
    mapping(address => string[]) public ownerToCars;

    uint64 public subscriptionId;
    bytes32 public donId;

    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    error InvalidVIN(string vin);
    error VerificationNotFound(bytes32 requestId);
    error UnauthorizedAccess();
    error CarNotOwnedByUser(string vin, address user);

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        subscriptionId = 201;
        donId = 0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VERIFIER_ROLE, msg.sender);
    }

    function requestCarValidation(
        string memory vin,
        string memory make,
        string memory model,
        uint256 year,
        string memory source
    ) public whenNotPaused onlyRole(VERIFIER_ROLE) returns (bytes32) {
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
        verifications[requestId] = CarDetails(vin, make, model, year, false, block.timestamp, msg.sender);
        vinToRequestId[vin] = requestId;
        ownerToCars[msg.sender].push(vin);
        emit VerificationRequested(requestId, vin, msg.sender);

        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        CarDetails storage carDetails = verifications[requestId];
        if (err.length > 0) {
            emit VerificationFulfilled(requestId, carDetails.vin, false);
        } else {
            rawResponses[requestId] = response;
            carDetails.isVerified = true;
            emit VerificationFulfilled(requestId, carDetails.vin, true);
        }
    }

    function getCarDetailsByVIN(string memory vin) public view returns (CarDetails memory) {
        bytes32 requestId = vinToRequestId[vin];
        if (requestId == bytes32(0)) revert VerificationNotFound(requestId);
        return verifications[requestId];
    }

    function isCarVerified(string memory vin) public view returns (bool) {
        bytes32 requestId = vinToRequestId[vin];
        if (requestId == bytes32(0)) return false;
        return verifications[requestId].isVerified;
    }

    function getCarDetailsByRequestId(bytes32 requestId) public view returns (CarDetails memory) {
        CarDetails memory carDetails = verifications[requestId];
        if (bytes(carDetails.vin).length == 0) revert VerificationNotFound(requestId);
        return carDetails;
    }

    function transferOwnership(string memory vin, address newOwner) public {
        bytes32 requestId = vinToRequestId[vin];
        CarDetails storage carDetails = verifications[requestId];
        
        if (carDetails.currentOwner != msg.sender) revert CarNotOwnedByUser(vin, msg.sender);

        address previousOwner = carDetails.currentOwner;
        carDetails.currentOwner = newOwner;

        removeVinFromOwner(previousOwner, vin);

        ownerToCars[newOwner].push(vin);

        emit OwnershipTransferred(vin, previousOwner, newOwner);
    }

    function removeVinFromOwner(address owner, string memory vin) internal {
        string[] storage cars = ownerToCars[owner];
        for (uint i = 0; i < cars.length; i++) {
            if (keccak256(bytes(cars[i])) == keccak256(bytes(vin))) {
                cars[i] = cars[cars.length - 1];
                cars.pop();
                break;
            }
        }
    }

    function getOwnerCars(address owner) public view returns (string[] memory) {
        return ownerToCars[owner];
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
