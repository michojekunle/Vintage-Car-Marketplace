import React, { useEffect, useState } from "react";
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
import { ComboboxForm } from "./combobox-form";


const conditionOptions = ["Excellent", "Good", "Fair", "Poor", "Terrible"];
const VehicleDetailsStep = ({
	form,
}: {
	form: UseFormReturn<IAddCarValues, undefined>;
}) => {
	const [yearOptions, setYearOptions] = useState<VehicleOptionsProp[]>([]);
	const [makeOptions, setMakeOptions] = useState<VehicleOptionsProp[]>([]);
	const [modelOptions, setModelOptions] = useState<VehicleOptionsProp[]>([]);

	const yearValue = form.watch("year");
	const makeValue = form.watch("make");

	useEffect(() => {
		async function fetchYear() {
			try {
				const response = await fetch("/api/car-years");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				const yearsOption = [];

				for (let i = data.Years.min_year; i <= data.Years.max_year; i++) {
					yearsOption.push({ label: i.toString(), value: i.toString() });
				}

				// console.log(yearsOption);
				setYearOptions(yearsOption);
			} catch (err) {
				console.log("Failed to fetch car makes", err);
			}
		}

		fetchYear();
	}, [form]);

	useEffect(() => {
		async function fetchMakes() {
			if (!yearValue) return;
			try {
				const response = await fetch(`/api/car-makes/?year=${yearValue}`);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				const makesOption = [];

				for (let i = 0; i < data.Makes.length; i++) {
					makesOption.push({
						label: data.Makes[i].make_display,
						value: data.Makes[i].make_id,
					});
				}

				// console.log(makesOption);
				setMakeOptions(makesOption);
			} catch (err) {
				console.log("Failed to fetch car makes", err);
			} finally {
				form.setValue("make", "");
			}
		}

		fetchMakes();
	}, [yearValue]);

	useEffect(() => {
		async function fetchModel() {
			if (!yearValue || !makeValue) return form.setValue("model", "");
			try {
				const response = await fetch(
					`/api/car-models/?year=${yearValue}&make=${makeValue}`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				const modelsOption = [];

				for (let i = 0; i < data.Models.length; i++) {
					modelsOption.push({
						label: data.Models[i].model_name,
						value: data.Models[i].model_name,
					});
				}

				// console.log(modelsOption);
				setModelOptions(modelsOption);
			} catch (err) {
				console.log("Failed to fetch car makes", err);
			} finally {
				form.setValue("model", "");
			}
		}

		fetchModel();
	}, [yearValue, makeValue]);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="year"
					render={({ field }) => (
						<ComboboxForm
							form={form}
							field={field}
							options={yearOptions}
							fieldName={"Year"}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name="make"
					render={({ field }) => (
						<ComboboxForm
							form={form}
							field={field}
							options={makeOptions}
							fieldName={"Make"}
						/>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="model"
					render={({ field }) => (
						<ComboboxForm
							form={form}
							field={field}
							options={modelOptions}
							fieldName={"Model"}
						/>
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
