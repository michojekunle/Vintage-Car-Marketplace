"use client";

import { featuredCars } from "@/lib/constants";
import React from "react";
import { CarCard } from "./CarCard";
import { useRouter } from "next/navigation";

export const FeaturedCars = () => {
  const route = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);

  const handleClick = (id: number) => {
    route.push(`/car-details/${id}`);
  };

  return (
    <div className="py-12 mx-2">
      <div className="container mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-5 lg:mb-10 bg-card-bg py-5">
          Featured Vintage Cars
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
