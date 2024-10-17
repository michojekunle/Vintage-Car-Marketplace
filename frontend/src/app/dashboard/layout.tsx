"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import Sidebar from "./_components/sidebar";
import DashboardHeader from "./_components/header";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useWalletConnection from "@/hooks/useWalletConnection";
// import { FaceTecProvider } from "@/facetec/context/FacetecContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { isConnected, isReady } = useWalletConnection();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        {/* Main content area */}
        {/* <FaceTecProvider> */}
        {!isReady ? (
          <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100 ">
            {isConnected && address ? (
              <>{children}</>
            ) : (
              <div className="flex flex-col gap-7 h-full w-full justify-center items-center text-center">
                <p>Please connect your account to explore your dashboard</p>
                <ConnectButton />
              </div>
            )}
          </main>
        )}
        {/* </FaceTecProvider> */}
      </div>
    </div>
  );
}
