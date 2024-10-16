"use client";

import { Bell, Menu, LogOut, LogIn, Wrench } from "lucide-react";
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
import { motion } from "framer-motion";

const MechanicsDashboardHeader = () => {
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
				<Button variant="ghost" size="icon" className="lg:hidden mr-2">
					<Menu className="h-6 w-6" />
				</Button>
				<Link href="/">
          <div className="flex items-center justify-center h-16 border-b border-r dark:border-gray-700 gap-2">
          <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Wrench className="h-8 w-8 text-amber-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              MechanicsHub
            </h1>
          </div>
        </Link>
			</div>
			<div className="flex items-center space-x-4">
				<Input
					type="search"
					placeholder="Search services..."
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
									<AvatarImage src="" alt="@mechanic" />
									<AvatarFallback className="bg-amber-500">ME</AvatarFallback>
								</Avatar>
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link href="/dashboard/mechanics">Your Services</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/dashboard/mechanics/add-service">Add Service</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/dashboard/mechanics/service-requests">Service Requests</Link>
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

export default MechanicsDashboardHeader;
