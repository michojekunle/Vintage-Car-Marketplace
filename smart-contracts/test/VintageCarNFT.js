const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VintageCarNFT", function () {
  let VintageCarNFT;
  let vintageCarNFT;
  let owner;
  let minter;
  let verifier;
  let user1;
  let user2;

  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

  beforeEach(async function () {
    [owner, minter, verifier, user1, user2] = await ethers.getSigners();

    VintageCarNFT = await ethers.getContractFactory("VintageCarNFT");
    vintageCarNFT = await VintageCarNFT.deploy("VintageCarNFT", "VCNFT");
    await vintageCarNFT.waitForDeployment();

    await vintageCarNFT.grantRole(MINTER_ROLE, minter.address);
    await vintageCarNFT.grantRole(VERIFIER_ROLE, verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await vintageCarNFT.owner()).to.equal(owner.address);
    });

    it("Should grant the default admin role to the owner", async function () {
      expect(await vintageCarNFT.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should set the correct name and symbol", async function () {
      expect(await vintageCarNFT.name()).to.equal("VintageCarNFT");
      expect(await vintageCarNFT.symbol()).to.equal("VCNFT");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint a new car", async function () {
      const tx = await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );

      await expect(tx).to.emit(vintageCarNFT, "CarMinted")
        .withArgs(0, minter.address, "VIN123456");

      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.make).to.equal("Ford");
      expect(carDetails.model).to.equal("Mustang");
      expect(carDetails.year).to.equal(1969);
      expect(carDetails.vin).to.equal("VIN123456");
      expect(carDetails.color).to.equal("Red");
      expect(carDetails.mileage).to.equal(50000);
      expect(carDetails.condition).to.equal("Excellent");
    });

    it("Should not allow non-minter to mint a car", async function () {
      await expect(vintageCarNFT.connect(user1).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      )).to.be.revertedWithCustomError(vintageCarNFT, "AccessControlUnauthorizedAccount");
    });

    it("Should not allow minting with duplicate VIN", async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );

      await expect(vintageCarNFT.connect(minter).mintCar(
        user2.address,
        "Chevrolet",
        "Camaro",
        1970,
        "VIN123456",
        "Blue",
        60000,
        "Good"
      )).to.be.revertedWith("VIN already exists");
    });
  });

  describe("Updating Car Details", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });

    it("Should allow owner to update car details", async function () {
      const tx = await vintageCarNFT.connect(user1).updateCarDetails(0, "Blue", 55000, "Very Good");

      await expect(tx).to.emit(vintageCarNFT, "CarDetailsUpdated")
        .withArgs(0, user1.address);

      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.color).to.equal("Blue");
      expect(carDetails.mileage).to.equal(55000);
      expect(carDetails.condition).to.equal("Very Good");
    });

    it("Should not allow non-owner to update car details", async function () {
      await expect(vintageCarNFT.connect(user2).updateCarDetails(0, "Blue", 55000, "Very Good"))
        .to.be.revertedWith("Not approved or owner");
    });
  });

  describe("Service Records", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should allow owner to add a service record", async function () {
      const tx = await vintageCarNFT.connect(user1).addServiceRecord(
        0,
        "Oil change and tune-up",
        ethers.ZeroAddress
      );
  
      await expect(tx).to.emit(vintageCarNFT, "ServiceRecordAdded")
        .withArgs(0, await ethers.provider.getBlock('latest').then(b => b.timestamp), ethers.ZeroAddress);
  
      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.serviceHistory.length).to.equal(1);
      expect(carDetails.serviceHistory[0].description).to.equal("Oil change and tune-up");
    });
  
    it("Should not allow non-owner to add a service record", async function () {
      await expect(vintageCarNFT.connect(user2).addServiceRecord(
        0,
        "Unauthorized service",
        ethers.ZeroAddress
      )).to.be.revertedWith("Not approved or owner");
    });
  });
  
  describe("Car Verification", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should allow verifier to verify a car", async function () {
      const tx = await vintageCarNFT.connect(verifier).verifyCar(0);
  
      await expect(tx).to.emit(vintageCarNFT, "CarVerified")
        .withArgs(0, verifier.address);
  
      expect(await vintageCarNFT.isCarVerified(0)).to.be.true;
    });
  
    it("Should not allow non-verifier to verify a car", async function () {
      await expect(vintageCarNFT.connect(user1).verifyCar(0))
        .to.be.revertedWithCustomError(vintageCarNFT, "AccessControlUnauthorizedAccount");
    });
  
    it("Should not allow verifying an already verified car", async function () {
      await vintageCarNFT.connect(verifier).verifyCar(0);
      await expect(vintageCarNFT.connect(verifier).verifyCar(0))
        .to.be.revertedWith("Car already verified");
    });
  });
  
  describe("Car Valuation", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should allow verifier to set car valuation", async function () {
      const valuation = ethers.parseEther("50000");
      const tx = await vintageCarNFT.connect(verifier).setCarValuation(0, valuation);
  
      await expect(tx).to.emit(vintageCarNFT, "CarValuationUpdated")
        .withArgs(0, valuation);
  
      const [storedValuation, timestamp] = await vintageCarNFT.getCarValuation(0);
      expect(storedValuation).to.equal(valuation);
      expect(timestamp).to.be.closeTo(
        await ethers.provider.getBlock('latest').then(b => b.timestamp),
        5
      );
    });
  
    it("Should not allow non-verifier to set car valuation", async function () {
      await expect(vintageCarNFT.connect(user1).setCarValuation(0, ethers.parseEther("50000")))
        .to.be.revertedWithCustomError(vintageCarNFT, "AccessControlUnauthorizedAccount");
    });
  });
  
  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should transfer ownership and update history", async function () {
      await vintageCarNFT.connect(user1).transferFrom(user1.address, user2.address, 0);
  
      expect(await vintageCarNFT.ownerOf(0)).to.equal(user2.address);
  
      const ownershipHistory = await vintageCarNFT.getOwnershipHistory(0);
      expect(ownershipHistory.length).to.equal(2);
      expect(ownershipHistory[0]).to.equal(user1.address);
      expect(ownershipHistory[1]).to.equal(user2.address);
    });
  
    it("Should emit OwnershipTransferred event", async function () { 
        await expect(
          vintageCarNFT.connect(user1).transferFrom(user1.address, user2.address, 0)
        )
        .to.emit(vintageCarNFT, "OwnershipTransferred(uint256,address,address)") 
        .withArgs(0, user1.address, user2.address);
    });
  
    it("Should not allow transfer when paused", async function () {
        await vintageCarNFT.connect(owner).pause();
    
        await expect(vintageCarNFT.connect(user1).transferFrom(user1.address, user2.address, 0))
          .to.be.revertedWithCustomError(vintageCarNFT, "EnforcedPause");
    
        await vintageCarNFT.connect(owner).unpause();
      });
  });
  
  describe("VIN Update", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should allow admin to update VIN", async function () {
      const tx = await vintageCarNFT.connect(owner).updateVIN(0, "NEWVIN789");
  
      await expect(tx).to.emit(vintageCarNFT, "VINUpdated")
        .withArgs(0, "VIN123456", "NEWVIN789");
  
      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.vin).to.equal("NEWVIN789");
    });
  
    it("Should not allow non-admin to update VIN", async function () {
      await expect(vintageCarNFT.connect(user1).updateVIN(0, "NEWVIN789"))
        .to.be.revertedWithCustomError(vintageCarNFT, "AccessControlUnauthorizedAccount");
    });
  
    it("Should not allow updating to an existing VIN", async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user2.address,
        "Chevrolet",
        "Camaro",
        1970,
        "VIN789012",
        "Blue",
        60000,
        "Good"
      );
  
      await expect(vintageCarNFT.connect(owner).updateVIN(1, "VIN123456"))
        .to.be.revertedWith("New VIN already exists");
    });
  });

  describe("Bulk Minting", function () {
    it("Should allow minter to bulk mint cars", async function () {
      const to = [user1.address, user2.address];
      const make = ["Ford", "Chevrolet"];
      const model = ["Mustang", "Camaro"];
      const year = [1969, 1970];
      const vin = ["VIN123456", "VIN789012"];
      const color = ["Red", "Blue"];
      const mileage = [50000, 60000];
      const condition = ["Excellent", "Good"];
  
      const tx = await vintageCarNFT.connect(minter).bulkMintCars(
        to, make, model, year, vin, color, mileage, condition
      );
  
      await expect(tx).to.emit(vintageCarNFT, "CarMinted").withArgs(0, minter.address, "VIN123456");
      await expect(tx).to.emit(vintageCarNFT, "CarMinted").withArgs(1, minter.address, "VIN789012");
  
      const car1 = await vintageCarNFT.getCarDetails(0);
      const car2 = await vintageCarNFT.getCarDetails(1);
  
      expect(car1.make).to.equal("Ford");
      expect(car2.make).to.equal("Chevrolet");
      expect(await vintageCarNFT.ownerOf(0)).to.equal(user1.address);
      expect(await vintageCarNFT.ownerOf(1)).to.equal(user2.address);
    });
  
    it("Should revert bulk minting if arrays have different lengths", async function () {
      const to = [user1.address, user2.address];
      const make = ["Ford"];
      const model = ["Mustang", "Camaro"];
      const year = [1969, 1970];
      const vin = ["VIN123456", "VIN789012"];
      const color = ["Red", "Blue"];
      const mileage = [50000, 60000];
      const condition = ["Excellent", "Good"];
  
      await expect(vintageCarNFT.connect(minter).bulkMintCars(
        to, make, model, year, vin, color, mileage, condition
      )).to.be.revertedWith("Input arrays must have the same length");
    });
  });
  
  describe("Edge Cases and Additional Scenarios", function () {
    it("Should allow minting with very high mileage", async function () {
      const highMileage = 999999999;
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        highMileage,
        "Excellent"
      );
  
      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.mileage).to.equal(highMileage);
    });
  
    it("Should handle very long strings for make, model, and condition", async function () {
      const longString = "a".repeat(100);
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        longString,
        longString,
        1969,
        "VIN123456",
        "Red",
        50000,
        longString
      );
  
      const carDetails = await vintageCarNFT.getCarDetails(0);
      expect(carDetails.make).to.equal(longString);
      expect(carDetails.model).to.equal(longString);
      expect(carDetails.condition).to.equal(longString);
    });
  
    it("Should not allow transferring to zero address", async function () {
        await vintageCarNFT.connect(minter).mintCar(
          user1.address,
          "Ford",
          "Mustang",
          1969,
          "VIN123456",
          "Red",
          50000,
          "Excellent"
        );
    
        await expect(vintageCarNFT.connect(user1).transferFrom(
          user1.address,
          ethers.ZeroAddress,
          0
        )).to.be.revertedWithCustomError(vintageCarNFT, "ERC721InvalidReceiver");
    });
  
    it("Should not allow minting to zero address", async function () {
        await expect(vintageCarNFT.connect(minter).mintCar(
          ethers.ZeroAddress,
          "Ford",
          "Mustang",
          1969,
          "VIN123456",
          "Red",
          50000,
          "Excellent"
        )).to.be.revertedWithCustomError(vintageCarNFT, "ERC721InvalidReceiver");
      });
  });
  
  describe("Pausable Functionality", function () {
    beforeEach(async function () {
      await vintageCarNFT.connect(minter).mintCar(
        user1.address,
        "Ford",
        "Mustang",
        1969,
        "VIN123456",
        "Red",
        50000,
        "Excellent"
      );
    });
  
    it("Should allow owner to pause and unpause the contract", async function () {
      await vintageCarNFT.connect(owner).pause();
      expect(await vintageCarNFT.paused()).to.be.true;
  
      await vintageCarNFT.connect(owner).unpause();
      expect(await vintageCarNFT.paused()).to.be.false;
    });
  
    it("Should not allow non-owner to pause or unpause", async function () {
        await expect(vintageCarNFT.connect(user1).pause())
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
    
        await expect(vintageCarNFT.connect(user1).unpause())
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
      });
  
      it("Should prevent minting when paused", async function () {
        await vintageCarNFT.connect(owner).pause();
    
        await expect(vintageCarNFT.connect(minter).mintCar(
          user2.address,
          "Chevrolet",
          "Camaro",
          1970,
          "VIN789012",
          "Blue",
          60000,
          "Good"
        )).to.be.revertedWithCustomError(vintageCarNFT, "EnforcedPause");
    
        await vintageCarNFT.connect(owner).unpause();
    });
  
    it("Should prevent updating car details when paused", async function () {
        await vintageCarNFT.connect(owner).pause();
    
        await expect(vintageCarNFT.connect(user1).updateCarDetails(0, "Blue", 55000, "Very Good"))
          .to.be.revertedWithCustomError(vintageCarNFT, "EnforcedPause");
    
        await vintageCarNFT.connect(owner).unpause();
    });
  });
  
  describe("Role Management", function () {
    it("Should allow owner to add and remove minter", async function () {
      await vintageCarNFT.connect(owner).addMinter(user2.address);
      expect(await vintageCarNFT.hasRole(MINTER_ROLE, user2.address)).to.be.true;
  
      await vintageCarNFT.connect(owner).removeMinter(user2.address);
      expect(await vintageCarNFT.hasRole(MINTER_ROLE, user2.address)).to.be.false;
    });
  
    it("Should allow owner to add and remove verifier", async function () {
      await vintageCarNFT.connect(owner).addVerifier(user2.address);
      expect(await vintageCarNFT.hasRole(VERIFIER_ROLE, user2.address)).to.be.true;
  
      await vintageCarNFT.connect(owner).removeVerifier(user2.address);
      expect(await vintageCarNFT.hasRole(VERIFIER_ROLE, user2.address)).to.be.false;
    });
  
    it("Should not allow non-owner to add or remove roles", async function () {
        await expect(vintageCarNFT.connect(user1).addMinter(user2.address))
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
    
        await expect(vintageCarNFT.connect(user1).removeMinter(minter.address))
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
    
        await expect(vintageCarNFT.connect(user1).addVerifier(user2.address))
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
    
        await expect(vintageCarNFT.connect(user1).removeVerifier(verifier.address))
          .to.be.revertedWithCustomError(vintageCarNFT, "OwnableUnauthorizedAccount");
      });
  });
});