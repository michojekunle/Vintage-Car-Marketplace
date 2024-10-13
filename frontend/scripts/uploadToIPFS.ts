const axios = require("axios");
const CryptoJS = require("crypto-js");
const pinataSDK = require("@pinata/sdk");
const { Readable } = require("stream");
const dotenv = require("dotenv");
const dummyData = require("../src/lib/dummy-user-data.json");
dotenv.config();

const pinata = new pinataSDK(
	process.env.PINATA_API_KEY,
	process.env.PINATA_SECRET_API_KEY
);

const encryptData = (data, secretKey) => {
	const ciphertext = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		secretKey
	).toString();
	return ciphertext;
};

const decryptData = (ciphertext, secretKey) => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	return decryptedData;
};

const uploadToIPFS = async () => {
	try {
		const secretKey = "mysecretkey";
		// const jsonData = [
		// 	{ name: "John Doe", age: 30 },
		// 	{ name: "Jane Smith", age: 25 },
		// ];

		const encryptedData = encryptData(dummyData, secretKey);

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
		console.log("Data uploaded to IPFS:", fileUrl);
	} catch (error) {
		console.error("Error uploading to IPFS:", error);
		throw error;
	}
};

// const handleUploadToIPFS = async () => {
// 	try {
// 		const secretKey = "mysecretkey";
// 		const jsonData = [
// 			{ name: "John Doe", age: 30 },
// 			{ name: "Jane Smith", age: 25 },
// 		];

// 		const encryptedData = encryptData(jsonData, secretKey);

// 		const fileUrl = await uploadToIPFS(encryptedData);
// 		console.log("Data uploaded to IPFS:", fileUrl);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const retrieveFromIPFS = async () => {
	try {
		// const url = `https://gateway.pinata.cloud/ipfs/QmdMFkJk3xA59R4qAhwHpUnuXf4BgecPcvvrbwd4HGgvTy`;
		const url = `https://gateway.pinata.cloud/ipfs/QmVS5re4juQX6EiyKwNBNBgx9vJE6mBPgYCQXSLcmx4Qcg`;
		const secretKey = "mysecretkey";

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

// uploadToIPFS();
retrieveFromIPFS();
