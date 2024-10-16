"use client";

import { featuredCars } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { CarCard } from "../../components/CarCard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadContract, useAccount } from "wagmi";
import { abi } from "../../abi/CarNFTabi";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const router = useRouter();
  const sortedCars = featuredCars.toSorted((a, b) => b.reviews - a.reviews);
  const contractAddress = "0x9E2f97f35fB9ab4CFe00B45bEa3c47164Fff1C16";
  const { address } = useAccount();
  const [carsOwned, setCarsOwned] = useState<any[]>([]);

  const handleClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };
  const { data: fetchedCarsOwned, isError, isLoading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getNFTsOwnedBy",
    args: [address],
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching car details:", carsOwned, isError);
      toast({
        title: "Error fetching car details",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    if (fetchedCarsOwned) {
      setCarsOwned(fetchedCarsOwned as any[]);
      console.log("Car details:", carsOwned);
    }
  }, [fetchedCarsOwned, isError]);

  useEffect(() => {
    if (!address) {
      toast({
        title: "Please connect your wallet",
      });
    }
  }, [address]);

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
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};
