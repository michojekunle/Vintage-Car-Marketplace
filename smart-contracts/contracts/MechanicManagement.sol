// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IMechanicVerification {
    function balanceOf(address account) external view returns (uint256);
}

interface IMechanicService {
    function requestService(uint256 _carTokenId, address payable _mechanic, uint256 _price) external payable;
}

/// @title MechanicManagement
/// @notice A comprehensive contract for managing mechanics, their services, and requests
/// @dev This contract integrates with MechanicVerification and MechanicService contracts
contract MechanicManagement is AccessControl, ReentrancyGuard {
    using Address for address;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MECHANIC_ROLE = keccak256("MECHANIC_ROLE");

    IMechanicVerification public mechanicVerification;
    IMechanicService public mechanicService;

    struct MechanicProfile {
        string name;
        string specialization;
        uint256 basePrice;
        bool isActive;
        uint256 totalServicesCompleted;
        uint256 totalEarnings;
    }

    struct ServiceRequest {
        uint256 requestId;
        uint256 carTokenId;
        address carOwner;
        uint256 requestedPrice;
        string serviceDescription;
        bool isAccepted;
        bool isCompleted;
    }

    mapping(address => MechanicProfile) public mechanicProfiles;
    mapping(address => uint256) private mechanicRequestCounters;
    mapping(address => mapping(uint256 => ServiceRequest)) public mechanicServiceRequests;

    event MechanicRegistered(address indexed mechanic, string name, string specialization);
    event MechanicUpdated(address indexed mechanic, string name, string specialization, uint256 basePrice);
    event ServiceRequestCreated(address indexed mechanic, address indexed carOwner, uint256 requestId, uint256 carTokenId);
    event ServiceRequestAccepted(address indexed mechanic, uint256 requestId);
    event ServiceRequestCompleted(address indexed mechanic, uint256 requestId, uint256 earnings);

    constructor(address _mechanicVerification, address _mechanicService) {
        mechanicVerification = IMechanicVerification(_mechanicVerification);
        mechanicService = IMechanicService(_mechanicService);

         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
         _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Register a new mechanic
    /// @param _name Name of the mechanic
    /// @param _specialization Specialization of the mechanic
    /// @param _basePrice Base price for the mechanic's services
    function registerMechanic(string memory _name, string memory _specialization, uint256 _basePrice) external {
        require(mechanicVerification.balanceOf(msg.sender) > 0, "Not verified");
        require(!mechanicProfiles[msg.sender].isActive, "Already registered");

        mechanicProfiles[msg.sender] = MechanicProfile({
            name: _name,
            specialization: _specialization,
            basePrice: _basePrice,
            isActive: true,
            totalServicesCompleted: 0,
            totalEarnings: 0
        });

        _grantRole(MECHANIC_ROLE, msg.sender);

        emit MechanicRegistered(msg.sender, _name, _specialization);
    }

    /// @notice Update a mechanic's profile
    /// @param _name New name of the mechanic
    /// @param _specialization New specialization of the mechanic
    /// @param _basePrice New base price for the mechanic's services
    function updateMechanicProfile(string memory _name, string memory _specialization, uint256 _basePrice) external {
        require(hasRole(MECHANIC_ROLE, msg.sender), "Not a registered mechanic");

        MechanicProfile storage profile = mechanicProfiles[msg.sender];
        profile.name = _name;
        profile.specialization = _specialization;
        profile.basePrice = _basePrice;

        emit MechanicUpdated(msg.sender, _name, _specialization, _basePrice);
    }

    /// @notice Deactivate a mechanic's profile
    function deactivateMechanic() external {
        require(hasRole(MECHANIC_ROLE, msg.sender), "Not a registered mechanic");
        mechanicProfiles[msg.sender].isActive = false;
    }

    /// @notice Reactivate a mechanic's profile
    function reactivateMechanic() external {
        require(hasRole(MECHANIC_ROLE, msg.sender), "Not a registered mechanic");
        require(mechanicVerification.balanceOf(msg.sender) > 0, "Not verified");
        mechanicProfiles[msg.sender].isActive = true;
    }

    /// @notice Create a service request for a mechanic
    /// @param _mechanic Address of the mechanic
    /// @param _carTokenId Token ID of the car NFT
    /// @param _requestedPrice Requested price for the service
    /// @param _serviceDescription Description of the service needed
    function createServiceRequest(address _mechanic, uint256 _carTokenId, uint256 _requestedPrice, string memory _serviceDescription) external {
        require(mechanicProfiles[_mechanic].isActive, "Mechanic not active");

        uint256 requestId = mechanicRequestCounters[_mechanic];
        mechanicRequestCounters[_mechanic]++;

        mechanicServiceRequests[_mechanic][requestId] = ServiceRequest({
            requestId: requestId,
            carTokenId: _carTokenId,
            carOwner: msg.sender,
            requestedPrice: _requestedPrice,
            serviceDescription: _serviceDescription,
            isAccepted: false,
            isCompleted: false
        });

        emit ServiceRequestCreated(_mechanic, msg.sender, requestId, _carTokenId);
    }

    /// @notice Accept a service request
    /// @param _requestId ID of the service request
    function acceptServiceRequest(uint256 _requestId) external {
        require(hasRole(MECHANIC_ROLE, msg.sender), "Not a registered mechanic");
        ServiceRequest storage request = mechanicServiceRequests[msg.sender][_requestId];
        require(!request.isAccepted, "Request already accepted");

        request.isAccepted = true;

        emit ServiceRequestAccepted(msg.sender, _requestId);

        // Initiate the service request in the MechanicService contract
        mechanicService.requestService(request.carTokenId, payable(msg.sender), request.requestedPrice);
    }

    /// @notice Mark a service request as completed
    /// @param _requestId ID of the service request
    /// @param _earnings Actual earnings from the service
    function completeServiceRequest(uint256 _requestId, uint256 _earnings) external {
        require(hasRole(MECHANIC_ROLE, msg.sender), "Not a registered mechanic");
        ServiceRequest storage request = mechanicServiceRequests[msg.sender][_requestId];
        require(request.isAccepted && !request.isCompleted, "Invalid request state");

        request.isCompleted = true;
        MechanicProfile storage profile = mechanicProfiles[msg.sender];
        profile.totalServicesCompleted++;
        profile.totalEarnings += _earnings;

        emit ServiceRequestCompleted(msg.sender, _requestId, _earnings);
    }

    /// @notice Get a mechanic's profile
    /// @param _mechanic Address of the mechanic
    /// @return MechanicProfile struct containing the mechanic's information
    function getMechanicProfile(address _mechanic) external view returns (MechanicProfile memory) {
        return mechanicProfiles[_mechanic];
    }

    /// @notice Get a specific service request for a mechanic
    /// @param _mechanic Address of the mechanic
    /// @param _requestId ID of the service request
    /// @return ServiceRequest struct containing the request information
    function getServiceRequest(address _mechanic, uint256 _requestId) external view returns (ServiceRequest memory) {
        return mechanicServiceRequests[_mechanic][_requestId];
    }

    /// @notice Get the total number of service requests for a mechanic
    /// @param _mechanic Address of the mechanic
    /// @return Total number of service requests
    function getTotalServiceRequests(address _mechanic) external view returns (uint256) {
        return mechanicRequestCounters[_mechanic];
    }

    /// @notice Administrative function to remove a mechanic
    /// @param _mechanic Address of the mechanic to remove
    function removeMechanic(address _mechanic) external onlyRole(ADMIN_ROLE) {
        require(hasRole(MECHANIC_ROLE, _mechanic), "Not a registered mechanic");
        _revokeRole(MECHANIC_ROLE, _mechanic);
        delete mechanicProfiles[_mechanic];
    }
}
