import { create } from "zustand";
import {
  multicall,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/app/wagmi";

import {
  VINTAGE_CAR_AUCTION_ADDRESS,
  VINTAGE_CAR_AUCTION_ABI,
} from "@/contracts/VintageCarAuction";

import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/contracts/VintageCarNFT";

const BATCH_SIZE = 100;

export interface IAuction {
  tokenId: bigint;
  seller: string;
  startingPrice: bigint;
  highestBid: bigint;
  highestBidder: string;
  auctionEndTime: bigint;
  buyoutPrice: bigint;
  active: boolean;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  };
}

interface AuctionStore {
  auctions: IAuction[];
  setAuctions: (auctions: IAuction[]) => void;
  fetchAuctions: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  placeBid: (
    tokenId: bigint,
    amount: any,
    address: `0x${string}`
  ) => Promise<void>;
}

const fetchActiveAuctions = async (
  set: (state: Partial<AuctionStore>) => void
) => {
  set({ loading: true });
  try {
    let allAuctions: IAuction[] = [];
    let batch = 0;
    let hasMore = true;

    while (hasMore) {
      const startIndex = batch * BATCH_SIZE;
      const auctionCalls: any = Array.from({ length: BATCH_SIZE }, (_, i) => ({
        address: VINTAGE_CAR_AUCTION_ADDRESS,
        abi: VINTAGE_CAR_AUCTION_ABI,
        functionName: "auctions",
        args: [BigInt(startIndex + i)],
      }));

      const auctionResults = await multicall(config, {
        contracts: auctionCalls,
      });

      const batchAuctions = auctionResults
        .map((result: any, index) => ({
          tokenId: BigInt(startIndex + index),
          seller: result.result[0],
          startingPrice: result.result[2],
          highestBid: result.result[3],
          highestBidder: result.result[4],
          auctionEndTime: result.result[5],
          buyoutPrice: result.result[6],
          active: result.result[7],
        }))
        .filter((auction: IAuction) => auction.active);

      // Fetch metadata for active auctions
      const metadataCalls: any = batchAuctions?.map((auction) => ({
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "tokenURI",
        args: [auction.tokenId],
      }));

      const metadataResults = await multicall(config, {
        contracts: metadataCalls,
      });

      const auctionsWithMetadata = await Promise.all(
        batchAuctions?.map(async (auction, index) => {
          const tokenURI: any = metadataResults[index].result;
          try {
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            return { ...auction, metadata };
          } catch (error) {
            console.error(
              `Error fetching metadata for token ${auction.tokenId}:`,
              error
            );
            return auction;
          }
        })
      );

      allAuctions = [...allAuctions, ...auctionsWithMetadata];

      if (batchAuctions.length < BATCH_SIZE) {
        hasMore = false;
      }

      batch++;
    }

    set({ auctions: allAuctions });
    set({ loading: false });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    set({ auctions: [] });
    set({ loading: false });
  }
};

export const useAuctionStore = create<AuctionStore>((set) => ({
  auctions: [],
  setAuctions: (auctions) => set({ auctions }),
  fetchAuctions: () => fetchActiveAuctions(set),
  loading: false,
  setLoading: (loading) => set({ loading }),
  placeBid: async (tokenId, amount, bidderAddress) => {
    try {
      if (!bidderAddress) {
        throw new Error("Bidder address is required");
      }

      const { hash }: any = await writeContract(config, {
        address: VINTAGE_CAR_AUCTION_ADDRESS,
        abi: VINTAGE_CAR_AUCTION_ABI,
        functionName: "placeBid",
        args: [tokenId],
        value: amount,
        account: bidderAddress,
      });

      await waitForTransactionReceipt(config, { hash });

      console.log(
        `Bid placed successfully for token ${tokenId} by ${bidderAddress}`
      );
      await fetchActiveAuctions(set);
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  },
}));
