const axios = require("axios");
const CryptoJS = require("crypto-js");
const pinataSDK = require("@pinata/sdk");
const { Readable } = require("stream");
const dotenv = require("dotenv");
const { ethers, Contract, JsonRpcProvider } = require("ethers");
const dummyData = require("../src/lib/dummy-user-data.json");
dotenv.config();

const pinata = new pinataSDK(
	process.env.PINATA_API_KEY,
	process.env.PINATA_SECRET_API_KEY
);

const provider = new JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sellerVerificationContractAddress =
	"0x8eE9d051301E8DDB26263B2F2bb2cA2EE42C7D77";
const contractABI = [
	"function setEncryptedDatabaseIpfsUrl(string memory _url) external",
	"function getEncryptedDatabaseIpfsUrl() external view returns (string memory)",
];
const contract = new Contract(
	sellerVerificationContractAddress,
	contractABI,
	signer
);

const encryptData = (data, secretKey) => {
	console.log("Encrypting data...");
	const ciphertext = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		secretKey
	).toString();
	console.log("Encrypted Successfully✅");
	return ciphertext;
};

const decryptData = (ciphertext, secretKey) => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	return decryptedData;
};

const uploadToIPFS = async () => {
	console.log("Mission started! Getting dummy data...");
	try {
		const secretKey = process.env.SECRET_KEY;

		const encryptedData = encryptData(dummyData, secretKey);

		console.log("Uploading to IPFS...");
		const buffer = Buffer.from(encryptedData, "utf-8");

		const stream = Readable.from(buffer);

		const result = await pinata.pinFileToIPFS(stream, {
			pinataMetadata: {
				name: `dummy-db.json`,
			},
			pinataOptions: {
				cidVersion: 0,
			},
		});
		const fileUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
		console.log("Uploaded successfully ✅");
		console.log("Data uploaded to IPFS:", fileUrl);
		return fileUrl;
	} catch (error) {
		console.error("Error uploading to IPFS:", error);
		throw error;
	}
};

const setDatabaIpfsUrl = async () => {
	try {
		const ipfsUrl = await uploadToIPFS();
		console.log("Setting database IPFS URL to Contract...");
		const txResponse = await contract.setEncryptedDatabaseIpfsUrl(ipfsUrl);
		const txReceipt = await txResponse.wait();

		console.log({ message: "Successfully added to database ✅✅", txReceipt });
	} catch (error) {
		console.error("Error uploading to IPFS:", error);
		throw error;
	}
};

const retrieveFromIPFS = async () => {
	try {
		// const url = `https://gateway.pinata.cloud/ipfs/QmdMFkJk3xA59R4qAhwHpUnuXf4BgecPcvvrbwd4HGgvTy`;
		const url =
			(await contract.getEncryptedDatabaseIpfsUrl()) ?? "Oops we lost";
		console.log("URL", url);
		if (!url) throw new Error("URL not found");
		const secretKey = process.env.SECRET_KEY;

		const response = await axios.get(url);
		const encryptedData = response.data;
		//   const cid = url.split("/").pop();

		const decryptedData = decryptData(encryptedData, secretKey);
		//   return decryptedData;
		console.log(decryptedData);
	} catch (error) {
		console.error("Error retrieving from IPFS:", error);
		throw error;
	}
};

retrieveFromIPFS()
	.then(() => console.log("All operations successful ✅✅✅"))
	.catch((err) => console.log("Failed operation", err));

// retrieveFromIPFS();
