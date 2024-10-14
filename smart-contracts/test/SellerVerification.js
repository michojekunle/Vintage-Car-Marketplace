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

  describe("verifySeller", function () {
    it("Should allow owner to verify a seller", async function () {
        const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
        const ipfsUrl = "ipfs://QmX...";
        
        const txResponse = await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
        const txReceipt = await txResponse.wait();
        
        const block = await ethers.provider.getBlock(txReceipt.blockNumber);
        const eventFilter = sellerVerification.filters.SellerVerified(addr1.address);
        const events = await sellerVerification.queryFilter(eventFilter, txReceipt.blockNumber);
        
        expect(events.length).to.equal(1);
        expect(events[0].args[0]).to.equal(addr1.address);
        expect(events[0].args[1]).to.be.closeTo(BigInt(block.timestamp), BigInt(2));
      
        const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
        expect(sellerInfo.isVerified).to.be.true;
        expect(sellerInfo.nameHash).to.equal(nameHash);
        expect(sellerInfo.ipfsUrl).to.equal(ipfsUrl);
      });

    it("Should revert if non-owner tries to verify a seller", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";
      
      await expect(sellerVerification.connect(addr1).verifySeller(addr2.address, nameHash, ipfsUrl))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should revert if trying to verify with invalid inputs", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";

      await expect(sellerVerification.verifySeller(ethers.ZeroAddress, nameHash, ipfsUrl))
        .to.be.revertedWith("Invalid seller address");

      await expect(sellerVerification.verifySeller(addr1.address, ethers.ZeroHash, ipfsUrl))
        .to.be.revertedWith("Invalid name hash");

      await expect(sellerVerification.verifySeller(addr1.address, nameHash, ""))
        .to.be.revertedWith("Invalid IPFS URL");
    });
  });

  describe("revokeSeller", function () {
    it("Should allow owner to revoke a verified seller", async function () {
        const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
        const ipfsUrl = "ipfs://QmX...";
        
        await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
        
        const txResponse = await sellerVerification.revokeSeller(addr1.address);
        const txReceipt = await txResponse.wait();
        
        const block = await ethers.provider.getBlock(txReceipt.blockNumber);
        const eventFilter = sellerVerification.filters.VerificationRevoked(addr1.address);
        const events = await sellerVerification.queryFilter(eventFilter, txReceipt.blockNumber);
        
        expect(events.length).to.equal(1);
        expect(events[0].args[0]).to.equal(addr1.address);
        expect(events[0].args[1]).to.be.closeTo(BigInt(block.timestamp), BigInt(2));
        
        expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.false;
    });

    it("Should revert if non-owner tries to revoke a seller", async function () {
      await expect(sellerVerification.connect(addr1).revokeSeller(addr2.address))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should revert if trying to revoke an unverified seller", async function () {
      await expect(sellerVerification.revokeSeller(addr1.address))
        .to.be.revertedWith("Seller is not verified");
    });
  });

  describe("updateSellerInfo", function () {
    it("Should allow owner to update a verified seller's info", async function () {
        const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
        const ipfsUrl = "ipfs://QmX...";
        await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
      
        const newNameHash = ethers.keccak256(ethers.toUtf8Bytes("Jane Doe"));
        const newIpfsUrl = "ipfs://QmY...";
        
        const txResponse = await sellerVerification.updateSellerInfo(addr1.address, newNameHash, newIpfsUrl);
        const txReceipt = await txResponse.wait();
        
        const block = await ethers.provider.getBlock(txReceipt.blockNumber);
        const eventFilter = sellerVerification.filters.SellerInfoUpdated(addr1.address);
        const events = await sellerVerification.queryFilter(eventFilter, txReceipt.blockNumber);
        
        expect(events.length).to.equal(1);
        expect(events[0].args[0]).to.equal(addr1.address);
        expect(events[0].args[1]).to.be.closeTo(BigInt(block.timestamp), BigInt(2)); // Allow 2 second difference
        
        const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
        expect(sellerInfo.isVerified).to.be.true;
        expect(sellerInfo.nameHash).to.equal(newNameHash);
        expect(sellerInfo.ipfsUrl).to.equal(newIpfsUrl);
    });

    it("Should revert if non-owner tries to update seller info", async function () {
      await expect(sellerVerification.connect(addr1).updateSellerInfo(addr2.address, ethers.ZeroHash, "ipfs://QmZ..."))
        .to.be.revertedWithCustomError(sellerVerification, "OwnableUnauthorizedAccount");
    });

    it("Should revert if trying to update an unverified seller", async function () {
      const newNameHash = ethers.keccak256(ethers.toUtf8Bytes("Jane Doe"));
      const newIpfsUrl = "ipfs://QmY...";
      
      await expect(sellerVerification.updateSellerInfo(addr1.address, newNameHash, newIpfsUrl))
        .to.be.revertedWith("Seller is not verified");
    });

    it("Should revert if trying to update with invalid inputs", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";
      await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);

      await expect(sellerVerification.updateSellerInfo(addr1.address, ethers.ZeroHash, ipfsUrl))
        .to.be.revertedWith("Invalid name hash");

      await expect(sellerVerification.updateSellerInfo(addr1.address, nameHash, ""))
        .to.be.revertedWith("Invalid IPFS URL");
    });
  });

  describe("isSellerVerified", function () {
    it("Should return true for a verified seller", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";
      await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
      
      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.true;
    });

    it("Should return false for an unverified seller", async function () {
      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.false;
    });

    it("Should return false for a revoked seller", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";
      await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
      await sellerVerification.revokeSeller(addr1.address);
      
      expect(await sellerVerification.isSellerVerified(addr1.address)).to.be.false;
    });
  });

  describe("getSellerInfo", function () {
    it("Should return correct info for a verified seller", async function () {
      const nameHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe"));
      const ipfsUrl = "ipfs://QmX...";
      await sellerVerification.verifySeller(addr1.address, nameHash, ipfsUrl);
      
      const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
      expect(sellerInfo.isVerified).to.be.true;
      expect(sellerInfo.nameHash).to.equal(nameHash);
      expect(sellerInfo.ipfsUrl).to.equal(ipfsUrl);
      expect(sellerInfo.verificationTimestamp).to.be.gt(0);
    });

    it("Should return default values for an unverified seller", async function () {
      const sellerInfo = await sellerVerification.getSellerInfo(addr1.address);
      expect(sellerInfo.isVerified).to.be.false;
      expect(sellerInfo.nameHash).to.equal(ethers.ZeroHash);
      expect(sellerInfo.ipfsUrl).to.equal("");
      expect(sellerInfo.verificationTimestamp).to.equal(0);
    });
  });
});