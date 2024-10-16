import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { addCarFormSchema } from "@/schema";
import VehicleDetailsStep from "./vehicle-details-step";
import VerificationStep from "./verification-step";
import ImagesUploadStep from "./image-upload-step";
import ConfirmationStep from "./confirmation-step";
import { addCarSteps } from "@/lib/constants";
import axios from "axios";
// import { toast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddCarForm() {
	const [currentStep, setCurrentStep] = useState(4);
	const [isCompleted, setIsCompleted] = useState(false);
	const [status, setStatus] = useState("idle");
	const { address } = useAccount();
	const router = useRouter();
	console.log({ address });
	const form = useForm<z.infer<typeof addCarFormSchema>>({
		resolver: zodResolver(addCarFormSchema),
		defaultValues: {
			make: "",
			model: "",
			year: "",
			vin: "",
			description: "",
		},
	});

	async function onSubmit(values: z.infer<typeof addCarFormSchema>) {
		console.log(values);
		setStatus("loading");
		setCurrentStep(2);
		try {
			// Simulate contract call
			const response = await axios.post("/api/car-verify", {
				vin: values.vin,
				make: values.make,
				model: values.model,
				year: values.year,
				carOwner: address,
			});
			const data = response.data;
			console.log({ data });

			if (data?.message === "successfully verified") {
				toast.success(
					"Your Car details and ownership has been successfully verified"
				);
				setStatus("success");
			} else {
				setStatus("error");
				toast.error("An error occured verifying your car details");
			}
		} catch (error) {
			console.log(error);
			setStatus("error");
		}
	}

	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Add Your Vintage Car</h1>
				<p className="text-gray-600">
					List your classic automobile on our marketplace
				</p>
			</div>
			<div className="mb-8">
				<div className="relative flex items-center justify-between">
					<div className="absolute left-0 top-4 transform -translate-y-1/2 h-1 bg-gray-200 transition-all w-full" />
					<div
						className="absolute left-0 top-4 transform -translate-y-1/2 h-1 bg-amber-600 dark:bg-amber-400 transition-all"
						style={{
							width: `${((currentStep - 1) / (addCarSteps.length - 1)) * 100}%`,
						}}
					/>

					{/* Steps */}
					{addCarSteps.map((step) => (
						<div
							key={step.id}
							className="relative flex flex-col items-center z-10"
						>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${
									currentStep >= step.id
										? "border-amber-600 dark:border-amber-400 bg-amber-600 dark:bg-amber-400 text-white"
										: "border-gray-300 bg-white text-gray-300"
								}`}
							>
								{step.id}
							</div>
							<div
								className={`mt-2 text-sm transition-all ${
									currentStep >= step.id
										? "text-amber-600 dark:text-amber-400"
										: "text-gray-500"
								}`}
							>
								{step.name}
							</div>
						</div>
					))}
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{addCarSteps.find((s) => s.id === currentStep)?.name}
					</CardTitle>
					<CardDescription>
						{currentStep === 1 && "Enter your vehicle's details"}
						{currentStep === 2 && "Verifying ownership..."}
						{currentStep === 3 && "Upload images of your vintage car"}
						{currentStep === 4 && "Review and confirm your listing"}
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							{currentStep === 1 && <VehicleDetailsStep form={form} />}
							{currentStep === 2 && <VerificationStep status={status} />}
							{currentStep === 3 && (
								<ImagesUploadStep inputFormData={form.getValues()} />
							)}
							{currentStep === 4 && (
								<ConfirmationStep
									setStatus={setStatus}
									setIsCompleted={setIsCompleted}
									formData={form.getValues()}
								/>
							)}
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
								disabled={currentStep !== 1 ||  status === "success" || isCompleted}
							>
								Previous
							</Button>
							{currentStep === 1 ? (
								<Button type="submit">Next</Button>
							) : (
								<Button
									type="button"
									onClick={() => {
										if (currentStep === 4) {
											router.push("/dashboard/my-cars");
										} else {
											setCurrentStep((prev) => Math.min(4, prev + 1));
										}
									}}
									disabled={
										(currentStep === 4 && !isCompleted) ||
										(currentStep === 2 && status !== "success")
									}
								>
									{currentStep === 4 ? "Finish" : "Next"}
								</Button>
							)}
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
