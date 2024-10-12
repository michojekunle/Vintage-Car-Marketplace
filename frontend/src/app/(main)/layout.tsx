import { Footer } from "@/components";
import Navbar from "@/components/Navbar";
import "@rainbow-me/rainbowkit/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
