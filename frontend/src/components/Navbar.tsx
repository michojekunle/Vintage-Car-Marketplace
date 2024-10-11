"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2 py-3 px-2 lg:px-5 text-white">
      <div className="flex text-xl lg:text-3xl font-black p-1 rounded-md">
        <div className="text-secondary-action">Vintage</div>
        <div className="text-white">NFTCars</div>
      </div>

      <div className="hidden lg:block">
        <NavLinks isMobile={false} />
      </div>
      <div className="hidden lg:block">
        <ConnectButton showBalance={false} chainStatus="name" />
      </div>

      <div className="flex items-center gap-x-2 lg:hidden">
        <ConnectButton showBalance={false} chainStatus="name" />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[250px] sm:w-[300px] bg-gray-900"
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
