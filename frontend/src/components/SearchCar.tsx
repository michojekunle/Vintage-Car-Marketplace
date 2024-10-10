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

export const SearchCar = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <div className="flex justify-center">
      <div className="w-2/4 bg-white my-10 mx-20 p-6 rounded-lg shadow-md ">
        <h3 className="text-2xl font-bold mb-4 text-text-header text-center">
          Find Your Dream Vintage Car
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-4/5">
            <SearchInput placeholder="Search..." handleSearch={() => {}} />
          </div>

          <div className="w-1/5">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:border-none outline-none text-white rounded-xl p-3 bg-primary-action w-full flex items-center justify-between">
                {selectedFilter || "Filter by"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filterOptions.map((option, index) => (
                  <React.Fragment key={option}>
                    <DropdownMenuItem
                      onSelect={() => setSelectedFilter(option)}
                    >
                      {option}
                    </DropdownMenuItem>
                    {index < filterOptions.length - 1 && (
                      <DropdownMenuSeparator />
                    )}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
