"use client";

import { Bell, Menu, LogOut, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const DashboardHeader = ({ isOpen, toggleSidebar } : { isOpen: boolean, toggleSidebar: () => void }) => {
  const [mounted, setMounted] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center">
        <div className="lg:hidden mr-2">
          <button
            className={`fixed top-3 ${isOpen ? 'left-64 ml-3' : "left-4"} z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md transition `}
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
        <h2 className="ml-10 lg:ml-0 text-xl font-semibold text-gray-800 dark:text-gray-200">
          My Cars
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search..."
          className="w-64 bg-gray-100 dark:bg-gray-700"
        />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Button>
        {!mounted && (
          <div className="animate-pulse flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        )}
        {mounted && isConnected ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="" alt="@user" />
                  <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard">Your cars</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/add-car">Add car</Link>
              </DropdownMenuItem>
              {!isConnected ? (
                <DropdownMenuItem
                  onClick={
                    openConnectModal ? () => openConnectModal() : () => {}
                  }
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Connect</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => disconnect()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ConnectButton />
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
