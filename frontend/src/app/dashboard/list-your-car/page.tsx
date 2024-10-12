"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import UnlistCarDialog from "./_components/unlist-car-dialog";
import { listingFormSchema } from "@/schema";
import ListCarDialog from "./_components/list-car-dialog";
import { useState } from "react";
import { CheckIcon } from "lucide-react";

type ListingFormValues = z.infer<typeof listingFormSchema>;
const defaultValues: Partial<ListingFormValues> = {
	listingType: "normalSale",
	enableBuyout: false,
	durationUnit: "hours",
};

export default function ListYourCar() {
	const [isListed, setIsListed] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();

	const form = useForm<ListingFormValues>({
		resolver: zodResolver(listingFormSchema),
		defaultValues,
	});

	function onSubmit(data: ListingFormValues) {
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

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<h1 className="text-3xl font-bold mb-8">Add Your Car</h1>
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
	);
}
