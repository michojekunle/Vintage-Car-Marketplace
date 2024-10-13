"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, CheckCircle, AlertCircle } from "lucide-react";
import FacetecApp from "@/facetec/Facetec";
import { useFacetecDataStore } from "@/store/useFacetecDataStore";
import axios from "axios";
export default function UserVerification() {
	const [verificationStatus, setVerificationStatus] = useState<
		"idle" | "pending" | "success" | "error"
	>("idle");

	const formattedScanData = useFacetecDataStore((state) => state.formattedData);

	// console.log({facetecData})

	useEffect(() => {
		// console.log({formattedScanData})
		if (!formattedScanData.idNumber) return;
		const verifyDetails = async () => {
			const requestBody = { ...formattedScanData };
			let fullname;
			if (formattedScanData.firstName && !formattedScanData.lastName) {
				fullname = `${formattedScanData.firstName}`;
				delete requestBody.firstname;
			} else if (!formattedScanData.firstName && formattedScanData.lastName) {
				fullname = `${formattedScanData.lastName}`;
				delete requestBody.lastName;
			} else if (formattedScanData.firstName && formattedScanData.lastName) {
				fullname = `${formattedScanData.firstName} ${formattedScanData.lastName}`;
				delete requestBody.firstName;
				delete requestBody.lastName;
			}

			//remove comma from fullname
			fullname = fullname?.replace(/,/g, "");
			requestBody.fullName = fullname;

			try {
				const response = await axios.post(
					"/api/verify-profile",
					requestBody
				);
				// if (!response.ok) throw new Error("Failed to verify profile");
				const data = response.data;
				console.log({ data });
				setVerificationStatus("success");
			} catch (error) {
				console.error(error);
				setVerificationStatus("error");
			}
		};
		verifyDetails();
	}, [formattedScanData]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setVerificationStatus("pending");
		// Simulate API call
		setTimeout(() => {
			setVerificationStatus("success");
			// handle the form submission and API response here
		}, 2000);
	};

	return (
		<div className="container mx-auto p-4 min-h-screen">
			<FacetecApp />
			<Card className="max-w-2xl mx-auto border-2 border-amber-900">
				<CardHeader className="bg-amber-100">
					<CardTitle className="text-2xl font-bold text-amber-900">
						Verify Your Profile
					</CardTitle>
					<CardDescription className="text-amber-700">
						Complete the form below to verify your account and unlock all
						features of the Vintage Car Marketplace.
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName" className="text-amber-900">
									First Name
								</Label>
								<Input
									id="firstName"
									placeholder="John"
									className="border-amber-300 focus:border-amber-500"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-amber-900">
									Last Name
								</Label>
								<Input
									id="lastName"
									placeholder="Doe"
									className="border-amber-300 focus:border-amber-500"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="dob" className="text-amber-900">
								Date of Birth
							</Label>
							<Input
								id="dob"
								type="date"
								className="border-amber-300 focus:border-amber-500"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address" className="text-amber-900">
								Address
							</Label>
							<Textarea
								id="address"
								placeholder="Enter your full address"
								className="border-amber-300 focus:border-amber-500"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="idType" className="text-amber-900">
								ID Type
							</Label>
							<Select required>
								<SelectTrigger className="border-amber-300 focus:border-amber-500">
									<SelectValue placeholder="Select ID type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="passport">Passport</SelectItem>
									<SelectItem value="driverlicense">
										Driver&apos;s License
									</SelectItem>
									<SelectItem value="nationalid">National ID</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="idUpload" className="text-amber-900">
								Upload ID Document
							</Label>
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="idUpload"
									className="flex flex-col items-center justify-center w-full h-32 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<CloudUpload className="w-8 h-8 mb-3 text-amber-700" />
										<p className="mb-2 text-sm text-amber-700">
											<span className="font-semibold">Click to upload</span> or
											drag and drop
										</p>
										<p className="text-xs text-amber-600">
											PNG, JPG or PDF (MAX. 5MB)
										</p>
									</div>
									<Input
										id="idUpload"
										type="file"
										className="hidden"
										accept=".png,.jpg,.jpeg,.pdf"
										required
									/>
								</label>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between items-center pt-6 bg-amber-100">
					<Button
						type="submit"
						onClick={handleSubmit}
						className="bg-amber-600 hover:bg-amber-700 text-white"
					>
						Submit for Verification
					</Button>
					{verificationStatus === "pending" && (
						<div className="flex items-center text-amber-600">
							<AlertCircle className="mr-2" />
							Verification in progress...
						</div>
					)}
					{verificationStatus === "success" && (
						<div className="flex items-center text-green-600">
							<CheckCircle className="mr-2" />
							Verification successful!
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
