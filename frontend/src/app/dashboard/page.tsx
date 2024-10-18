"use client";
import React, { useEffect } from "react";
import { CarCard } from "../../components/CarCard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOwnedCars } from "@/hooks/useGetOwnedCars";
import { useOwnCarStore } from "../../../stores/useOwnCarsStore";
// import useDashboardStore from "@/stores/useDashboardStore";

export default function Dashboard() {
  const router = useRouter();
  const { getAllcarsDetails } = useGetOwnedCars();
  const setOwnCars = useOwnCarStore((state) => state.setOwnCars);
  const ownCars = useOwnCarStore((state) => state.ownCars);
  const carsLoading = useOwnCarStore((state) => state.fetchCarsLoading);

  const handleClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  console.log("from state", ownCars);

  useEffect(() => {
    // if (address) {
    const getAllCars = async () => {
      const cardata = await getAllcarsDetails();
      setOwnCars(cardata as any); // Type assertion to fix the type mismatch
      console.log("from here", cardata);
    };
    getAllCars();
    //   toast.error("Please connect your wallet");
    // }
  }, []);

  return (
    <div className="">
      <div className="container">
        <Tabs
          defaultValue="bought"
          className="text-md font-bold text-left mb-6"
        >
          <TabsList className="grid w-[220px] sm:w-[300px] grid-cols-2 mb-10">
            <TabsTrigger
              className="text-sm lg:text-md text-left mb-6 "
              value="bought"
            >
              All Cars
            </TabsTrigger>
            <TabsTrigger
              className="text-sm lg:text-md text-left mb-6"
              value="listed"
            >
              Cars Listed
            </TabsTrigger>
          </TabsList>
          {carsLoading ? (
            <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
            </div>
          ) : (
            <div>
              <TabsContent value="bought">
                {ownCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                    {ownCars.map((car) => (
                      <div onClick={() => handleClick(car.id)} key={car.id}>
                        <CarCard {...car} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
                    <p className="text-gray-500">No cars found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="listed">
                {ownCars.filter((car) => car.listed).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ownCars
                      .filter((car) => car.listed)
                      .map((car) => (
                        <div onClick={() => handleClick(car.id)} key={car.id}>
                          <CarCard {...car} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
                    <p className="text-gray-500">No cars found</p>
                  </div>
                )}
              </TabsContent>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
