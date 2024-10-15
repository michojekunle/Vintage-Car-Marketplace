// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMechanicVerification {
    function balanceOf(address account) external view returns (uint256);
}

interface ICarNFT {
    function updateServiceHistory(uint256 tokenId, string memory serviceDetails) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

/// @title MechanicService
/// @notice A contract for managing mechanic service requests, payments, and disputes
/// @dev This contract interacts with MechanicVerification and CarNFT contracts
contract MechanicService is Ownable, ReentrancyGuard {
    IMechanicVerification public mechanicVerification;
    ICarNFT public carNFT;

    enum ServiceStatus { Requested, InProgress, Completed, Disputed, Resolved }

    struct ServiceRequest {
        uint256 carTokenId;
        address payable mechanic;
        uint256 price;
        uint256 downPayment;
        ServiceStatus status;
        uint256 requestTime;
        uint256 completionTime;
    }

    mapping(uint256 => ServiceRequest) public serviceRequests;
    uint256 public nextServiceId;

    uint256 public constant DISPUTE_PERIOD = 7 days;
    uint256 public constant DISPUTE_FEE_PERCENTAGE = 5; // 5% of the service price

    event ServiceRequested(uint256 indexed serviceId, uint256 indexed carTokenId, address indexed mechanic, uint256 price);
    event ServiceStarted(uint256 indexed serviceId);
    event ServiceCompleted(uint256 indexed serviceId);
    event DisputeRaised(uint256 indexed serviceId);
    event DisputeResolved(uint256 indexed serviceId, bool infavorOfMechanic);

    constructor(address _mechanicVerification, address _carNFT) Ownable(msg.sender) {
        mechanicVerification = IMechanicVerification(_mechanicVerification);
        carNFT = ICarNFT(_carNFT);
    }

    /// @notice Request a mechanic service
    /// @param _carTokenId The token ID of the car NFT
    /// @param _mechanic The address of the chosen mechanic
    /// @param _price The agreed price for the service
    function requestService(uint256 _carTokenId, address payable _mechanic, uint256 _price) external payable {
        require(carNFT.ownerOf(_carTokenId) == msg.sender, "Not the car owner");
        require(mechanicVerification.balanceOf(_mechanic) > 0, "Mechanic not verified");
        require(msg.value >= _price / 2, "Insufficient down payment");

        uint256 serviceId = nextServiceId++;
        serviceRequests[serviceId] = ServiceRequest({
            carTokenId: _carTokenId,
            mechanic: _mechanic,
            price: _price,
            downPayment: msg.value,
            status: ServiceStatus.Requested,
            requestTime: block.timestamp,
            completionTime: 0
        });

        emit ServiceRequested(serviceId, _carTokenId, _mechanic, _price);
    }

    /// @notice Start the service (only callable by the assigned mechanic)
    /// @param _serviceId The ID of the service request
    function startService(uint256 _serviceId) external {
        ServiceRequest storage request = serviceRequests[_serviceId];
        require(msg.sender == request.mechanic, "Not the assigned mechanic");
        require(request.status == ServiceStatus.Requested, "Invalid service status");

        request.status = ServiceStatus.InProgress;
        emit ServiceStarted(_serviceId);
    }

    /// @notice Complete the service (only callable by the assigned mechanic)
    /// @param _serviceId The ID of the service request
    /// @param _serviceDetails Details of the service performed
    function completeService(uint256 _serviceId, string memory _serviceDetails) external {
        ServiceRequest storage request = serviceRequests[_serviceId];
        require(msg.sender == request.mechanic, "Not the assigned mechanic");
        require(request.status == ServiceStatus.InProgress, "Service not in progress");

        request.status = ServiceStatus.Completed;
        request.completionTime = block.timestamp;

        carNFT.updateServiceHistory(request.carTokenId, _serviceDetails);

        emit ServiceCompleted(_serviceId);
    }

    /// @notice Confirm service completion and release payment (only callable by the car owner)
    /// @param _serviceId The ID of the service request
    function confirmServiceAndPay(uint256 _serviceId) external payable nonReentrant {
        ServiceRequest storage request = serviceRequests[_serviceId];
        require(carNFT.ownerOf(request.carTokenId) == msg.sender, "Not the car owner");
        require(request.status == ServiceStatus.Completed, "Service not completed");
        require(msg.value == request.price - request.downPayment, "Incorrect payment amount");

        uint256 totalPayment = request.downPayment + msg.value;
        request.mechanic.transfer(totalPayment);
    }

    /// @notice Raise a dispute (only callable by the car owner within the dispute period)
    /// @param _serviceId The ID of the service request
    function raiseDispute(uint256 _serviceId) external payable {
        ServiceRequest storage request = serviceRequests[_serviceId];
        require(carNFT.ownerOf(request.carTokenId) == msg.sender, "Not the car owner");
        require(request.status == ServiceStatus.Completed, "Service not completed");
        require(block.timestamp <= request.completionTime + DISPUTE_PERIOD, "Dispute period expired");
        require(msg.value == (request.price * DISPUTE_FEE_PERCENTAGE) / 100, "Incorrect dispute fee");

        request.status = ServiceStatus.Disputed;
        emit DisputeRaised(_serviceId);
    }

    /// @notice Resolve a dispute (only callable by the contract owner)
    /// @param _serviceId The ID of the service request
    /// @param _inFavorOfMechanic True if the dispute is resolved in favor of the mechanic, false otherwise
    function resolveDispute(uint256 _serviceId, bool _inFavorOfMechanic) external onlyOwner nonReentrant {
        ServiceRequest storage request = serviceRequests[_serviceId];
        require(request.status == ServiceStatus.Disputed, "No active dispute");

        request.status = ServiceStatus.Resolved;

        uint256 totalPayment = request.downPayment + (request.price - request.downPayment);
        uint256 disputeFee = (request.price * DISPUTE_FEE_PERCENTAGE) / 100;

        if (_inFavorOfMechanic) {
            request.mechanic.transfer(totalPayment);
            payable(owner()).transfer(disputeFee); // Dispute fee goes to contract owner
        } else {
            payable(carNFT.ownerOf(request.carTokenId)).transfer(totalPayment + disputeFee);
        }

        emit DisputeResolved(_serviceId, _inFavorOfMechanic);
    }

    /// @notice Get details of a service request
    /// @param _serviceId The ID of the service request
    /// @return The ServiceRequest struct
    function getServiceRequest(uint256 _serviceId) external view returns (ServiceRequest memory) {
        return serviceRequests[_serviceId];
    }
}