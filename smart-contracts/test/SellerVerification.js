const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SellerVerification", function () {
  let SellerVerification;
  let sellerVerification;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    SellerVerification = await ethers.getContractFactory("SellerVerification");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    sellerVerification = await SellerVerification.deploy();
    await sellerVerification.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sellerVerification.owner()).to.equal(owner.address);
    });
  });

  describe("setEncryptedDatabaseIpfsUrl", function () {
    const validUrl = "ipfs://QmTest";

    it("Should set the encrypted database IPFS URL", async function () {
      await expect(sellerVerification.setEncryptedDatabaseIpfsUrl(validUrl))
        .to.emit(sellerVerification, "EncryptedDatabaseIpfsUrlUpdated");

      expect(await sellerVerification.getEncryptedDatabaseIpfsUrl()).to.equal(validUrl);
    });

    it("Should fail if not called by owner", async function () {
      await expect(sellerVerification.connect(addr1).setEncryptedDatabaseIpfsUrl(validUrl))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should fail with empty URL", async function () {
      await expect(sellerVerification.setEncryptedDatabaseIpfsUrl(""))
        .to.be.revertedWith("Invalid IPFS URL");
    });
  });

  describe("getEncryptedDatabaseIpfsUrl", function () {
    const validUrl = "ipfs://QmTest";

    beforeEach(async function () {
      await sellerVerification.setEncryptedDatabaseIpfsUrl(validUrl);
    });

    it("Should return the correct URL when called by owner", async function () {
      expect(await sellerVerification.getEncryptedDatabaseIpfsUrl()).to.equal(validUrl);
    });

    it("Should fail if not called by owner", async function () {
      await expect(sellerVerification.connect(addr1).getEncryptedDatabaseIpfsUrl())
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });
  });

  describe("verifySeller", function () {
    const validIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("123456789"));

    it("Should verify a seller", async function () {
      const tx = await sellerVerification.verifySeller(addr1.address, validIdNumberHash);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.eventName === 'SellerVerified');
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(addr1.address);
      expect(event.args[1]).to.be.closeTo(await ethers.provider.getBlock("latest").then(b => b.timestamp), 2);

      const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
      expect(sellerInfo.idNumberHash).to.equal(validIdNumberHash);
      expect(sellerInfo.isVerified).to.be.true;
      expect(sellerInfo.verificationTimestamp).to.be.gt(0);
    });

    it("Should fail if not called by owner", async function () {
      await expect(sellerVerification.connect(addr1).verifySeller(addr2.address, validIdNumberHash))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should fail with invalid inputs", async function () {
      await expect(sellerVerification.verifySeller(ethers.ZeroAddress, validIdNumberHash))
        .to.be.revertedWith("Invalid seller address");

      await expect(sellerVerification.verifySeller(addr1.address, ethers.ZeroHash))
        .to.be.revertedWith("Invalid ID number hash");
    });
  });

  describe("revokeSeller", function () {
    const validIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("123456789"));

    beforeEach(async function () {
      await sellerVerification.verifySeller(addr1.address, validIdNumberHash);
    });

    it("Should revoke a verified seller", async function () {
      const tx = await sellerVerification.revokeSeller(addr1.address);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.eventName === 'VerificationRevoked');
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(addr1.address);
      expect(event.args[1]).to.be.closeTo(await ethers.provider.getBlock("latest").then(b => b.timestamp), 2);

      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.false;
    });

    it("Should fail if not called by owner", async function () {
      await expect(sellerVerification.connect(addr1).revokeSeller(addr2.address))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should fail if seller is not verified", async function () {
      await expect(sellerVerification.revokeSeller(addr2.address))
        .to.be.revertedWith("Seller is not verified");
    });
  });

  describe("updateSellerInfo", function () {
    const validIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("123456789"));
    const newValidIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("987654321"));

    beforeEach(async function () {
      await sellerVerification.verifySeller(addr1.address, validIdNumberHash);
    });

    it("Should update seller info", async function () {
      const tx = await sellerVerification.updateSellerInfo(addr1.address, newValidIdNumberHash);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.eventName === 'SellerInfoUpdated');
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(addr1.address);
      expect(event.args[1]).to.be.closeTo(await ethers.provider.getBlock("latest").then(b => b.timestamp), 2);

      const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
      expect(sellerInfo.idNumberHash).to.equal(newValidIdNumberHash);
      expect(sellerInfo.isVerified).to.be.true;
    });

    it("Should fail if not called by owner", async function () {
      await expect(sellerVerification.connect(addr1).updateSellerInfo(addr1.address, newValidIdNumberHash))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should fail if seller is not verified", async function () {
      await expect(sellerVerification.updateSellerInfo(addr2.address, newValidIdNumberHash))
        .to.be.revertedWith("Seller is not verified");
    });

    it("Should fail with invalid inputs", async function () {
      await expect(sellerVerification.updateSellerInfo(addr1.address, ethers.ZeroHash))
        .to.be.revertedWith("Invalid ID number hash");
    });
  });

  describe("isSellerVerified", function () {
    const validIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("123456789"));

    it("Should return true for verified sellers", async function () {
      await sellerVerification.verifySeller(addr1.address, validIdNumberHash);
      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.true;
    });

    it("Should return false for unverified sellers", async function () {
      expect(await sellerVerification.isSellerVerified(addr2.address)).to.be.false;
    });

    it("Should return false for revoked sellers", async function () {
      await sellerVerification.verifySeller(addr1.address, validIdNumberHash);
      await sellerVerification.revokeSeller(addr1.address);
      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.false;
    });
  });

  describe("getSellerInfo", function () {
    const validIdNumberHash = ethers.keccak256(ethers.toUtf8Bytes("123456789"));

    it("Should return correct info for verified sellers", async function () {
      await sellerVerification.verifySeller(addr1.address, validIdNumberHash);

      const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
      expect(sellerInfo.idNumberHash).to.equal(validIdNumberHash);
      expect(sellerInfo.isVerified).to.be.true;
      expect(sellerInfo.verificationTimestamp).to.be.gt(0);
    });

    it("Should return default values for unverified sellers", async function () {
      const sellerInfo = await sellerVerification.getSellerInfo(addr2.address);
      expect(sellerInfo.idNumberHash).to.equal(ethers.ZeroHash);
      expect(sellerInfo.isVerified).to.be.false;
      expect(sellerInfo.verificationTimestamp).to.equal(0);
    });
  });
});
