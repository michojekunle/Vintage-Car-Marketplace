const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const { SubscriptionManager } = require('@chainlink/functions-toolkit');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = '0x9406d4352f48648b51f9f42B5175836aa13cD1B0';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'CarVerificationOracle.json'))).abi;
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const sourcePath = path.join(__dirname, 'chainlinkFunction.js');
const source = fs.readFileSync(sourcePath, 'utf8');

async function main() {
    try {
      console.log("Sending transaction...");
      const tx = await contract.requestCarValidation(
        '1HGCM82633A004352',
        'Honda',
        'Accord',
        2003,
        source,
        { gasLimit: 1000000 }
      );
  
      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction mined. Status:", receipt.status);
  
      console.log("Receipt logs:");
      receipt.logs.forEach((log, index) => {
        console.log(`Log ${index}:`);
        console.log("  Address:", log.address);
        console.log("  Topics:", log.topics);
        console.log("  Data:", log.data);
        if (log.args) {
          console.log("  Decoded args:", log.args);
        }
      });

      let requestId;
      for (const log of receipt.logs) {
        if (log.args && log.args.requestId) {
          requestId = log.args.requestId;
          break;
        }
      }
  
      if (requestId) {
        console.log(`Request sent with ID: ${requestId}`);
  
        await new Promise(resolve => setTimeout(resolve, 60000)); 
  
        const result = await contract.getVerificationResult(requestId);
        console.log(`Verification result: ${result}`);
      } else {
        console.log("Could not find requestId in the logs");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      if (error.errorName) {
        console.error("Error name:", error.errorName);
      }
      if (error.errorArgs) {
        console.error("Error arguments:", error.errorArgs);
      }
    }
}

main().catch(console.error);