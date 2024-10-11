import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const conditionOptions = ["Excellent", "Good", "Fair", "Poor", "Terrible"];
const VehicleDetailsStep = ({
	form,
}: {
	form: UseFormReturn<IAddCarValues, undefined>;
}) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="make"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Make</FormLabel>
							<FormControl>
								<Input placeholder="e.g., Ford" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="model"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Model</FormLabel>
							<FormControl>
								<Input placeholder="e.g., Mustang" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="year"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Year</FormLabel>
							<FormControl>
								<Input placeholder="e.g., 1965" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="vin"
					render={({ field }) => (
						<FormItem>
							<FormLabel>VIN</FormLabel>
							<FormControl>
								<Input placeholder="Vehicle Identification Number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="exteriorCondition"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Exterior Condition</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select exterior condition " />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{conditionOptions.map((condition) => (
										<SelectItem value={condition} key={condition}>
											{condition}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="engineCondition"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Engine Condition</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select engine condition " />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{conditionOptions.map((condition) => (
										<SelectItem value={condition} key={condition}>
											{condition}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="">
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="This vehicle is ..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};

export default VehicleDetailsStep;
