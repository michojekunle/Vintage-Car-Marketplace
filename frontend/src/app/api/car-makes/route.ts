import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const year = searchParams.get("year");

		const apiUrl = new URL("https://www.carqueryapi.com/api/0.3/");
		apiUrl.searchParams.set("callback", "?");
		apiUrl.searchParams.set("cmd", "getMakes");
		if (year) {
			apiUrl.searchParams.set("year", year);
		}

		const response = await fetch(apiUrl.toString());
		const text = await response.text();

		const jsonStr = text.match(/\?+\((.*)\)/)?.[1];

		if (!jsonStr) {
			throw new Error("Invalid JSONP response");
		}

		const data = JSON.parse(jsonStr);
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching car data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch car data" },
			{ status: 500 }
		);
	}
}
