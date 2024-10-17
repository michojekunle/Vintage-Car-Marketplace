"use client";

import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
// import { Providers } from "../providers";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
   
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
   
  );
}
