"use client";

import { useEffect, useState } from "react";
import FacetecApp from "@/facetec/Facetec";
import { useFacetecDataStore } from "@/stores/useFacetecDataStore";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import VerificationProgress from "./_components/verification-progress";

export type VerificationStatus = "verifying" | "success" | "failed";

export default function UserVerification() {
	const [verificationStatus, setVerificationStatus] =
		useState<VerificationStatus>("verifying");

	const formattedScanData = useFacetecDataStore((state) => state.formattedData);
	const isSuccessfullyMatched = useFacetecDataStore(
		(state) => state.isSuccessfullyMatched
	);
	const isCompletelyDone = useFacetecDataStore(
		(state) => state.isCompletelyDone
	);

	useEffect(() => {
		const verifyDetails = async () => {
			if (!isCompletelyDone) return;
			if (!formattedScanData.idNumber || !isSuccessfullyMatched) {
				toast({
					title: "Please complete the FaceTec scan first",
					variant: "destructive",
					duration: 5000,
					// icon: <AlertCircle className="h-6 w-6" />,
					description:
						"You must complete the FaceTec scan before verifying your profile.",
				});
				return setVerificationStatus("failed");
			}

			const requestBody = { ...formattedScanData, isSuccessfullyMatched };
			let fullName;
			if (formattedScanData.firstName && !formattedScanData.lastName) {
				fullName = `${formattedScanData.firstName}`;
				delete requestBody.firstname;
			} else if (!formattedScanData.firstName && formattedScanData.lastName) {
				fullName = `${formattedScanData.lastName}`;
				delete requestBody.lastName;
			} else if (formattedScanData.firstName && formattedScanData.lastName) {
				fullName = `${formattedScanData.firstName} ${formattedScanData.lastName}`;
				delete requestBody.firstName;
				delete requestBody.lastName;
			}

			//remove commas from fullName
			fullName = fullName?.replace(/,/g, "");
			requestBody.fullName = fullName;

			console.log(requestBody);

			try {
				const response = await axios.post("/api/verify-document", requestBody);
				const data = response.data;
				console.log({ data });
				setVerificationStatus("success");
				toast({
					title: "Profile Verified",
					variant: "default",
					description: "Your profile has been successfully verified.",
				});
			} catch (error) {
				console.error(error);
				setVerificationStatus("failed");
			}
		};
		verifyDetails();
	}, [formattedScanData, isCompletelyDone, isSuccessfullyMatched]);

	// const handleSubmit = (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	setVerificationStatus("verifying");
	// 	// Simulate API call
	// 	setTimeout(() => {
	// 		setVerificationStatus("success");
	// 		// handle the form submission and API response here
	// 	}, 2000);
	// };

	return (
		<>
			{isCompletelyDone && isSuccessfullyMatched ? (
				<VerificationProgress verificationStatus={verificationStatus} />
			) : (
				<div className="container mx-auto p-4 min-h-full grid items-center">
					<FacetecApp />
					{/* <Card className="max-w-2xl mx-auto border-2 border-amber-900">
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
													<span className="font-semibold">Click to upload</span>{" "}
													or drag and drop
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
							{verificationStatus === "verifying" && (
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
					</Card> */}
				</div>
			)}
		</>
	);
}
