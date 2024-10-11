"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ isMobile = false, setOpen }: INavLinks) => {
  const pathname = usePathname();
  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-y-4" : "flex-row gap-x-6"}`}
    >
      {navItems.map(({ name, href }) => {
        const active = pathname.split("/")[1] === href.split("/")[1];

        return (
          <Link
            href={href}
            key={name}
            className={`text-amber-800 hover:text-amber-600 transition-colors font-medium text-md leading-[21px] ${
              active ? "opacity-1 font-bold" : "opacity-70"
            }`}
            onClick={() => isMobile && setOpen && setOpen(false)}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
