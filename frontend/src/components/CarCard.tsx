'use client'
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { useCarStore } from "../../stores/useCarStore";
import { useReadContract, useAccount } from 'wagmi'
import { abi } from '../lib/CarNFTabi'
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const MotionCard = motion(Card);

export const CarCard = ({
  id,
  image,
  name,
  make,
  model,
  year,
  rating,
  reviews,
  condition,
  price,
  serviceHistory,
  listed,
  onClick,
}: ICarCard) => {
  const setSelectedCar = useCarStore((state) => state.setSelectedCar);
  const contractAddress = '0x26950e95ED15b4B172D600d31f4dcA60127C6dF4'
  const { address } = useAccount()

  const handleClick = () => {
    setSelectedCar({
      image,
      name,
      make,
      model,
      serviceHistory,
      condition,
      year,
      rating,
      reviews,
      price,
      listed,
      id: id,
    });

    if (onClick) {
      onClick();
    }
  };

  const { data: carDetails, isError, isLoading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getCarDetails',
    args: [1]
  })
  if (!isLoading && carDetails) {
    console.log('Car details:', carDetails)
  }

  useEffect(() => {
    if (isError) {
      console.error('Error fetching car details:', carDetails, isError)
      toast({
        title: "Error fetching car details",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
    if (carDetails) {
      console.log('Car details:', carDetails)
    }
  }, [carDetails, isError])

  useEffect(() => {
    if (!address) {
      toast({
        title: "Please connect your wallet"
      })
    }
  }, [address])
  

  return (
    <MotionCard
      className="relative bg-white border border-neutral-100 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-amber-600 transition-shadow duration-300 flex flex-col justify-between text-left"
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={image}
        alt={name}
        width={300}
        height={200}
        className="flex justify-center w-full min-h-[200px] max-h-[200px] object-contain bg-[#fbf8ed]"
        priority
      />
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2">{name}</h4>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Make: </span>
          {make}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Model: </span>
          {model}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Year: </span>
          {year}
        </p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
              fill={i < rating ? "currentColor" : "none"}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({reviews} reviews)
          </span>
        </div>
        <p className="text-primary-action font-bold">{price} ETH</p>
      </div>
      <p
        className={`absolute py-1 px-2 rounded-md right-2 top-2 text-xs font-semibold ${listed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
      >
        {listed ? "Listed" : "Sold"}
      </p>

    </MotionCard>
  );
};
