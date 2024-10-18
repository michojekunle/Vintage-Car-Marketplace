const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const marketplaceAddress = "0x6782c1E2bb9fEeD99A4ac155F8521250601b383e"; 
  
  const auctionContractAddress = "0x36520821D722A4c4fc966cc5A41fc7f1669dED6B";
  
  const vintageCarNFTAddress = "0x9E2f97f35fB9ab4CFe00B45bEa3c47164Fff1C16";

  console.log("Updating contract addresses...");

  const VintageCarMarketplace = await ethers.getContractFactory("VintageCarMarketplace");
  const marketplace = VintageCarMarketplace.attach(marketplaceAddress);

  const tx = await marketplace.updateContractAddresses(vintageCarNFTAddress, auctionContractAddress);
  await tx.wait();

  console.log("Contract addresses updated successfully");
  console.log("Auction contract set to:", auctionContractAddress);
  console.log("VintageCarNFT contract set to:", vintageCarNFTAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });