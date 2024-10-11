"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	FormControl,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function ComboboxForm({
	field,
	options,
	fieldName,
	form,
}: IComboboxForm) {
    const [open, setOpen] = useState(false)

	return (
		<FormItem className="flex flex-col">
			<FormLabel>{fieldName}</FormLabel>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							variant="outline"
							role="combobox"
							className={cn(
								"w-full rounded-md justify-between",
								!field.value && "text-muted-foreground"
							)}
						>
							{field.value
								? options.find((option) => option.value === field.value)?.label
								: `Select ${fieldName.toLowerCase()} `}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput
							placeholder={`Search ${fieldName.toLowerCase()}... `}
						/>
						<CommandList>
							<CommandEmpty>No {fieldName.toLowerCase()} found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										value={option.label}
										key={option.value}
										onSelect={() => {
											form.setValue(
												fieldName.toLowerCase() as FieldProp,
												option.value
											);
                                            setOpen(false)
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												option.value === field.value
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</FormItem>
	);
}
