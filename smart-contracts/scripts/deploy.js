const hre = require("hardhat");

async function main() {
  const CarVerificationOracle = await hre.ethers.getContractFactory("CarVerificationOracle");
  
  const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
  
  const carVerificationOracle = await CarVerificationOracle.deploy(routerAddress);

  await carVerificationOracle.waitForDeployment();

  console.log("CarVerificationOracle deployed to:", await carVerificationOracle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});