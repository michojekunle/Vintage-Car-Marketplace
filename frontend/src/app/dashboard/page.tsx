"use client";

import { featuredCars } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { CarCard } from "../../components/CarCard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadContract, useAccount } from "wagmi";
import { abi } from "../../abi/CarNFTabi";
import { toast } from "sonner";
import { useGetOwnedCars } from "@/hooks/useGetOwnedCars";
import { useOwnCarStore, OwnCar } from "../../../stores/useOwnCarsStore";
// import useDashboardStore from "@/stores/useDashboardStore";

export default function Dashboard() {
  const router = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);
  const { address } = useAccount();
  const [imageError, setImageError] = useState(false);
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
        setOwnCars(cardata);
        console.log("from here", cardata);
      };
      getAllCars();
    // } else {
    //   toast.error("Please connect your wallet");
    // }
  }, []);

  return (
    <div className="mt-8">
      <div className="container">
        <Tabs defaultValue="bought" className="text-md font-bold text-left mb-6">
          <TabsList className="grid w-[25%] grid-cols-2 mb-10">
            <TabsTrigger className="text-md font-bold text-left mb-6" value="bought">
              Cars Bought
            </TabsTrigger>
            <TabsTrigger className="text-md font-bold text-left mb-6" value="listed">
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
                      <div onClick={() => handleClick(car.id)}>
                        <CarCard
                          key={car.id}
                          {...car}
                        />
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
                {ownCars.filter((car) => car.price).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ownCars
                      .filter((car) => car.price)
                      .map((car) => (
                        <div onClick={() => handleClick(car.id)}>
                          <CarCard
                            key={car.id}
                            {...car}
                          />
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
};
