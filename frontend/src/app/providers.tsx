"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

import { config } from "./wagmi";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components";

const queryClient = new QueryClient();

export function Providers({ children }: Readonly<IProviders>) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: "#f59e0b",
            accentColorForeground: "black",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {!isDashboardRoute && <Navbar />}
          {children}
          {!isDashboardRoute && <Footer />}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
