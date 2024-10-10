"use client";

import { featuredCars } from "@/lib/constants";
import React from "react";
import { CarCard } from "./CarCard";
import { useRouter } from "next/navigation";

export const FeaturedCars = () => {
  const route = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);

  const handleClick = (id: number) => {
    route.push(`/cars/${id}`);
  };

  return (
    <div className="py-12 bg-gray-200">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Featured Vintage Cars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
