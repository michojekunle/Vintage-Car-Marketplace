"use client";

import { useState } from "react";
import { Car, Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2 py-3 px-2 lg:px-5 text-white bg-amber-50 bg-opacity-90 backdrop-blur-sm  sticky top-0 z-50 shadow-md shadow-secondary-action">
      <div className="flex items-center space-x-4">
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
          <Car className="h-8 w-8 text-amber-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-amber-800">VintageChain</h1>
      </div>

      <div className="hidden lg:block">
        <NavLinks isMobile={false} />
      </div>
      <div className="hidden lg:block">
        <ConnectButton showBalance={false} chainStatus="name" />
      </div>

      <div className="flex items-center gap-x-2 lg:hidden">
        <ConnectButton showBalance={false} chainStatus="none" />

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
