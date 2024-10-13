const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarVerificationOracle", function() {
  let carVerificationOracle;
  let owner;
  let user1;
  let user2;
  let router;

  const MOCK_SUBSCRIPTION_ID = 3637n;
  const MOCK_DON_ID = "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000";

  beforeEach(async function() {
    [owner, user1, user2, router] = await ethers.getSigners();

    const CarVerificationOracle = await ethers.getContractFactory("CarVerificationOracle");
    carVerificationOracle = await CarVerificationOracle.deploy(router.address);
  });

  describe("Deployment", function() {
    it("should set the right owner", async function() {
      expect(await carVerificationOracle.owner()).to.equal(owner.address);
    });

    it("should set the correct initial subscription ID", async function() {
      expect(await carVerificationOracle.subscriptionId()).to.equal(MOCK_SUBSCRIPTION_ID);
    });

    it("should set the correct initial DON ID", async function() {
      expect(await carVerificationOracle.donId()).to.equal(MOCK_DON_ID);
    });
  });

  describe("Car Validation Requests", function() {
    const validVin = "1HGCM82633A004352";
    const validMake = "Honda";
    const validModel = "Accord";
    const validYear = 2003;
    const validSource = "return Functions.encodeString(JSON.stringify({success:true,message:'Car details verified successfully'}));";

    it("should revert when VIN length is invalid", async function() {
      const invalidVin = "123";
      await expect(carVerificationOracle.connect(user1).requestCarValidation(
        invalidVin,
        validMake,
        validModel,
        validYear,
        validSource
      )).to.be.revertedWithCustomError(carVerificationOracle, "InvalidVIN")
        .withArgs(invalidVin);
    });

  });

  describe("Administrative Functions", function() {
    it("should allow owner to update subscription ID", async function() {
      const newSubscriptionId = 1234n;
      await carVerificationOracle.connect(owner).updateSubscriptionId(newSubscriptionId);
      expect(await carVerificationOracle.subscriptionId()).to.equal(newSubscriptionId);
    });

    it("should allow owner to pause and unpause the contract", async function() {
      await carVerificationOracle.connect(owner).pause();
      expect(await carVerificationOracle.paused()).to.be.true;

      await carVerificationOracle.connect(owner).unpause();
      expect(await carVerificationOracle.paused()).to.be.false;
    });
  });
});