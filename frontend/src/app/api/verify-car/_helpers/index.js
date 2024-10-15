import { ethers }  from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { abi, source } from './constants';

const VERIFIER_ACCOUNT_KEY = process.env.CAR_VERIFIER_ACCOUNT_KEY;
const RPC_URL = "https://sepolia.base.org";
const CONTRACT_ADDRESS = "0xA7F967429dd85844e6583308374ca6117daae1A7";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(VERIFIER_ACCOUNT_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

export async function carVerifier(vin, make, model, year) {
  try {
    console.log("Sending transaction...");
    const tx = await contract.requestCarValidation(
      vin,
      make,
      model,
      year,
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
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30000));

        try {
          const responseReceived = await contract.isResponseReceived(requestId);
          console.log(
            `Attempt ${i + 1}: Response received: ${responseReceived}`
          );

          if (responseReceived) {
            try {
              const requestExists = await contract.doesRequestExist(requestId);
              console.log(`Request exists: ${requestExists}`);

              if (requestExists) {
                const rawResponseBytes = await contract.getRawResponseBytes(
                  requestId
                );
                console.log(`Raw response bytes: ${rawResponseBytes}`);

                isProcessed = true;
                return { success: isProcessed, response: rawResponseBytes, message: "Request found" };
              } else {
                console.log("Request does not exist in the contract.");
              }
            } catch (processError) {
              console.error("Error processing verification:", processError);
              if (processError.reason) {
                console.error("Revert reason:", processError.reason);
              }
              return { success: false, response: null, error: processError };
            }
          } else {
            console.log("Response not yet received. Waiting...");
          }
        } catch (checkError) {
          console.error(
            `Error checking response status (Attempt ${i + 1}):`,
            checkError
          );
          return { success: false, response: null, error: checkError };
        }
      }
    } else {
      console.log("Could not find requestId in the logs");
      return { success: false, response: null, message: "Could not find requestId in the logs" };
    }
  } catch (error) {
    console.error("Detailed error:", error);
    if (error.errorName) {
      console.error("Error name:", error.errorName);
    }

    if (error.errorArgs) {
      console.error("Error arguments:", error.errorArgs);
    }
    return { success: false, response: null, error };
  }
}
