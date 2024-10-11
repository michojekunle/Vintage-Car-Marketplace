import * as z from "zod";

export const AddCarSchema = z.object({
	make: z.string().min(1, "Make is required"),
	model: z.string().min(1, "Model is required"),
	year: z.string().refine(
		(val) => {
			const year = parseInt(val);
			return year >= 1886 && year <= new Date().getFullYear();
		},
		{
			message: "Year must be between 1886 and current year",
		}
	),
	vin: z.string().length(17, "VIN must be exactly 17 characters"),
    description: z.string().min(20, "Description too short")
});