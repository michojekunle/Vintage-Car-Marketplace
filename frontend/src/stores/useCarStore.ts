import { ethers } from "ethers";
import { create } from "zustand";
import { abi as marketplaceAbi } from "@/abi/marketPlace.json";
import { getProvider } from "@/services/provider";

const multicallAbi = [
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[])",
];

const MARKETPLACE_ADDRESS = "0x887136e9Db3CDC8C1d45644e48DAD5DcdB71170d";
const MULTICALL_ADDRESS = "0x7F41b9A82BE6eB20EFD4C1030255FeaE0A442913";

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
  listings: [],
  setListings: (listings) => set({ listings }),
  auctions: [],
  setAuctions: (auctions) => set({ auctions }),
  fetchListings: async () => {
    try {
      const provider = await getProvider();
      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        marketplaceAbi,
        provider
      );
      const multicallContract = new ethers.Contract(
        MULTICALL_ADDRESS,
        multicallAbi,
        provider
      );

      const totalSupply = await marketplaceContract.totalSupply();
      const calls = [];

      for (let i = 0; i < totalSupply.toNumber(); i++) {
        calls.push({
          target: MARKETPLACE_ADDRESS,
          callData: marketplaceContract.interface.encodeFunctionData(
            "getListing",
            [i]
          ),
        });
      }

      const multicallResult = await multicallContract.tryAggregate(
        false,
        calls
      );

      const listings: Listing[] = multicallResult
        .map((result: any, index: number) => {
          if (result[0]) {
            const decodedResult =
              marketplaceContract.interface.decodeFunctionResult(
                "getListing",
                result[1]
              );
            return {
              tokenId: index.toString(),
              ...decodedResult,
            };
          }
          return null;
        })
        .filter(
          (listing: { isActive: boolean }): listing is Listing =>
            listing !== null && listing.isActive
        );

      // auctions
      const auctionListings = listings.filter(
        (listing) => listing.listingType === 1
      );

      set({
        listings: listings.filter((listing) => listing.listingType === 0),
      });
      set({ auctions: auctionListings });
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  },
}));
