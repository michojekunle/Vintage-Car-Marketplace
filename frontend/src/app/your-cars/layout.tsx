"use client";

import { Bell, Car, Plus, Menu, Home, LogOut, LogIn } from "lucide-react";
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
import { ReactNode } from "react";
import {
  ConnectButton,
  useAccountModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden w-64 bg-white dark:bg-gray-800 shadow-md lg:block">
        <div className="flex flex-col h-full">
          <Link href="/">
            <div className="flex items-center justify-center h-16 border-b border-r dark:border-gray-700 gap-2">
              <Car className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                VintageChain
              </h1>
            </div>
          </Link>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              {/* <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li> */}
              <li>
                <Link
                  href="/your-cars"
                  className={`flex ${pathname === "/your-cars" ? 'bg-amber-100': ''} items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900`}
                >
                  <Car className="w-5 h-5 mr-3" />
                  Your Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/your-cars/add-new-car"
                  className={`flex ${pathname === "/your-cars/add-new-car" ? 'bg-amber-100': ''} items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900`}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Add New Car
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            {isConnected ? (
              <div
                className="flex items-center cursor-pointer"
                onClick={openAccountModal ? () => openAccountModal() : () => {}}
              >
                {/* <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold"> */}
                <Avatar>
                  <AvatarImage src="" alt="@user" />
                  <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
                </Avatar>
                {/* </div> */}

                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Connected Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{address ? `${address.slice(0, 8)}...${address.slice(-7)}` : ""}</p>
                </div>
              </div>
            ) : (
              "No wallet connected"
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2">
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Your Cars
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
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="" alt="@user" />
                      <AvatarFallback className="bg-amber-500">
                        AU
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/your-cars" className="">Your cars</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/add-new-car">Add new car</Link>
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

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
