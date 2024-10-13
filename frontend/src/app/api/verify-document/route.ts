import { NextRequest, NextResponse } from "next/server";
import dummyDatabase from "@/lib/dummy-user-data.json";

export async function POST(req: NextRequest, res: NextResponse) {
	const { isSuccessfullyMatched, idNumber, fullName, ...others } =
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
	const foundUser = dummyDatabase.find(
		(user) => user.idNumber.toString() === idNumber.toString()
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

	// console.log(req.body);

	try {
		if (!isSuccessfullyMatched || !isNameAvailable) {
			return new NextResponse(JSON.stringify({ error: "Failed to verify" }), {
				status: 400,
			});
		}
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
