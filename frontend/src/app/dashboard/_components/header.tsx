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
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const DashboardHeader = () => {
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
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Dashboard
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
								<Link href="/dashboard/your-cars">Your cars</Link>
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
	);
};

export default DashboardHeader;
