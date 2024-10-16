// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface ICarVerificationOracle {
    struct CarDetails {
        string vin;
        string make;
        string model;
        uint256 year;
        bool isVerified;
        uint256 verificationTimestamp;
        address currentOwner;
    }

    function getCarDetailsByVIN(string memory vin) external view returns (CarDetails memory);
}

contract VintageCarNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
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
    mapping(string => uint256) private _vinToTokenId;
    mapping(uint256 => ValuationData) private _carValuations;

    ICarVerificationOracle public carVerificationContract;

    event CarMinted(uint256 indexed tokenId, address indexed minter, string vin);
    event CarDetailsUpdated(uint256 indexed tokenId, address indexed updater);
    event ServiceRecordAdded(uint256 indexed tokenId, uint256 date, address indexed serviceProvider);
    event CarValuationUpdated(uint256 indexed tokenId, uint256 valuation);
    event VINUpdated(uint256 indexed tokenId, string oldVIN, string newVIN);
    event TokenURIUpdated(uint256 indexed tokenId, string newURI);
    event CarVerificationContractUpdated(address newContract);

    constructor(string memory name, string memory symbol, address _carVerificationContract) 
        ERC721(name, symbol) 
        Ownable(msg.sender) 
    {
        carVerificationContract = ICarVerificationOracle(_carVerificationContract);
    }

    function mintCar(
        string memory make,
        string memory model,
        uint16 year,
        string memory vin,
        string memory color,
        uint32 mileage,
        string memory condition,
        string memory tokenURI_
    ) public nonReentrant returns (uint256) {
        require(_vinToTokenId[vin] == 0, "VIN already minted");

        ICarVerificationOracle.CarDetails memory verifiedCar = carVerificationContract.getCarDetailsByVIN(vin);
        require(verifiedCar.isVerified, "Car is not verified");
        require(verifiedCar.currentOwner == msg.sender, "Caller is not the verified owner of the car");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        CarDetails storage car = _carDetails[tokenId];
        car.make = make;
        car.model = model;
        car.year = year;
        car.vin = vin;
        car.color = color;
        car.mileage = mileage;
        car.condition = condition;
        car.lastServiceDate = block.timestamp;
        car.ownershipHistory.push(msg.sender);

        _vinToTokenId[vin] = tokenId;

        emit CarMinted(tokenId, msg.sender, vin);
        return tokenId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
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
    ) public {
        require(isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
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
    ) public {
        require(isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
        CarDetails storage car = _carDetails[tokenId];
        car.serviceHistory.push(ServiceRecord({
            date: block.timestamp,
            description: description,
            serviceProvider: serviceProvider
        }));
        car.lastServiceDate = block.timestamp;
        emit ServiceRecordAdded(tokenId, block.timestamp, serviceProvider);
    }

    function getCarDetails(uint256 tokenId) public view returns (CarDetails memory) {
        require(exists(tokenId), "Token does not exist");
        return _carDetails[tokenId];
    }

    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public {
        require(isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
        _setTokenURI(tokenId, newTokenURI);
        emit TokenURIUpdated(tokenId, newTokenURI);
    }

    function setCarValuation(uint256 tokenId, uint256 valuation) external {
        require(exists(tokenId), "Token does not exist");
        require(msg.sender == owner(), "Only owner can set valuation");
        _carValuations[tokenId] = ValuationData({
            lastValuation: valuation,
            valuationTimestamp: block.timestamp
        });
        emit CarValuationUpdated(tokenId, valuation);
    }

    function getCarValuation(uint256 tokenId) public view returns (uint256, uint256) {
        require(exists(tokenId), "Token does not exist");
        ValuationData memory valuation = _carValuations[tokenId];
        return (valuation.lastValuation, valuation.valuationTimestamp);
    }

    function getTokenIdByVIN(string memory vin) public view returns (uint256) {
        uint256 tokenId = _vinToTokenId[vin];
        require(tokenId != 0, "VIN not minted");
        return tokenId;
    }

    function getVINByTokenId(uint256 tokenId) public view returns (string memory) {
        require(exists(tokenId), "Token does not exist");
        return _carDetails[tokenId].vin;
    }

    function getOwnershipHistory(uint256 tokenId) public view returns (address[] memory) {
        require(exists(tokenId), "Token does not exist");
        return _carDetails[tokenId].ownershipHistory;
    }

    function updateVIN(uint256 tokenId, string memory newVIN) public onlyOwner {
        require(exists(tokenId), "Token does not exist");
        require(_vinToTokenId[newVIN] == 0, "New VIN already exists");
        string memory oldVIN = _carDetails[tokenId].vin;
        _carDetails[tokenId].vin = newVIN;
        delete _vinToTokenId[oldVIN];
        _vinToTokenId[newVIN] = tokenId;
        emit VINUpdated(tokenId, oldVIN, newVIN);
    }

    function setCarVerificationContract(address _newContract) public onlyOwner {
        require(_newContract != address(0), "Invalid contract address");
        carVerificationContract = ICarVerificationOracle(_newContract);
        emit CarVerificationContractUpdated(_newContract);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);

        if (from != to && from != address(0) && to != address(0)) {
            CarDetails storage car = _carDetails[tokenId];
            car.ownershipHistory.push(to);
        }

        return previousOwner;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
