import { NextRequest, NextResponse } from "next/server";
import { carVerifier } from "./_helpers";

export async function POST(req: NextRequest) {
  const { vin, make, model, year,  carOwner } = await req.json();
  console.log({carOwner})

  if (!vin || !make || !model || !year) {
    return NextResponse.json(
      { error: "Bad request, Invalid Parameters passed" },
      { status: 400 }
    );
  }

  try {
    const verifiedInfo = await carVerifier(vin, make, model, year, carOwner);
    if (verifiedInfo && verifiedInfo.success) {
      console.log("Request id found successfully");
      return NextResponse.json({
        message: "successfully verified",
        data: verifiedInfo.response,
      });
    } else {
      console.log("No response, server didn't respond in time...");
      return NextResponse.json(
        { error: "No response, server didn't respond in time...", data: null },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
