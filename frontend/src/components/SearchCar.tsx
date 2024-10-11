"use client";
import React, { useState } from "react";
import FilterCar from "./FilterCar";

export const SearchCar = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <div className="flex justify-center">
      <div className="w-2/4 bg-white my-10 mx-20 p-6 rounded-lg shadow-md ">
        <h3 className="text-2xl font-bold mb-4 text-text-header text-center">
          Find Your Dream Vintage Car
        </h3>
        <FilterCar />
      </div>
    </div>
  );
};
