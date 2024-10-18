"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArchiveX, Loader2 } from "lucide-react";
import { CustomSlider } from "./CustomSlider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HomeCarCard } from "./HomeCarCard";

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

interface IFeatured {
  cars: Listing[];
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  totalCars: number;
  loading?: boolean;
}

export const FeaturedCars: React.FC<IFeatured> = ({
  cars,
  priceRange,
  setPriceRange,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  totalCars,
  loading,
}) => {
  const router = useRouter();

  const handleClick = (tokenId: bigint) => {
    router.push(`/car-details/?id=${tokenId.toString()}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalCars);

  return (
    <section id="marketplace" className="mx-2 px-4 sm:px-10 md:px-16">
      <div className="container mx-auto">
        <div className="mb-12 max-w-md mx-auto">
          <div className="pt-6">
            <h4 className="text-lg font-semibold text-secondary-action mb-4">
              Price Range (ETH)
            </h4>
            <CustomSlider
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
        {loading ? (
          <div className="flex justify-center items-center min-h-[10vh]">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          </div>
        ) : cars?.length > 0 && !loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {cars.map((car) => (
                <HomeCarCard
                  key={car.tokenId.toString()}
                  car={car}
                  onClick={() => handleClick(car.tokenId)}
                />
              ))}
            </div>
            <div className="mt-8 w-full flex justify-between items-center">
              <p className="text-sm text-gray-600 mb-4">
                Showing {startIndex}-{endIndex} of {totalCars} cars
              </p>
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(currentPage - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-amber-100"
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index} className="cursor-pointer">
                        <PaginationLink
                          className="hover:bg-amber-100"
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(Math.min(currentPage + 1, totalPages))
                        }
                        className={
                          currentPage === totalPages
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-amber-100"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <ArchiveX size={44} className="text-red-400" />
            <p className="text-center text-lg font-medium text-text-body">
              No cars found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
