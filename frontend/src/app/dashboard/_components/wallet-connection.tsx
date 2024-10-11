"use client";

import React from 'react';
import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const WalletConnection = () => {
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();

  return (
    <div className="p-4 border-t">
      {isConnected ? (
        <div
          className="flex items-center cursor-pointer"
          onClick={openAccountModal ? () => openAccountModal() : () => {}}
        >
          <Avatar>
            <AvatarImage src="" alt="@user" />
            <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Connected Account
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {address
                ? `${address.slice(0, 8)}...${address.slice(-7)}`
                : ""}
            </p>
          </div>
        </div>
      ) : (
        "No wallet connected"
      )}
    </div>
  );
};

export default WalletConnection;