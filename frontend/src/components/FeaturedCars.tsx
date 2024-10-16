"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveX, Loader } from "lucide-react"; // Import Loader icon
import { ethers } from "ethers";
import Image from "next/image";
import ABI from '../ABIs/vintageCarNFTContractABI.json';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CustomSlider } from "@/components/CustomSlider";

// Define the structure of an NFT object
interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
}

const CONTRACT_ADDRESS = "0x9E2f97f35fB9ab4CFe00B45bEa3c47164Fff1C16";

export const FeaturedCars = ({
  priceRange,
  setPriceRange,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  totalCars,
}: IFeatured) => {
  const router = useRouter();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const totalSupply = await contract.totalSupply();
      const nftData: NFT[] = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);

        const metadata = await fetch(tokenURI).then((res) => res.json());

        nftData.push({
          id: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  const handleClick = (id: string) => {
    router.push(`/car-details/?id=${id}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalCars);

  return (
    <section id="marketplace" className="mx-2 px-4 sm:px-10 md:px-16">
      <div className="container mx-auto">
        <div className="mb-12 max-w-md mx-auto">
          <div className="pt-6">
            <h4 className="text-lg font-semibold text-secondary-action mb-4">
              Price Range
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
        {loading ? ( // Show loading icon while fetching
          <div className="flex flex-col gap-2 items-center">
            <Loader size={44} className="text-blue-400 animate-spin" /> {/* Loading icon */}
            <p className="text-center text-lg font-medium text-text-body">
              Loading cars...
            </p>
          </div>
        ) : nfts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="border p-4 rounded shadow cursor-pointer"
                  onClick={() => handleClick(nft.id)}
                >
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={200}
                    height={200}
                    className="w-full h-64 object-cover rounded"
                  />
                  <h3 className="text-xl font-bold mt-2">{nft.name}</h3>
                  <p className="text-gray-600">{nft.description}</p>
                </div>
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
                        size={"default"}
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
                          size={"default"}
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
                        size={"default"}
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
