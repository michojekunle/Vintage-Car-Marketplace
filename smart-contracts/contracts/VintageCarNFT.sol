// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VintageCarNFT is ERC721, Ownable, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    uint256 private _nextTokenId;

    struct ServiceRecord {
        uint256 date;
        string description;
        address serviceProvider;
    }

    struct CarDetails {
        string make;
        string model;
        uint16 year;
        string vin;
        string color;
        uint32 mileage;
        string condition;
        uint256 lastServiceDate;
        address[] ownershipHistory;
        ServiceRecord[] serviceHistory;
    }

    struct ValuationData {
        uint256 lastValuation;
        uint256 valuationTimestamp;
    }

    mapping(uint256 => CarDetails) private _carDetails;
    mapping(uint256 => bool) private _isVerified;
    mapping(string => bool) private _vinExists;
    mapping(uint256 => ValuationData) private _carValuations;

    string private _baseTokenURI;

    event CarMinted(uint256 indexed tokenId, address indexed minter, string vin);
    event CarDetailsUpdated(uint256 indexed tokenId, address indexed updater);
    event ServiceRecordAdded(uint256 indexed tokenId, uint256 date, address indexed serviceProvider);
    event CarVerified(uint256 indexed tokenId, address indexed verifier);
    event CarValuationUpdated(uint256 indexed tokenId, uint256 valuation);
    event VINUpdated(uint256 indexed tokenId, string oldVIN, string newVIN);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _nextTokenId > tokenId;
    }

    function mintCar(
        address to,
        string memory make,
        string memory model,
        uint16 year,
        string memory vin,
        string memory color,
        uint32 mileage,
        string memory condition
    ) public onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(!_vinExists[vin], "VIN already exists");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        CarDetails storage car = _carDetails[tokenId];
        car.make = make;
        car.model = model;
        car.year = year;
        car.vin = vin;
        car.color = color;
        car.mileage = mileage;
        car.condition = condition;
        car.lastServiceDate = block.timestamp;
        car.ownershipHistory.push(to);

        _vinExists[vin] = true;

        emit CarMinted(tokenId, msg.sender, vin);
        return tokenId;
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function updateCarDetails(
        uint256 tokenId,
        string memory color,
        uint32 mileage,
        string memory condition
    ) public whenNotPaused {
        require(isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        
        CarDetails storage car = _carDetails[tokenId];
        car.color = color;
        car.mileage = mileage;
        car.condition = condition;

        emit CarDetailsUpdated(tokenId, msg.sender);
    }

    function addServiceRecord(
        uint256 tokenId,
        string memory description,
        address serviceProvider
    ) public whenNotPaused {
        require(isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        
        ServiceRecord memory newRecord = ServiceRecord({
            date: block.timestamp,
            description: description,
            serviceProvider: serviceProvider
        });

        _carDetails[tokenId].serviceHistory.push(newRecord);
        _carDetails[tokenId].lastServiceDate = block.timestamp;

        emit ServiceRecordAdded(tokenId, block.timestamp, serviceProvider);
    }

    function verifyCar(uint256 tokenId) public onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(!_isVerified[tokenId], "Car already verified");
        _isVerified[tokenId] = true;
        emit CarVerified(tokenId, msg.sender);
    }

    function getCarDetails(uint256 tokenId) public view returns (CarDetails memory) {
        require(exists(tokenId), "Token does not exist");
        return _carDetails[tokenId];
    }

    function isCarVerified(uint256 tokenId) public view returns (bool) {
        require(exists(tokenId), "Token does not exist");
        return _isVerified[tokenId];
    }

    function setBaseTokenURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId)));
    }

    function addMinter(address minter) public onlyOwner {
        grantRole(MINTER_ROLE, minter);
    }

    function removeMinter(address minter) public onlyOwner {
        revokeRole(MINTER_ROLE, minter);
    }

    function addVerifier(address verifier) public onlyOwner {
        grantRole(VERIFIER_ROLE, verifier);
    }

    function removeVerifier(address verifier) public onlyOwner {
        revokeRole(VERIFIER_ROLE, verifier);
    }

    function setCarValuation(uint256 tokenId, uint256 valuation) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(exists(tokenId), "Token does not exist");
        _carValuations[tokenId] = ValuationData(valuation, block.timestamp);
        emit CarValuationUpdated(tokenId, valuation);
    }

    function getCarValuation(uint256 tokenId) public view returns (uint256, uint256) {
        require(exists(tokenId), "Token does not exist");
        ValuationData memory data = _carValuations[tokenId];
        return (data.lastValuation, data.valuationTimestamp);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override whenNotPaused {
        super.transferFrom(from, to, tokenId);
        _carDetails[tokenId].ownershipHistory.push(to);
        emit OwnershipTransferred(tokenId, from, to);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override whenNotPaused {
        super.safeTransferFrom(from, to, tokenId, data);
        _carDetails[tokenId].ownershipHistory.push(to);
        emit OwnershipTransferred(tokenId, from, to);
    }

    function getOwnershipHistory(uint256 tokenId) public view returns (address[] memory) {
        require(exists(tokenId), "Token does not exist");
        return _carDetails[tokenId].ownershipHistory;
    }

    function updateVIN(uint256 tokenId, string memory newVIN) public onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(exists(tokenId), "Token does not exist");
        require(!_vinExists[newVIN], "New VIN already exists");
        string memory oldVIN = _carDetails[tokenId].vin;
        _vinExists[oldVIN] = false;
        _carDetails[tokenId].vin = newVIN;
        _vinExists[newVIN] = true;
        emit VINUpdated(tokenId, oldVIN, newVIN);
    }

    function bulkMintCars(
        address[] memory to,
        string[] memory make,
        string[] memory model,
        uint16[] memory year,
        string[] memory vin,
        string[] memory color,
        uint32[] memory mileage,
        string[] memory condition
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(
            to.length == make.length &&
            make.length == model.length &&
            model.length == year.length &&
            year.length == vin.length &&
            vin.length == color.length &&
            color.length == mileage.length &&
            mileage.length == condition.length,
            "Input arrays must have the same length"
        );

        for (uint i = 0; i < to.length; i++) {
            mintCar(to[i], make[i], model[i], year[i], vin[i], color[i], mileage[i], condition[i]);
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}