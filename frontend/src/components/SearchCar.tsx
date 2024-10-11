"use client";
import FilterCar from "./FilterCar";

export const SearchCar = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/5 bg-white my-5 lg:my-10 mx-3 lg:mx-20 p-6 rounded-lg shadow-md ">
        <h3 className="text-lg lg:text-2xl font-bold mb-4 text-text-header text-center">
          NFT Marketplace
        </h3>
        <p className="text-center my-4">
          Explore our curated collection of classic cars, each represented as a
          unique NFT. These digital assets provide proof of ownership and a
          detailed history of each vehicle.
        </p>
        <FilterCar />
      </div>
    </div>
  );
};
