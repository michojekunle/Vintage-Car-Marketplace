"use client";

import { SearchInput } from "./common/SearchInput";

export const SearchCar = () => {
  return (
    <div className="bg-white my-10 mx-20 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-text-header text-center">
        Find Your Dream Vintage Car
      </h3>
      <div className="flex space-x-4">
        <SearchInput
          placeholder="Make, Model or Year"
          handleSearch={() => {}}
        />
      </div>
    </div>
  );
};
