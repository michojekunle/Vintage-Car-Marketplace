// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

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

    function getCarDetailsByVIN(string memory vin)
        external
        view
        returns (CarDetails memory);
}

contract VintageCarNFT is
    ERC721URIStorage,
    AccessControl,
    ReentrancyGuard,
    Pausable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 private _nextTokenId;

    mapping(string => uint256) private _vinToTokenId;

    ICarVerificationOracle public carVerificationContract;

    event CarMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string vin,
        bool verified
    );
    event CarVerificationContractUpdated(address newContract);

    constructor(
        string memory name,
        string memory symbol,
        address _carVerificationContract
    ) ERC721(name, symbol) {
        carVerificationContract = ICarVerificationOracle(
            _carVerificationContract
        );

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setCarVerificationContract(address _newContract)
        public
        onlyRole(ADMIN_ROLE)
    {
        require(_newContract != address(0), "Invalid contract address");
        carVerificationContract = ICarVerificationOracle(_newContract);
        emit CarVerificationContractUpdated(_newContract);
    }

    function mintCar(string memory vin, string memory tokenURI)
        public
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require(_vinToTokenId[vin] == 0, "VIN already exists");

        ICarVerificationOracle.CarDetails
            memory verifiedCar = carVerificationContract.getCarDetailsByVIN(
                vin
            );
        require(verifiedCar.isVerified, "Car is not verified");
        require(
            verifiedCar.currentOwner == msg.sender,
            "Minter is not the verified owner of the car"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _vinToTokenId[vin] = tokenId;
        emit CarMinted(tokenId, msg.sender, vin, true);
        return tokenId;
    }

    function getTokenIdByVIN(string memory vin) public view returns (uint256) {
        uint256 tokenId = _vinToTokenId[vin];
        require(tokenId != 0, "VIN not found");
        return tokenId;
    }

    function addAdmin(address newAdmin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, newAdmin);
    }

    function removeAdmin(address admin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, admin);
    }

    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
