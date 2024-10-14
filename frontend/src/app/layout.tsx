import type { Metadata } from "next";
import { Georama } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const georama = Georama({
	weight: ["300", "400", "500", "700", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Vintage NFT Cars",
	description:
		"Revolutionizing vintage car ownership. Buy, sell, and maintain classic cars with blockchain technology",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<Script
					src="/core-sdk/FaceTecSDK.js/FaceTecSDK.js"
					strategy="beforeInteractive"
				/>
			</head>
			<body className={`${georama.className} antialiased`}>
				<Toaster />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
