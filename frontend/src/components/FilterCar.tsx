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
import { makeOptions, modelOptions } from "@/lib/constants";

export default function FilterCar() {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-1 items-center md:space-x-4">
      <div className="w-full md:w-4/5">
        <SearchInput placeholder="Search..." handleSearch={() => {}} />
      </div>

      <div className="w-full flex items-center gap-2 md:w-1/5">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:border-none outline-amber-700 text-amber-800 p-3  w-full flex items-center justify-between border border-amber-700">
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
          <DropdownMenuTrigger className="focus:border-none outline-amber-700 text-amber-800 p-3  w-full flex items-center justify-between border border-amber-700">
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
