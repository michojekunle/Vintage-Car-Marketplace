"use client";
import FilterCar from "./FilterCar";

export const SearchCar = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/4 lg:w-2/4 bg-white my-5 lg:my-10 mx-3 lg:mx-20 p-6 rounded-lg shadow-md ">
        <h3 className="text-lg lg:text-2xl font-bold mb-4 text-text-header text-center">
          Find Your Dream Vintage Car
        </h3>
        <FilterCar />
      </div>
    </div>
  );
};
