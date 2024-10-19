import { create } from "zustand";
import { multicall } from "@wagmi/core";
import { config } from "@/app/wagmi";

import {
  VINTAGE_CAR_MARKETPLACE_ABI,
  VINTAGE_CAR_MARKETPLACE_ADDRESS,
} from "@/contracts/VintageCarMarketplace";

import {
  VINTAGE_CAR_AUCTION_ADDRESS,
  VINTAGE_CAR_AUCTION_ABI,
} from "@/contracts/VintageCarAuction";

import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/contracts/VintageCarNFT";

const BATCH_SIZE = 1000;

const fetchActiveListings = async (set: (state: Partial<CarStore>) => void) => {
  set({ loading: true });
  try {
    const allListings: Map<bigint, any> = new Map();
    let batch = 0;
    let hasMore = true;

    while (hasMore) {
      const startIndex = batch * BATCH_SIZE;
      const marketplaceCalls: any = Array.from(
        { length: BATCH_SIZE },
        (_, i) => ({
          address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
          abi: VINTAGE_CAR_MARKETPLACE_ABI,
          functionName: "listings",
          args: [BigInt(startIndex + i)],
        })
      );

      const auctionCalls: any = Array.from({ length: BATCH_SIZE }, (_, i) => ({
        address: VINTAGE_CAR_AUCTION_ADDRESS,
        abi: VINTAGE_CAR_AUCTION_ABI,
        functionName: "auctions",
        args: [BigInt(startIndex + i)],
      }));

      const marketplaceResults: any = await multicall(config, {
        contracts: marketplaceCalls,
      });

      const auctionResults = await multicall(config, {
        contracts: auctionCalls,
      });

      const batchListings = marketplaceResults
        .map((result: any, index: number) => ({
          tokenId: BigInt(startIndex + index),
          seller: result.result[1],
          price: result.result[2],
          isActive: result.result[3],
          listingType: Number(result.result[4]),
        }))
        .filter((listing: any) => listing.isActive);

      const batchAuctions = auctionResults
        .map((result: any, index: number) => ({
          tokenId: BigInt(startIndex + index),
          startingPrice: result.result[2],
          highestBid: result.result[3],
          highestBidder: result.result[4],
          auctionEndTime: result.result[5],
          buyoutPrice: result.result[6],
          active: result.result[7],
        }))
        .filter((auction: any) => auction.active);

      // Fetch metadata for active listings and auctions
      const activeItems = [...batchListings, ...batchAuctions];
      const metadataCalls: any = activeItems.map((item) => ({
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "tokenURI",
        args: [item.tokenId],
      }));

      const metadataResults = await multicall(config, {
        contracts: metadataCalls,
      });

      const itemsWithMetadata = await Promise.all(
        activeItems.map(async (item, index) => {
          const tokenURI: any = metadataResults[index].result;
          try {
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            return { ...item, metadata };
          } catch (error) {
            console.error(
              `Error fetching metadata for token ${item.tokenId}:`,
              error
            );
            return item;
          }
        })
      );

      // Update allListings map, prioritizing auction entries
      itemsWithMetadata.forEach((item) => {
        if (item.active || !allListings.has(item.tokenId)) {
          allListings.set(item.tokenId, item);
        }
      });

      if (activeItems.length < BATCH_SIZE) {
        hasMore = false;
      }

      batch++;
    }

    set({ listings: Array.from(allListings.values()) });
    set({ loading: false });
  } catch (error) {
    console.error("Error fetching listings:", error);
    set({ listings: [] });
    set({ loading: false });
  }
};

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
  listings: [],
  setListings: (listings) => set({ listings }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  fetchListings: () => fetchActiveListings(set),
}));
