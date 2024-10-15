import { Contract, ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { abi } from "./constants";

const VERIFIER_ACCOUNT_KEY = process.env.PRIVATE_KEY;
const RPC_URL = "https://sepolia.base.org";
const CONTRACT_ADDRESS = "0xa7E07d5db90FD4F5915dF139F871ADe5B430527c";

if (!VERIFIER_ACCOUNT_KEY) {
	throw new Error("Private key is not set in environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(VERIFIER_ACCOUNT_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, abi, signer);

let source;
// Fetch file from the public directory
try {
	// Read source code for the request
  const sourcePath = path.join(process.cwd(), 'src/app/api/car-verify/_helpers/chainlinkFunction.js');
	source = fs.readFileSync(sourcePath, "utf8");
	console.log(source);
} catch (fetchError) {
	console.error(
		"Error reading the source file from a public directory.",
		fetchError
	);
}

export async function carVerifier(vin, make, model, year, carOwner) {
	try {
		console.log("Sending transaction...");
		const tx = await contract.requestCarValidation(
			vin,
			make,
			model,
			year,
			source,
      carOwner,
			{ gasLimit: 1000000 }
		);

		console.log("Transaction hash:", tx.hash);
		const receipt = await tx.wait();
		console.log("Transaction mined. Status:", receipt.status);

		let requestId = null;
		for (const log of receipt.logs) {
			if (log.args && log.args.requestId) {
				requestId = log.args.requestId;
				break;
			}
		}

		if (!requestId) {
			console.log("Could not find requestId in the logs");
			return {
				success: false,
				response: null,
				message: "Could not find requestId in the logs",
			};
		}

		console.log(`Request sent with ID: ${requestId}`);
		let isProcessed = false;

		for (let i = 0; i < 10; i++) {
			await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

			try {
				const responseReceived = await contract.isResponseReceived(requestId);
				console.log(`Attempt ${i + 1}: Response received: ${responseReceived}`);

				if (responseReceived) {
					const requestExists = await contract.doesRequestExist(requestId);
					console.log(`Request exists: ${requestExists}`);

					if (requestExists) {
						const rawResponseBytes = await contract.getRawResponseBytes(
							requestId
						);
						console.log(`Raw response bytes: ${rawResponseBytes}`);

						isProcessed = true;
						return {
							success: isProcessed,
							response: rawResponseBytes,
							message: "Request found",
						};
					} else {
						console.log("Request does not exist in the contract.");
					}
				} else {
					console.log("Response not yet received. Waiting...");
				}
			} catch (checkError) {
				console.error(
					`Error checking response status (Attempt ${i + 1}):`,
					checkError
				);
				return {
					success: false,
					response: null,
					error: checkError.message || "Unknown error",
				};
			}
		}

		return {
			success: false,
			response: null,
			message: "Request processing timed out",
		};
	} catch (error) {
		console.error("Detailed error:", error);
		return {
			success: false,
			response: null,
			error: error.message || "Unknown error",
		};
	}
}
