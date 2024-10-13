const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VintageCarNFT Fuzz Testing", function () {
  let VintageCarNFT;
  let vintageCarNFT;
  let owner;
  let minter;
  let verifier;
  let user1;
  let user2;

  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));

  beforeEach(async function () {
    [owner, minter, verifier, user1, user2] = await ethers.getSigners();

    VintageCarNFT = await ethers.getContractFactory("VintageCarNFT");
    vintageCarNFT = await VintageCarNFT.deploy("VintageCarNFT", "VCNFT");
    await vintageCarNFT.waitForDeployment();

    await vintageCarNFT.grantRole(MINTER_ROLE, minter.address);
    await vintageCarNFT.grantRole(VERIFIER_ROLE, verifier.address);
  });

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomString(length) {
    return ethers.hexlify(ethers.randomBytes(length)).slice(2);
  }

  it("Should mint cars with random valid inputs", async function () {
    await expect(
      vintageCarNFT.connect(minter).mintCar(
        user1.address,
        getRandomString(10),
        getRandomString(10),
        getRandomInt(1900, 2024),
        getRandomString(17),
        getRandomString(10),
        getRandomInt(0, 1000000),
        getRandomString(10)
      )
    ).to.not.be.reverted;
  });

  it("Should update car details with random valid inputs", async function () {
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

    await expect(
      vintageCarNFT.connect(user1).updateCarDetails(
        0,
        getRandomString(10),
        getRandomInt(0, 1000000),
        getRandomString(10)
      )
    ).to.not.be.reverted;
  });

  it("Should add service records with random valid inputs", async function () {
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

    await expect(
      vintageCarNFT.connect(user1).addServiceRecord(
        0,
        getRandomString(50),
        ethers.Wallet.createRandom().address
      )
    ).to.not.be.reverted;
  });

  it("Should set car valuation with random valid inputs", async function () {
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

    await expect(
      vintageCarNFT.connect(verifier).setCarValuation(
        0,
        ethers.parseEther(getRandomInt(1, 1000000).toString())
      )
    ).to.not.be.reverted;
  });

  it("Should bulk mint cars with random valid inputs", async function () {
    const count = 5;
    const to = Array(count).fill(user1.address);
    const make = Array(count).fill().map(() => getRandomString(10));
    const model = Array(count).fill().map(() => getRandomString(10));
    const year = Array(count).fill().map(() => getRandomInt(1900, 2024));
    const vin = Array(count).fill().map(() => getRandomString(17));
    const color = Array(count).fill().map(() => getRandomString(10));
    const mileage = Array(count).fill().map(() => getRandomInt(0, 1000000));
    const condition = Array(count).fill().map(() => getRandomString(10));

    await expect(
      vintageCarNFT.connect(minter).bulkMintCars(
        to, make, model, year, vin, color, mileage, condition
      )
    ).to.not.be.reverted;
  });

  it("Should handle transfers between random addresses", async function () {
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

    const randomAddress = ethers.Wallet.createRandom().address;

    await expect(
      vintageCarNFT.connect(user1).transferFrom(user1.address, randomAddress, 0)
    ).to.not.be.reverted;
  });

  it("Should update VIN with random valid inputs", async function () {
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

    await expect(
      vintageCarNFT.connect(owner).updateVIN(0, getRandomString(17))
    ).to.not.be.reverted;
  });
});