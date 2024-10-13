const hre = require("hardhat");

async function main() {
  const CarVerificationOracle = await hre.ethers.getContractFactory("CarVerificationOracle");
  
  const routerAddress = "0xf9B8fc078197181C841c296C876945aaa425B278";
  
  const carVerificationOracle = await CarVerificationOracle.deploy(routerAddress);

  await carVerificationOracle.waitForDeployment();

  console.log("CarVerificationOracle deployed to:", await carVerificationOracle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
