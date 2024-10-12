const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = 'https://sepolia.base.org';
const CONTRACT_ADDRESS = '0xeF8FF47A64B5Ab9cf143C627f31C0d543D36f883';

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

        let requestId;
        for (const log of receipt.logs) {
            if (log.args && log.args.requestId) {
                requestId = log.args.requestId;
                break;
            }
        }

        if (requestId) {
            console.log(`Request sent with ID: ${requestId}`);

            let isProcessed = false;
            for (let i = 0; i < 1; i++) {
                await new Promise(resolve => setTimeout(resolve, 30000));

                try {
                    const responseReceived = await contract.isResponseReceived(requestId);
                    console.log(`Attempt ${i + 1}: Response received: ${responseReceived}`);

                    if (responseReceived) {
                        try {
                            const requestExists = await contract.doesRequestExist(requestId);
                            console.log(`Request exists: ${requestExists}`);

                            if (requestExists) {
                                const rawResponseBytes = await contract.getRawResponseBytes(requestId);
                                console.log(`Raw response bytes: ${rawResponseBytes}`);

                                isProcessed = true;
                            } else {
                                console.log("Request does not exist in the contract.");
                            }
                        } catch (processError) {
                            console.error("Error processing verification:", processError);
                            if (processError.reason) {
                                console.error("Revert reason:", processError.reason);
                            }
                        }
                    } else {
                        console.log("Response not yet received. Waiting...");
                    }
                } catch (checkError) {
                    console.error(`Error checking response status (Attempt ${i + 1}):`, checkError);
                }
            }
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
