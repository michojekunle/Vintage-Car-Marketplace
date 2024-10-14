import { Footer } from "@/components";
import Navbar from "@/components/Navbar";
import "@rainbow-me/rainbowkit/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
  );
}
