"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import React from "react";

const NavLinks = ({ isMobile = false, setOpen }: INavLinks) => {
  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-y-4" : "flex-row gap-x-6"}`}
    >
      {navItems.map(({ name, href }) => {
        return (
          <Link
            href={href}
            key={name}
            className={`text-amber-900 hover:text-amber-600 transition-colors font-medium text-md leading-[21px] `}
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
