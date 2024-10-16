const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Interacting with VintageCarNFT contract...");

  // Replace with your actual deployed contract address
  const contractAddress = "0x26950e95ED15b4B172D600d31f4dcA60127C6dF4";

  // Get the contract instance
  const VintageCarNFT = await ethers.getContractFactory("VintageCarNFT");
  const vintageCarNFT = VintageCarNFT.attach(contractAddress);

  // Mint some cars
  console.log("Minting cars...");

  const carsToMint = [
    {
      to: addr1.address,
      make: "Ford",
      model: "Mustang",
      year: 1969,
      vin: "1FABP40D6FF123456",
      color: "Red",
      mileage: 75000,
      condition: "Good",
      tokenURI: "ipfs://Qm...1" // Replace with actual IPFS URI
    },
    {
      to: addr1.address,
      make: "Chevrolet",
      model: "Camaro",
      year: 1970,
      vin: "124870L123456",
      color: "Blue",
      mileage: 80000,
      condition: "Excellent",
      tokenURI: "ipfs://Qm...2" // Replace with actual IPFS URI
    },
    {
      to: addr2.address,
      make: "Dodge",
      model: "Charger",
      year: 1968,
      vin: "XP29H8B123456",
      color: "Black",
      mileage: 70000,
      condition: "Very Good",
      tokenURI: "ipfs://Qm...3" // Replace with actual IPFS URI
    }
  ];

  const mintedTokenIds = [];

  for (const car of carsToMint) {
    const tx = await vintageCarNFT.connect(owner).mintCar(
      car.to,
      car.make,
      car.model,
      car.year,
      car.vin,
      car.color,
      car.mileage,
      car.condition,
      car.tokenURI
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.fragment.name === 'CarMinted');
    const tokenId = event.args.tokenId;
    mintedTokenIds.push(tokenId);
    console.log(`Minted car with token ID: ${tokenId}`);
  }

  // Update some car details
  console.log("Updating car details...");
  await vintageCarNFT.connect(addr1).updateCarDetails(mintedTokenIds[0], "Cherry Red", 76000, "Excellent");
  console.log(`Updated details for car with token ID: ${mintedTokenIds[0]}`);

  // Add a service record
  console.log("Adding service record...");
  await vintageCarNFT.connect(addr1).addServiceRecord(mintedTokenIds[0], "Full engine rebuild", owner.address);
  console.log(`Added service record for car with token ID: ${mintedTokenIds[0]}`);

  // Verify a car
  console.log("Verifying a car...");
  await vintageCarNFT.connect(owner).verifyCar(mintedTokenIds[1]);
  console.log(`Verified car with token ID: ${mintedTokenIds[1]}`);

  // Set car valuation
  console.log("Setting car valuation...");
  await vintageCarNFT.connect(owner).setCarValuation(mintedTokenIds[2], ethers.parseEther("50"));
  console.log(`Set valuation for car with token ID: ${mintedTokenIds[2]}`);

  // Transfer a car
  console.log("Transferring a car...");
  await vintageCarNFT.connect(addr1).transferFrom(addr1.address, addr2.address, mintedTokenIds[0]);
  console.log(`Transferred car with token ID: ${mintedTokenIds[0]} from ${addr1.address} to ${addr2.address}`);

  // Get car details
  console.log("Getting car details...");
  for (const tokenId of mintedTokenIds) {
    const carDetails = await vintageCarNFT.getCarDetails(tokenId);
    console.log(`Car details for token ID ${tokenId}:`);
    console.log(carDetails);
  }

  // List cars for sale (this is a mock implementation as the actual listing might depend on your marketplace contract)
  console.log("Listing cars for sale...");
  const mockMarketplace = {
    listItem: async (tokenId, price) => {
      console.log(`Listed car ${tokenId} for sale at ${ethers.formatEther(price)} ETH`);
    }
  };

  await mockMarketplace.listItem(mintedTokenIds[1], ethers.parseEther("40"));
  await mockMarketplace.listItem(mintedTokenIds[2], ethers.parseEther("55"));

  console.log("Interaction script completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });