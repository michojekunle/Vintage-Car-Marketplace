"use client";

import { featuredCars } from "@/lib/constants";
import React from "react";
import { CarCard } from "../../components/CarCard";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const router = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);

  const handleClick = (id: number) => {
    router.push(`/your-cars/${id}`);
  };

  return (
    <div className="mt-8">
      <div className="container">
        <Tabs defaultValue="bought" className="text-md font-bold text-left mb-6">
          <TabsList className="grid w-[25%] grid-cols-2 mb-10">
            <TabsTrigger className="text-md font-bold text-left mb-6" value="bought">Cars Bought</TabsTrigger>
            <TabsTrigger className="text-md font-bold text-left mb-6" value="listed">Cars Listed</TabsTrigger>
          </TabsList>
          <TabsContent value="bought">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {featuredCars.map((car) => (
                <CarCard
                  key={car.id}
                  {...car}
                  onClick={() => handleClick(car.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedCars.map((car) => (
                <CarCard
                  key={car.id}
                  {...car}
                  onClick={() => handleClick(car.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {/* <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-left mb-6">
            Cars Listed
            </h3>
            <div className="w-[40vw] ml-auto mb-6">
                <FilterCar />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
              onClick={() => handleClick(car.id)}
            />
          ))}
        </div>
      </div> */}
        {/* <div className="container mx-auto mt-20">
        <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-left mb-6">
            Cars Bought
            </h3>
            <div className="w-[40vw] ml-auto mb-6">
                <FilterCar />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
              onClick={() => handleClick(car.id)}
            />
          ))}
        </div>
      </div> */}
      </div>
    </div>
  );
};
