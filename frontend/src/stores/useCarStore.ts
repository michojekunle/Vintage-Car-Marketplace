import { create } from "zustand";
import { multicall } from "@wagmi/core";
import { config } from "@/app/wagmi";

import {
  VINTAGE_CAR_MARKETPLACE_ABI,
  VINTAGE_CAR_MARKETPLACE_ADDRESS,
} from "@/contracts/VintageCarMarketplace";

import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/contracts/VintageCarNFT";

const BATCH_SIZE = 1000;

const fetchActiveListings = async (set: (state: Partial<CarStore>) => void) => {
  try {
    let allListings: any[] = [];
    let batch = 0;
    let hasMore = true;

    while (hasMore) {
      const startIndex = batch * BATCH_SIZE;
      const marketplaceCalls = Array.from({ length: BATCH_SIZE }, (_, i) => ({
        address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
        abi: VINTAGE_CAR_MARKETPLACE_ABI,
        functionName: "listings",
        args: [BigInt(startIndex + i)],
      }));

      const marketplaceResults = await multicall(config, {
        contracts: marketplaceCalls,
      });

      const batchListings = marketplaceResults
        .map((result: any, index) => ({
          tokenId: BigInt(startIndex + index),
          seller: result.result[1],
          price: result.result[2],
          isActive: result.result[3],
          listingType: Number(result.result[4]),
        }))
        .filter((listing: any) => listing.isActive);

      // Fetch metadata for active listings
      const metadataCalls = batchListings.map((listing) => ({
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "tokenURI",
        args: [listing.tokenId],
      }));

      const metadataResults = await multicall(config, {
        contracts: metadataCalls,
      });

      const listingsWithMetadata = await Promise.all(
        batchListings.map(async (listing, index) => {
          const tokenURI: any = metadataResults[index].result;
          try {
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            return { ...listing, metadata };
          } catch (error) {
            console.error(
              `Error fetching metadata for token ${listing.tokenId}:`,
              error
            );
            return listing;
          }
        })
      );

      allListings = [...allListings, ...listingsWithMetadata];

      if (batchListings.length < BATCH_SIZE) {
        hasMore = false;
      }

      batch++;
    }

    set({ listings: allListings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    set({ listings: [] });
  }
};

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
  listings: [],
  setListings: (listings) => set({ listings }),
  auctions: [],
  setAuctions: (auctions) => set({ auctions }),
  fetchListings: () => fetchActiveListings(set),
}));
