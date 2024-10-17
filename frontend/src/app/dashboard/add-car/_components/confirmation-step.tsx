import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { addCarFormSchema } from "@/schema";
import { useMintCar } from "@/hooks/useMintCar";
import { useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { usegeneratedTokenURI } from "../../../../../stores/useGeneratedTokenURI";

const ConfirmationStep = ({
	formData,
	setIsCompleted,
	setStatus,
}: {
	formData: z.infer<typeof addCarFormSchema>;
	setIsCompleted: Dispatch<SetStateAction<boolean>>;
	setStatus: Dispatch<SetStateAction<string>>;
}) => {
	const { mintCar, isMintPending, mintDataHash, mintError } = useMintCar();
	const [toastId, setToastId] = useState<string | number>(0);
	const generatedTokenURI = usegeneratedTokenURI(
		(state) => state.generatedTokenURI
	);

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash: mintDataHash,
		});

	useEffect(() => {
		if (isMintPending) {
			const newToastId = toast.loading("Waiting for approval from wallet...");
			// console.log(toastId)
			setToastId(newToastId);
			console.log("Transaction is pending...");
		}
		if (isConfirming) {
			if (toastId) toast.dismiss(toastId);
			const newToastId = toast.loading(
				"Waiting for confirmation on the blockchain..."
			);
			setToastId(newToastId);
			console.log("Waiting for confirmation...");
		}
		if (isConfirmed) {
			console.log("Transaction confirmed!");
			toast.success("Registration successful!", { id: toastId });
			setStatus("success");
			setIsCompleted(true);
		}
		if (mintError) {
			toast.error("Failed to mint", { id: toastId });
			setIsCompleted(false);
		}
	}, [isMintPending, isConfirming, isConfirmed, mintError]);

	const handleMint = async () => {
		// Implement the minting logic here
		console.log("Minting NFT...");
		mintCar(formData.vin, generatedTokenURI);
	};
	return (
		<div className="space-y-4">
			<h3 className="font-medium">Summary</h3>
			<div className="bg-gray-50 p-4 rounded-lg">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-500">Make</p>
						<p className="font-medium">{formData.make}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Model</p>
						<p className="font-medium">{formData.model}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Year</p>
						<p className="font-medium">{formData.year}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">VIN</p>
						<p className="font-medium">{formData.vin}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Exterior Condition</p>
						<p className="font-medium">{formData.exteriorCondition}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Interior Condition</p>
						<p className="font-medium">{formData.engineCondition}</p>
					</div>
					<div className="col-span-2">
						<p className="text-sm text-gray-500">Description</p>
						<p className="font-medium">{formData.description}</p>
					</div>
				</div>
			</div>
			<div className="mt-4">
				<Button disabled={isMintPending ||isConfirming || isConfirmed } onClick={handleMint} type="button" className="w-full">
					Mint Car NFT
				</Button>
			</div>
		</div>
	);
};

export default ConfirmationStep;
