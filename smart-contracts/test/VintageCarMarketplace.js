const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VintageCarMarketplace", function () {
  let VintageCarMarketplace, marketplace;
  let MockVintageCarNFT, mockNFT;
  let MockCarVerificationOracle, mockOracle;
  let MockAuction, mockAuction;
  let owner, seller, buyer, feeRecipient;
  const INITIAL_FEE_PERCENTAGE = 250;

  beforeEach(async function () {
    [owner, seller, buyer, feeRecipient] = await ethers.getSigners();

    MockVintageCarNFT = await ethers.getContractFactory("MockVintageCarNFT");
    mockNFT = await MockVintageCarNFT.deploy();

    MockCarVerificationOracle = await ethers.getContractFactory("MockCarVerificationOracle");
    mockOracle = await MockCarVerificationOracle.deploy();

    MockAuction = await ethers.getContractFactory("MockAuction");
    mockAuction = await MockAuction.deploy();

    VintageCarMarketplace = await ethers.getContractFactory("VintageCarMarketplace");
    marketplace = await VintageCarMarketplace.deploy(
      await mockNFT.getAddress(),
      await mockOracle.getAddress(),
      INITIAL_FEE_PERCENTAGE,
      await feeRecipient.getAddress()
    );

    await mockNFT.mint(seller.address, 1);
    await mockNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);

    await mockOracle.setCarDetails("VIN123", true, seller.address);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await marketplace.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the correct initial fee percentage", async function () {
      expect(await marketplace.marketplaceFeePercentage()).to.equal(INITIAL_FEE_PERCENTAGE);
    });

    it("Should set the correct fee recipient", async function () {
      expect(await marketplace.feeRecipient()).to.equal(await feeRecipient.getAddress());
    });
  });

  describe("Creating Listings", function () {
    it("Should create a fixed price listing", async function () {
      await expect(marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1")))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, await seller.getAddress(), ethers.parseEther("1"), 0);

      const listing = await marketplace.getListing(1);
      expect(listing.isActive).to.be.true;
      expect(listing.seller).to.equal(await seller.getAddress());
      expect(listing.price).to.equal(ethers.parseEther("1"));
      expect(listing.listingType).to.equal(0);
    });

    it("Should create an auction listing", async function () {
      await marketplace.updateContractAddresses(
        await mockNFT.getAddress(),
        await mockOracle.getAddress(),
        await mockAuction.getAddress()
      );

      await expect(marketplace.connect(seller).createAuctionListing(1, ethers.parseEther("1"), 86400))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, await seller.getAddress(), ethers.parseEther("1"), 1)
        .and.to.emit(marketplace, "AuctionCreated");

      const listing = await marketplace.getListing(1);
      expect(listing.isActive).to.be.true;
      expect(listing.seller).to.equal(await seller.getAddress());
      expect(listing.price).to.equal(ethers.parseEther("1"));
      expect(listing.listingType).to.equal(1);
    });

    it("Should fail to create a listing with zero price", async function () {
      await expect(marketplace.connect(seller).createFixedPriceListing(1, 0))
        .to.be.revertedWith("Price must be greater than zero");
    });

    it("Should fail to create a listing for an unowned token", async function () {
      await expect(marketplace.connect(buyer).createFixedPriceListing(1, ethers.parseEther("1")))
        .to.be.revertedWith("Not owner or approved");
    });

    it("Should fail to create a listing for an unverified car", async function () {
      await mockOracle.setCarDetails("VIN123", false, seller.address);
      await expect(marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1")))
        .to.be.revertedWith("Car is not verified");
    });
  });

  describe("Listing Management", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
    });

    it("Should update listing price", async function () {
      await expect(marketplace.connect(seller).updateListing(1, ethers.parseEther("1.5")))
        .to.emit(marketplace, "ListingUpdated")
        .withArgs(1, ethers.parseEther("1.5"));

      const listing = await marketplace.getListing(1);
      expect(listing.price).to.equal(ethers.parseEther("1.5"));
    });

    it("Should fail to update listing by non-seller", async function () {
      await expect(marketplace.connect(buyer).updateListing(1, ethers.parseEther("1.5")))
        .to.be.revertedWith("Not the seller");
    });

    it("Should cancel listing", async function () {
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1);

      const listing = await marketplace.getListing(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should fail to cancel listing by non-seller", async function () {
      await expect(marketplace.connect(buyer).cancelListing(1))
        .to.be.revertedWith("Not the seller");
    });
  });

  describe("Buying Process", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
    });

    it("Should successfully buy a car", async function () {
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);
      const initialFeeRecipientBalance = await ethers.provider.getBalance(feeRecipient.address);

      await expect(marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1") }))
        .to.emit(marketplace, "CarSold")
        .withArgs(1, await seller.getAddress(), await buyer.getAddress(), ethers.parseEther("1"));

      expect(await mockNFT.ownerOf(1)).to.equal(await buyer.getAddress());

      const feeAmount = ethers.parseEther("1") * BigInt(INITIAL_FEE_PERCENTAGE) / 10000n;
      const sellerAmount = ethers.parseEther("1") - feeAmount;

      expect(await ethers.provider.getBalance(seller.address)).to.equal(initialSellerBalance + sellerAmount);
      expect(await ethers.provider.getBalance(feeRecipient.address)).to.equal(initialFeeRecipientBalance + feeAmount);
    });

    it("Should fail to buy with insufficient funds", async function () {
      await expect(marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("0.5") }))
        .to.be.revertedWith("Insufficient payment");
    });

    it("Should refund excess payment", async function () {
      const initialBuyerBalance = await ethers.provider.getBalance(buyer.address);
      const tx = await marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1.5") });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);
      expect(initialBuyerBalance - finalBuyerBalance).to.be.closeTo(
        ethers.parseEther("1") + gasUsed,
        ethers.parseEther("0.0001")
      );
    });
  });

  describe("Auction Functionality", function () {
    beforeEach(async function () {
      await marketplace.updateContractAddresses(
        await mockNFT.getAddress(),
        await mockOracle.getAddress(),
        await mockAuction.getAddress()
      );
      await marketplace.connect(seller).createAuctionListing(1, ethers.parseEther("1"), 86400);
    });

    it("Should finish auction", async function () {
      await expect(marketplace.connect(buyer).finishAuction(1))
        .to.not.be.reverted;

      const listing = await marketplace.getListing(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should fail to finish non-existent auction", async function () {
      await expect(marketplace.connect(buyer).finishAuction(2))
        .to.be.revertedWith("Listing is not active");
    });
  });

  describe("Administrative Functions", function () {
    it("Should update marketplace fee", async function () {
      await expect(marketplace.connect(owner).setMarketplaceFee(300))
        .to.emit(marketplace, "MarketplaceFeeUpdated")
        .withArgs(300);

      expect(await marketplace.marketplaceFeePercentage()).to.equal(300);
    });

    it("Should fail to set fee percentage too high", async function () {
      await expect(marketplace.connect(owner).setMarketplaceFee(1001))
        .to.be.revertedWith("Fee percentage too high");
    });

    it("Should update fee recipient", async function () {
      const newFeeRecipient = await ethers.Wallet.createRandom().getAddress();
      await expect(marketplace.connect(owner).setFeeRecipient(newFeeRecipient))
        .to.emit(marketplace, "FeeRecipientUpdated")
        .withArgs(newFeeRecipient);

      expect(await marketplace.feeRecipient()).to.equal(newFeeRecipient);
    });

    it("Should accumulate fees in feeRecipient and withdraw marketplace fees", async function () {
        const initialFeeRecipientBalance = await ethers.provider.getBalance(feeRecipient.address);
    
        await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
        await marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1") });
    
        const finalFeeRecipientBalance = await ethers.provider.getBalance(feeRecipient.address);
        
        expect(finalFeeRecipientBalance).to.be.gt(
          initialFeeRecipientBalance,
          "Fee recipient should have received fees"
        );

        const expectedFee = ethers.parseEther("1") * BigInt(INITIAL_FEE_PERCENTAGE) / 10000n;

        expect(finalFeeRecipientBalance - initialFeeRecipientBalance).to.equal(
          expectedFee,
          "Fee recipient should have received the correct fee amount"
        );

        await expect(marketplace.connect(owner).withdrawMarketplaceFees())
          .to.be.revertedWith("No fees to withdraw");
    });

    it("Should pause and unpause the contract", async function () {
        await marketplace.connect(owner).pause();
        expect(await marketplace.paused()).to.be.true;
    
        await expect(marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1")))
          .to.be.revertedWithCustomError(marketplace, "EnforcedPause");
    
        await marketplace.connect(owner).unpause();
        expect(await marketplace.paused()).to.be.false;
    
        await expect(marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1")))
          .to.not.be.reverted;
      });

      it("Should fail to withdraw fees if there are none", async function () {
        await expect(marketplace.connect(owner).withdrawMarketplaceFees())
          .to.be.revertedWith("No fees to withdraw");
      });
      
      it("Should fail to withdraw fees if not owner", async function () {
        await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
        await marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1.1") });

        await expect(marketplace.connect(buyer).withdrawMarketplaceFees())
          .to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount")
          .withArgs(await buyer.getAddress());
      });
      
      it("Should fail to create listing when paused", async function () {
        await marketplace.connect(owner).pause();
        await expect(marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1")))
          .to.be.revertedWithCustomError(marketplace, "EnforcedPause");
      });
      
      it("Should fail to buy when paused", async function () {
        await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
        await marketplace.connect(owner).pause();
        await expect(marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1") }))
          .to.be.revertedWithCustomError(marketplace, "EnforcedPause");
      });
  });

  describe("Edge Cases and Boundary Testing", function () {
    it("Should handle maximum allowed fee percentage", async function () {
      await expect(marketplace.connect(owner).setMarketplaceFee(1000))
        .to.emit(marketplace, "MarketplaceFeeUpdated")
        .withArgs(1000);

      expect(await marketplace.marketplaceFeePercentage()).to.equal(1000);
    });

    it("Should fail when setting fee percentage above maximum", async function () {
      await expect(marketplace.connect(owner).setMarketplaceFee(1001))
        .to.be.revertedWith("Fee percentage too high");
    });

    it("Should handle listing with maximum possible price", async function () {
      const maxUint256 = ethers.MaxUint256;
      await expect(marketplace.connect(seller).createFixedPriceListing(1, maxUint256))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, await seller.getAddress(), maxUint256, 0);

      const listing = await marketplace.getListing(1);
      expect(listing.price).to.equal(maxUint256);
    });

    it("Should fail when trying to buy with zero value", async function () {
      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
      await expect(marketplace.connect(buyer).buyCar(1, { value: 0 }))
        .to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Function Interactions", function () {
    it("Should handle create, update, and buy sequence", async function () {
      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));

      await marketplace.connect(seller).updateListing(1, ethers.parseEther("1.5"));

      await marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1.5") });

      expect(await mockNFT.ownerOf(1)).to.equal(await buyer.getAddress());
    });

    it("Should handle create, cancel, and attempt to buy sequence", async function () {
      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));

      await marketplace.connect(seller).cancelListing(1);

      await expect(marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1") }))
        .to.be.revertedWith("Listing is not active");
    });

    it("Should handle create auction, cancel, and create fixed price sequence", async function () {
      await marketplace.updateContractAddresses(
        await mockNFT.getAddress(),
        await mockOracle.getAddress(),
        await mockAuction.getAddress()
      );

      await marketplace.connect(seller).createAuctionListing(1, ethers.parseEther("1"), 86400);

      await marketplace.connect(seller).cancelListing(1);

      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1.5"));

      const listing = await marketplace.getListing(1);
      expect(listing.listingType).to.equal(0);
      expect(listing.price).to.equal(ethers.parseEther("1.5"));
    });
  });

  describe("Comprehensive Scenario", function () {
    it("Should handle a complex sequence of operations", async function () {
      const [, seller2] = await ethers.getSigners();
      await mockNFT.mint(seller2.address, 2);
      await mockNFT.connect(seller2).setApprovalForAll(await marketplace.getAddress(), true);
      await mockOracle.setCarDetails("VIN789", true, seller2.address);

      await marketplace.connect(seller).createFixedPriceListing(1, ethers.parseEther("1"));
      await marketplace.connect(seller2).createFixedPriceListing(2, ethers.parseEther("2"));

      await marketplace.connect(seller).updateListing(1, ethers.parseEther("1.5"));

      await marketplace.connect(buyer).buyCar(1, { value: ethers.parseEther("1.5") });

      await marketplace.connect(seller2).cancelListing(2);

      await expect(marketplace.connect(buyer).buyCar(2, { value: ethers.parseEther("2") }))
        .to.be.revertedWith("Listing is not active");

      await mockNFT.connect(buyer).setApprovalForAll(await marketplace.getAddress(), true);
      await mockOracle.setCarDetails("VIN123", true, buyer.address);
      await marketplace.connect(buyer).createFixedPriceListing(1, ethers.parseEther("3"));

      expect(await mockNFT.ownerOf(1)).to.equal(await buyer.getAddress());
      expect((await marketplace.getListing(1)).seller).to.equal(await buyer.getAddress());
      expect((await marketplace.getListing(1)).price).to.equal(ethers.parseEther("3"));
      expect((await marketplace.getListing(2)).isActive).to.be.false;
    });
  });
});