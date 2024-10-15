import { NextRequest, NextResponse } from "next/server";
// import dummyDatabase from "@/lib/dummy-user-data.json";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ethers, Contract, JsonRpcProvider } from "ethers";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const sellerVerificationContractAddress =
	"0x2c13E255Ae105ff262A7eD47040D1D7bB3f837Ed";
const ABI = [
	"function verifySeller(address seller, bytes32 idNumberHash) external",
	"function getEncryptedDatabaseIpfsUrl() external view returns (string memory)",
];

const provider = new JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
const contractWithSigner = new Contract(
	sellerVerificationContractAddress,
	ABI,
	signer
);

const retrieveFromIPFS = async () => {
	try {
		const url =
			(await contractWithSigner.getEncryptedDatabaseIpfsUrl()) ??
			"Oops we lost";
		const secretKey = process.env.SECRET_KEY as string;

		const response = await axios.get(url);
		const encryptedData = response.data;

		const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
		const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		return decryptedData;
		console.log(decryptedData);
	} catch (error) {
		console.error("Error retrieving from IPFS:", error);
		throw error;
	}
};

export async function POST(req: NextRequest) {
	const { isSuccessfullyMatched, address, idNumber, fullName, ...others } =
		await req.json();
	console.log({ isSuccessfullyMatched, idNumber, fullName, others });

	if (!fullName || !idNumber || !isSuccessfullyMatched) {
		return new NextResponse(JSON.stringify({ error: "Invalid request" }), {
			status: 400,
		});
	}
	const fullNameSplitted = fullName.split(" ");
	console.log({ fullNameSplitted });
	// check if name exist in dummy data
	const decryptedData = await retrieveFromIPFS();
	const foundUser = decryptedData.find(
		(user: any) => user?.idNumber?.toString() === idNumber.toString()
	);

	if (!foundUser) {
		return new NextResponse(JSON.stringify({ error: "User not found" }), {
			status: 404,
		});
	}

	console.log({ foundUser });

	const isNameAvailable = fullNameSplitted.every((namePart: string) =>
		foundUser.fullName.toLowerCase().includes(namePart.toLowerCase())
	);

	try {
		if (!isSuccessfullyMatched || !isNameAvailable) {
			return new NextResponse(JSON.stringify({ error: "Failed to verify" }), {
				status: 400,
			});
		}
		const hashedIdNumber = ethers.keccak256(ethers.toUtf8Bytes(idNumber));

		const tx = await contractWithSigner.verifySeller(address, hashedIdNumber);

		await tx.wait();

		return NextResponse.json({ message: "successfully verified" });
	} catch (error) {
		console.error(error);
		// return new Response("Internal Server Error", { status: 500 });
		return new NextResponse(
			JSON.stringify({ error: "Error processing request" }),
			{ status: 500 }
		);
	}
}
