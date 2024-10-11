"use client";

import { featuredCars } from "@/lib/constants";
import React, { useState } from "react";
import { CarCard } from "./CarCard";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";

export const FeaturedCars = () => {
  const route = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);

  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleClick = (id: number) => {
    route.push(`/car-details/${id}`);
  };

  return (
    <div className="py-4 mx-2">
      <div className="container mx-auto">
        <div className="mb-12 max-w-md mx-auto">
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Price Range (ETH)
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-amber-600 mt-2">
            <span>{priceRange[0]} ETH</span>
            <span>{priceRange[1]} ETH</span>
          </div>
        </div>
        <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
          Featured Listings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {sortedCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
              onClick={() => handleClick(car.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
