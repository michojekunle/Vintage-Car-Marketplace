"use client";

import { navItems } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./common/Button";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center gap-2 py-3 px-5 text-white">
      <div className="flex text-3xl font-black  p-1 rounded-md">
        <div className="text-[#8598f7]">Vintage</div>
        <div className="text-white">NFTCars</div>
      </div>

      <div className="flex gap-x-6">
        {navItems.map(({ name, href }) => {
          const active = pathname.split("/")[1] === href.split("/")[1];

          return (
            <Link
              href={href}
              key={name}
              className={`text-white font-bold text-md leading-[21px] ${
                active ? "opacity-1" : "opacity-60"
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>

      <Button label="Connect Wallet" variant="secondary" />
    </div>
  );
};

export default Navbar;
