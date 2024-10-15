const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VintageCarMarketplace...");

  const VintageCarMarketplace = await ethers.getContractFactory("VintageCarMarketplace");
  const [deployer] = await ethers.getSigners();

  const vintageCarNFTAddress = "0x26950e95ED15b4B172D600d31f4dcA60127C6dF4"; 
  const carVerificationOracleAddress = "0xA7F967429dd85844e6583308374ca6117daae1A7";
  const initialFeePercentage = 250; 
  const initialFeeRecipient = deployer.address;

  const marketplace = await VintageCarMarketplace.deploy(
    vintageCarNFTAddress,
    carVerificationOracleAddress,
    initialFeePercentage,
    initialFeeRecipient
  );

  await marketplace.waitForDeployment();

  console.log("VintageCarMarketplace deployed to:", await marketplace.getAddress());

  console.log("Verifying contract on Basescan...");
  await hre.run("verify:verify", {
    address: await marketplace.getAddress(),
    constructorArguments: [
      vintageCarNFTAddress,
      carVerificationOracleAddress,
      initialFeePercentage,
      initialFeeRecipient,
    ],
  });

  console.log("Contract verified on Basescan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });