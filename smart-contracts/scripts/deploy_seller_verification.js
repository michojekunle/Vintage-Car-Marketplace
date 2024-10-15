const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SellerVerification contract...");

  const SellerVerification = await ethers.getContractFactory("SellerVerification");
  const sellerVerification = await SellerVerification.deploy();

  await sellerVerification.waitForDeployment();

  const address = await sellerVerification.getAddress();
  console.log("SellerVerification deployed to:", address);

  console.log("Waiting for block confirmations...");
  await sellerVerification.deploymentTransaction().wait(5);

  console.log("Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });