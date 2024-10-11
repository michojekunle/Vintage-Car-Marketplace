import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { AddCarSchema } from "@/schema";

const ConfirmationStep = ({
	formData,
}: {
	formData: z.infer<typeof AddCarSchema>;
}) => {
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
				</div>
			</div>
			<div className="mt-4">
				<Button type="button" className="w-full">Mint NFT and List Car</Button>
			</div>
		</div>
	);
};

export default ConfirmationStep;
