import { NextResponse } from "next/server";
import { Readable } from "stream"; 
import pinataSDK from "@pinata/sdk"; 
import { v4 as uuidv4 } from "uuid";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

export async function POST(req: Request) {
	const formData = await req.formData();
	const files = formData.getAll("files") as File[];
	const attributes = JSON.parse(formData.get("attributes") as string);
	const pinataFileCIDs: string[] = [];
	const vin = attributes.vin; 

	for (const [index, file] of files.entries()) {
		const randomId = uuidv4();
		const fileName = `${vin}-${randomId}-${index + 1}`;

		const fileBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(fileBuffer);

		const stream = Readable.from(buffer);

		try {
			const result = await pinata.pinFileToIPFS(stream, {
				pinataMetadata: {
					name: fileName,
				},
				pinataOptions: {
					cidVersion: 0, 
				},
			});

			pinataFileCIDs.push(
				`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
			);
		} catch (error) {
			console.error("Error uploading file to Pinata:", error);
			return NextResponse.json(
				{ error: "File upload failed" },
				{ status: 500 }
			);
		}
	}

	const metadata = {
		name: `${attributes.year} ${attributes.make} ${attributes.model}`,
		description: attributes.description,
		external_url: "https://pinata.cloud/",
		image: pinataFileCIDs[0], 
		attributes: [
			{ trait_type: "Make", value: attributes.make },
			{ trait_type: "Model", value: attributes.model },
			{ trait_type: "Year", value: attributes.year },
			{ trait_type: "VIN", value: vin },
			{ trait_type: "Color", value: attributes.color },
			{ trait_type: "Mileage", value: attributes.mileage },
			{ trait_type: "Exterior Condition", value: attributes.exteriorCondition },
			{ trait_type: "Engine Condition", value: attributes.engineCondition },
			{ trait_type: "Last Service Date", value: attributes.lastServiceDate },
			{ trait_type: "Verified", value: attributes.verified },
			{ trait_type: "Ownership History", value: attributes.ownershipHistory },
		],
		properties: {
			files: pinataFileCIDs.map((cid) => ({ uri: cid, type: "image/jpeg" })),
			category: "vintage_car",
		},
	};

	try {
		const metadataRes = await pinata.pinJSONToIPFS(metadata, {
			pinataMetadata: {
				name: `${vin}-metadata`,
			},
			pinataOptions: {
				cidVersion: 0,
			},
		});

		const tokenUri = `https://gateway.pinata.cloud/ipfs/${metadataRes.IpfsHash}`;
		console.log(tokenUri);
		return NextResponse.json({ tokenUri });
	} catch (error) {
		console.error("Error uploading metadata to Pinata:", error);
		return NextResponse.json(
			{ error: "Metadata upload failed" },
			{ status: 500 }
		);
	}
}
