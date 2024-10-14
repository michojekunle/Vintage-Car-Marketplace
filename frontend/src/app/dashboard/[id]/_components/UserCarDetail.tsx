"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { listingFormSchema } from "@/schema";
import { CheckIcon } from "lucide-react";
import UnlistCarDialog from "./unlist-car-dialog";
import ListCarDialog from "./list-car-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ListingFormValues = z.infer<typeof listingFormSchema>;
const defaultValues: Partial<ListingFormValues> = {
	listingType: "normalSale",
	enableBuyout: false,
	durationUnit: "hours",
};

const UserCarDetail = () => {
	const [loading, setLoading] = useState(true);
	const [isListed, setIsListed] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		// Simulate data fetching or loading delay
		setTimeout(() => setLoading(false), 1500);
	}, []);

	const form = useForm<ListingFormValues>({
		resolver: zodResolver(listingFormSchema),
		defaultValues,
	});

	function onSubmit(data: ListingFormValues) {
		console.log({ data });
		console.log("listing...");
		if (data.listingType === "auction") {
			if (data.enableBuyout) {
				if (!data.buyoutPrice)
					return form.setError("buyoutPrice", {
						type: "manual",
						message: "Buyout Price is required",
					});
			}
			if (!data.startingPrice)
				return form.setError("startingPrice", {
					type: "manual",
					message: "Starting Price is required",
				});

			if (!data.duration || !data.durationUnit)
				return form.setError("duration", {
					type: "manual",
					message: "Auction duration is required",
				});
		}
		if (data.listingType === "normalSale") {
			if (!data.salePrice)
				return form.setError("salePrice", {
					type: "manual",
					message: "Sale Price is required",
				});
		}

		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<div className="flex float-right h-6 w-6 items-center justify-center rounded-full bg-green-500 text-green-50">
						<CheckIcon className="h-5 w-5" />
					</div>
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
		setIsListed(true);
		setIsDialogOpen(false);
	}

	function handleUnlist() {
		setIsListed(false);
		toast({
			title: "Vehicle Unlisted",
			description: "Your vehicle has been successfully unlisted.",
		});
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				{/* Back to Marketplace */}
				<div className="mb-4">
					<Button
						variant="ghost"
						className="text-primary-action hover:underline flex items-center gap-2"
						onClick={() => router.back()}
					>
						<ArrowLeft className="w-5 h-5" />
						Back to Dashboard
					</Button>
				</div>

				{/* Car Details Section */}
				<div className="bg-white shadow-md rounded-lg overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
						{/* Car Image */}
						<div className="flex justify-center items-center">
							<Image
								width={400}
								height={300}
								alt="Vintage Car"
								src="/car.jpeg"
								className="rounded-lg object-cover"
							/>
						</div>

						{/* Car Information */}
						<div className="space-y-4">
							<h2 className="text-3xl font-bold text-gray-800">
								Mercedes Benz C300
							</h2>
							<p className="text-xl text-green-600">$30,000</p>
							<div className="text-sm text-gray-600">
								<p>
									<strong>VIN:</strong> 12345ABCDEFG67890
								</p>
								<p>
									<strong>Year:</strong> 2015
								</p>
								<p className="flex items-center gap-1">
									<strong>Condition:</strong> Excellent
									<Check className="text-green-500 w-4 h-4" />
								</p>
								<p>
									<strong>Service History:</strong> Up-to-date
								</p>
								<p
									className={`${
										isListed
											? "text-green-600 bg-green-100"
											: "text-amber-600 bg-amber-100"
									} py-1 mt-2 px-4 w-[max-content]`}
								>
									<strong>{isListed ? "Listed" : "Not Listed"}</strong>
								</p>
							</div>

							{/* Auction or Buyout Options */}
							<div className="space-y-2">
								{isListed ? (
									<UnlistCarDialog handleUnlist={handleUnlist} />
								) : (
									<ListCarDialog
										form={form}
										isDialogOpen={isDialogOpen}
										setIsDialogOpen={setIsDialogOpen}
										onSubmit={onSubmit}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Car Service History and Mechanic Services */}
				<section className="mt-8">
					<h3 className="text-2xl font-semibold text-gray-800 mb-4">
						Service History
					</h3>
					<div className="bg-white shadow-md rounded-lg p-4">
						<ul className="space-y-2 text-gray-600">
							<li>Service Date: 01/02/2024 - Oil Change & Brake Check</li>
							<li>Service Date: 12/10/2023 - Full Detailing</li>
							<li>Service Date: 08/15/2023 - Transmission Service</li>
						</ul>
					</div>

					<h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
						Available Mechanic Services
					</h3>
					<div className="bg-white shadow-md rounded-lg p-4">
						<p className="text-gray-700">
							Book a certified mechanic for repair or maintenance services
							directly through our platform.
						</p>
						<Button className="mt-4 bg-primary-action text-white">
							Book a Mechanic
						</Button>
					</div>
				</section>
			</main>
		</div>
	);
};

export default UserCarDetail;
