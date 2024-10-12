import * as z from "zod";

export const addCarFormSchema = z.object({
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
	vin: z.string().min(6, "VIN must be at least 6 characters"),
    description: z.string().min(20, "Description too short"),
    engineCondition: z.string().min(1, "Condition is required"),
    exteriorCondition: z.string().min(1, "Condition is required")
});

export const listingFormSchema = z.object({
	listingType: z.enum(["normalSale", "auction"]),
	salePrice: z.string().optional(),
	enableBuyout: z.boolean().default(false),
	buyoutPrice: z.string().optional(),
	startingPrice: z.string().optional(),
	duration: z.string().optional(),
	durationUnit: z.enum(["minutes", "hours", "days"]).default("hours"),
}); 