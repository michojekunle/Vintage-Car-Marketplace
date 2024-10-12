"use client";
import React from "react";
import { SearchInput } from "./SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { makeOptions, modelOptions } from "@/lib/constants";

export default function FilterCar({
  searchTerm,
  setSearchTerm,
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
}: IFilterCar) {
  return (
    <div className="flex flex-col md:flex-row gap-1 items-center md:space-x-4">
      <div className="w-full md:w-4/5">
        <SearchInput
          placeholder="Search..."
          value={searchTerm}
          handleSearch={(e) => setSearchTerm(e.target.value)}
          deleteSearchValue={() => setSearchTerm("")}
        />
      </div>

      <div className="w-full flex items-center gap-2 md:w-1/5">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:border focus:border-amber-700 outline-amber-700 text-amber-800 p-3  w-full flex items-center justify-between border border-amber-700 rounded-full">
            {selectedMake || "Make"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {makeOptions.map((option, index) => (
              <React.Fragment key={option}>
                <DropdownMenuItem onSelect={() => setSelectedMake(option)}>
                  {option}
                </DropdownMenuItem>
                {index < makeOptions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:border focus:border-amber-700 outline-amber-700 text-amber-800 p-3  w-full flex items-center justify-between border border-amber-700 rounded-full">
            {selectedModel || "Model"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {modelOptions.map((option, index) => (
              <React.Fragment key={option}>
                <DropdownMenuItem onSelect={() => setSelectedModel(option)}>
                  {option}
                </DropdownMenuItem>
                {index < modelOptions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
