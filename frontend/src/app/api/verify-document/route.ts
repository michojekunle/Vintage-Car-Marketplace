import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	const {isSuccessfullyMatched, idNumber, fullName, ...others  } = await req.json();
    console.log({isSuccessfullyMatched, idNumber, fullName, others})
    console.log(req.body)

	try {
	
        return NextResponse.json({ umessage: "successfully verified" });

	} catch (error) {
		console.error(error);
		// return new Response("Internal Server Error", { status: 500 });
        return new NextResponse(JSON.stringify({ error: 'Error processing request' }), { status: 500 });

	}
}
