"use client";

import { useState } from "react";
import { Car, Link, Menu, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { account, isConnected } = useAccount();
  const { address } = account;

  return (
    <div className="flex justify-between items-center gap-2 text-white sticky top-0 z-50 border-b border-amber-200 bg-amber-50 bg-opacity-90 backdrop-blur-sm py-4 px-4 sm:px-10 md:px-16">
      <Link href="/" className="flex items-center space-x-4">
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
          <Car className="h-8 w-8 text-amber-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-amber-800">VintageChain</h1>
      </Link>
      <div className="hidden lg:block">
        <NavLinks isMobile={false} />
      </div>
      <div className="hidden lg:block">
        {isConnected ? (
          <div
            className="flex items-center cursor-pointer"
          >
            <Avatar>
              <AvatarImage src="" alt="@user" />
              <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
            </Avatar>

            <div className="ml-3 hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Connected Account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {address ? `${address.slice(0, 8)}...${address.slice(-7)}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-400 text-white"
            onClick={() => { }}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent hover:text-amber-500 text-amber-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[250px] sm:w-[300px] bg-amber-100"
          >
            <div className="flex flex-col gap-y-4 py-4">
              <NavLinks isMobile={true} setOpen={setOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-x-2 lg:hidden">
        {isConnected ? (
          <div
            className="flex items-center cursor-pointer"
          >
            <Avatar>
              <AvatarImage src="" alt="@user" />
              <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
            </Avatar>

            <div className="ml-3 hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Connected Account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {address ? `${address.slice(0, 8)}...${address.slice(-7)}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-400 text-white"
            onClick={() => { }}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent hover:text-amber-500 text-amber-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[250px] sm:w-[300px] bg-amber-100"
          >
            <div className="flex flex-col gap-y-4 py-4">
              <NavLinks isMobile={true} setOpen={setOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
