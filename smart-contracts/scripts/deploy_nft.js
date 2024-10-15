const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VintageCarNFT contract...");

  const VintageCarNFT = await ethers.getContractFactory("VintageCarNFT");

  const name = "Vintage Car NFT";
  const symbol = "VCNFT";
  const carVerificationContractAddress = "0xA7F967429dd85844e6583308374ca6117daae1A7";

  const vintageCarNFT = await VintageCarNFT.deploy(name, symbol, carVerificationContractAddress);

  await vintageCarNFT.waitForDeployment();

  console.log("VintageCarNFT deployed to:", await vintageCarNFT.getAddress());

  console.log("Waiting for block confirmations...");
  await vintageCarNFT.deploymentTransaction().wait(5);

  console.log("Verifying contract on Basescan...");
  await hre.run("verify:verify", {
    address: await vintageCarNFT.getAddress(),
    constructorArguments: [name, symbol, carVerificationContractAddress],
  });

  console.log("Contract verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });