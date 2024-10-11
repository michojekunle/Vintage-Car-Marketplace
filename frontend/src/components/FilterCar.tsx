"use client";
import React, { useState } from "react";
import { SearchInput } from "./SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { filterOptions } from "@/lib/constants";

export default function FilterCar() {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-1 items-center md:space-x-4">
      <div className="w-full md:w-4/5">
        <SearchInput placeholder="Search..." handleSearch={() => {}} />
      </div>

      <div className="w-full md:w-1/5">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:border-none outline-none text-white rounded-xl p-3 bg-primary-action w-full flex items-center justify-between">
            {selectedFilter || "Filter by"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option, index) => (
              <React.Fragment key={option}>
                <DropdownMenuItem onSelect={() => setSelectedFilter(option)}>
                  {option}
                </DropdownMenuItem>
                {index < filterOptions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
