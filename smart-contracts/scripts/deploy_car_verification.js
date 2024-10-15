const hre = require("hardhat");

async function main() {
  const CarVerificationOracle = await hre.ethers.getContractFactory("CarVerificationOracle");
  const routerAddress = "0xf9B8fc078197181C841c296C876945aaa425B278";
  
  console.log("Deploying CarVerificationOracle...");
  const carVerificationOracle = await CarVerificationOracle.deploy(routerAddress);
  await carVerificationOracle.waitForDeployment();
  
  const contractAddress = await carVerificationOracle.getAddress();
  console.log("CarVerificationOracle deployed to:", contractAddress);

  console.log("Waiting for block confirmations...");
  await carVerificationOracle.deploymentTransaction().wait(5);

  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [routerAddress],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});