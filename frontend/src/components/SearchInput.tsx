"use client";

import { FC } from "react";
import { Search, X } from "lucide-react";

export const SearchInput: FC<ISearchInput> = ({
  placeholder,
  handleSearch,
  value,
  deleteSearchValue,
}) => {
  return (
    <div className="relative w-full py-2 px-4 flex items-center gap-2 border-2 rounded-full">
      <Search className="w-5 h-5 text-primary" />
      <input
        placeholder={placeholder}
        onChange={handleSearch}
        value={value}
        className="border-none w-full text-base py-2 leading-[19.2px] placeholder:text-base placeholder:text-text-body-50 text-text-body bg-transparent focus:outline-none"
      />
      <div className="absolute right-3 flex">
        {value && (
          <button
            type="button"
            className="cursor-pointer"
            onClick={deleteSearchValue}
          >
            <X className="w-4 h-4 text-primary" />
            <span className="hidden">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
