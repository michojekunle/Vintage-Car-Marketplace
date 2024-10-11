"use client";

import React from "react";
import { CarCard } from "./CarCard";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";

export const FeaturedCars = ({
  cars,
  priceRange,
  setPriceRange,
}: IFeatured) => {
  const route = useRouter();
  const sortedCars = cars.toSorted((a, b) => b.reviews - a.reviews);

  const handleClick = (id: number) => {
    route.push(`/car-details/${id}`);
  };

  return (
    <section id="marketplace" className="mx-2">
      <div className="container mx-auto">
        <div className="mb-12 max-w-md mx-auto">
          <div className="pt-6">
            <h4 className="text-lg font-semibold text-secondary-action mb-4">
              Price Range
            </h4>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm font-medium text-secondary-action">
                <span className="text-2xl font-bold">{priceRange[0]}</span> ETH
              </div>
              <div className="text-sm font-medium text-secondary-action">
                <span className="text-2xl font-bold">{priceRange[1]}</span> ETH
              </div>
            </div>
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
    </section>
  );
};
