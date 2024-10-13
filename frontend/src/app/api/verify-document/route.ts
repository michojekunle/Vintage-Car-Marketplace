// app/actions/contact.ts
// import { NextRequest } from "next/server";
// import nodemailer from "nodemailer";

import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
	const {  } = await request.json();

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		return new Response("Email sent successfully", { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
