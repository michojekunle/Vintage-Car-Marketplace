import { NextRequest, NextResponse } from "next/server";
import { carVerifier } from './_helpers';

export async function POST(req: NextRequest) {
	const { vin, make, model, year } =
		await req.json();

    if(!vin || !make || !model || !year) return new NextResponse(
        JSON.stringify({ error: "Bad request, Invalid Parameters passed" }),
        { status: 400 }
    );

	try {
        const verifiedInfo = await carVerifier(vin, make, model, year);

        if(verifiedInfo?.success) {
            console.log("Request id found successfully");
            return NextResponse.json({ message: "successfully verified", data: verifiedInfo?.response });
        }
	} catch (error) {
		console.error(error);
		// return new Response("Internal Server Error", { status: 500 });
		return new NextResponse(
			JSON.stringify({ error: "Error processing request" }),
			{ status: 500 }
		);
	}
}
