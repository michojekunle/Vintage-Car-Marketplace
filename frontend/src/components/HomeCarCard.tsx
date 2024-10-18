"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { useCarStore } from "@/stores/useCarStore";

const MotionCard = motion(Card);

interface Listing {
  tokenId: bigint;
  seller: string;
  price: bigint;
  isActive: boolean;
  listingType: number;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  };
}

interface ICarCard {
  car: Listing;
  onClick?: () => void;
}

export const HomeCarCard: React.FC<ICarCard> = ({ car, onClick }) => {
  const setSelectedCar = useCarStore(
    (state: { setSelectedCar: (car: IListing | null) => void }) =>
      state.setSelectedCar
  );

  const getAttributeValue = (traitType: string) => {
    const attribute = car?.metadata?.attributes?.find(
      (attr) => attr.trait_type === traitType
    );
    return attribute ? attribute.value : "N/A";
  };

  const handleClick = () => {
    setSelectedCar(car);
    if (onClick) {
      onClick();
    }
  };

  return (
    <MotionCard
      className="relative bg-white border border-neutral-100 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-amber-600 transition-shadow duration-300 flex flex-col justify-between text-left"
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={car.metadata.image}
        alt={car.metadata.name}
        width={300}
        height={200}
        className="flex justify-center w-full min-h-[200px] max-h-[200px] object-contain bg-[#fbf8ed]"
        priority
      />
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2">{car?.metadata?.name}</h4>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Make: </span>
          {getAttributeValue("Make")}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Model: </span>
          {getAttributeValue("Model")}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Year: </span>
          {getAttributeValue("Year")}
        </p>
        <p className="text-primary-action font-bold">
          {Number(car?.price) / 1e18} ETH
        </p>
      </div>
      <p
        className={`absolute py-1 px-2 rounded-md right-2 top-2 text-xs font-semibold ${
          getAttributeValue("Verified")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {getAttributeValue("Verified") ? "Verified" : "Unverified"}
      </p>
    </MotionCard>
  );
};
