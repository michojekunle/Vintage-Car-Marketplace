"use client";

import { featuredCars } from "@/lib/constants";
import React from "react";
import { CarCard } from "../../components/CarCard";
import { useRouter } from "next/navigation";
import FilterCar from "@/components/FilterCar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const router = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);

  const handleClick = (id: number) => {
    router.push(`/car-details`);
  };

  return (
    <div className="py-12">
      <div className="flex items-center justify-between container mx-auto">
        <div>
          <h2 className="font-bold text-[34px]">Welcome, Roheemah</h2>
          <p className="text-md font-medium">Platinum User</p>
        </div>
        {/* <div>
          <button className="text-white rounded-xl p-3 bg-primary-action font-bold" onClick={() => {router.push("/dashboard/add-new-car")}}>
            List New Car
          </button>
        </div> */}
      </div>
      <div className="container mx-auto mt-20">
        <Tabs defaultValue="bought" className="text-2xl font-bold text-left mb-6">
          <TabsList className="grid w-[50%] grid-cols-2 mb-10 mx-auto">
            <TabsTrigger className="text-2xl font-bold text-left mb-6" value="bought">Cars Bought</TabsTrigger>
            <TabsTrigger className="text-2xl font-bold text-left mb-6" value="listed">Cars Listed</TabsTrigger>
          </TabsList>
          <TabsContent value="bought">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
