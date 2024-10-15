import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { isSuccessfullyMatched, idNumber, fullName } =
		await req.json();

	try {
		// if (!isSuccessfullyMatched || !isNameAvailable) {
		// 	return new NextResponse(JSON.stringify({ error: "Failed to verify" }), {
		// 		status: 400,
		// 	});
		// }
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
