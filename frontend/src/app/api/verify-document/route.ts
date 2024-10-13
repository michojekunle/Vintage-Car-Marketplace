import { NextRequest, NextResponse } from "next/server";
import dummyDatabase from "../dummy-user-data.json";

export async function POST(req: NextRequest, res: NextResponse) {
	const { isSuccessfullyMatched, idNumber, fullName, ...others } =
		await req.json();
	console.log({ isSuccessfullyMatched, idNumber, fullName, others });
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

	let isNameAvailabe: boolean = false;
	fullNameSplitted.forEach((name: string, index: number) => {
		console.log({ name, isNameAvailabe, index });
		if (foundUser?.fullName.toLowerCase().includes(name.toLowerCase())) {
			isNameAvailabe = true;
		}
		isNameAvailabe = false;
	});

	console.log(req.body);

	try {
		if (!isSuccessfullyMatched || !isNameAvailabe) {
			return new NextResponse(JSON.stringify({ error: "Failed to verify" }), {
				status: 500,
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
