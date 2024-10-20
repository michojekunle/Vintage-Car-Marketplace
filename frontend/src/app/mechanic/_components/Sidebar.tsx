"use client";
import Link from "next/link";
import React from "react";
import { Car, Plus, HomeIcon, BellDot } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const WalletConnection = dynamic(() => import("./wallet-connection"), {
  ssr: false,
  loading: () => (
    <div className="p-4 border-t">
      <div className="animate-pulse flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="ml-3 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-3 bg-gray-300 rounded w-28"></div>
        </div>
      </div>
    </div>
  ),
});

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 bg-white dark:bg-gray-800 shadow-md lg:block">
      <div className="flex flex-col h-full">
        <Link href="/">
          <div className="flex items-center justify-center h-16 border-b border-r dark:border-gray-700 gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Car className="h-8 w-8 text-amber-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              VintageChain
            </h1>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li>
              <Link
                href="/mechanic"
                className={`flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 ${
                  pathname === "/mechanic" ? "bg-amber-100" : ""
                }`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/mechanic/dashboard"
                className={`flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 ${
                  pathname === "/mechanic/dashboard" ? "bg-amber-100" : ""
                }`}
              >
                <BellDot className="w-5 h-5 mr-3" />
                Service Requests
              </Link>
            </li>
            <li>
              <Link
                href="/mechanic/add-service"
                className={`flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 ${
                  pathname === "/mechanic/add-service" ? "bg-amber-100" : ""
                }`}
              >
                <Plus className="w-5 h-5 mr-3" />
                Add Service
              </Link>
            </li>
          </ul>
        </nav>
        <WalletConnection />
      </div>
    </div>
  );
};

export default Sidebar;
