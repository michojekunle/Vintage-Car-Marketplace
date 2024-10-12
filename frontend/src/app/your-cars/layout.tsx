
import { ReactNode } from "react";

import Sidebar from "./_components/sidebar";
import DashboardHeader from "./_components/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {

	return (
		<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
			{/* Sidebar */}
			<Sidebar/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<DashboardHeader/>
				{/* Main content area */}
				<main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
					{children}
				</main>
			</div>
		</div>
	);
}
