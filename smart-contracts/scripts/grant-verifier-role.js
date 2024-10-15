const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x8eE9d051301E8DDB26263B2F2bb2cA2EE42C7D77";

  const coworkerAddress = "0x61e5F2A2e7f855331Bd3ba6Ee88Bf7A8d34a92F0";

  console.log("Granting verifier role to co-worker...");

  const SellerVerification = await ethers.getContractFactory("SellerVerification");
  const sellerVerification = SellerVerification.attach(contractAddress);

  const tx = await sellerVerification.grantVerifierRole(coworkerAddress);

  await tx.wait();

  console.log(`Verifier role granted to ${coworkerAddress}`);

  const hasRole = await sellerVerification.hasRole(await sellerVerification.VERIFIER_ROLE(), coworkerAddress);
  console.log(`Does co-worker have verifier role? ${hasRole}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });