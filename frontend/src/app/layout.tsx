import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar /> */}
        <div className="min-h-screen flex flex-col">
          {children}
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 VintageNFTCars. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
