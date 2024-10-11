import type { Metadata } from "next";
import { Georama } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

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
      <body className={`${georama.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
