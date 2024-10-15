import { ethers } from "ethers";
import { create } from "zustand";
import { abi as marketplaceAbi } from "../abi/marketPlace.json";
import { getProvider } from "@/services/provider";

const multicallAbi = [
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[])",
];

const MARKETPLACE_ADDRESS = "0x887136e9Db3CDC8C1d45644e48DAD5DcdB71170d";
const MULTICALL_ADDRESS =
  process.env.NEXT_MULTICALL_ADDRESS ??
  "0x7F41b9A82BE6eB20EFD4C1030255FeaE0A442913";

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
  listings: [],
  setListings: (listings) => set({ listings }),
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
            // If the call was successful
            const decodedResult =
              marketplaceContract.interface.decodeFunctionResult(
                "getListing",
                result[1]
              );
            return {
              tokenId: index.toString(),
              seller: decodedResult.seller,
              price: decodedResult.price,
              isActive: decodedResult.isActive,
              listingType: decodedResult.listingType,
            };
          }
          return null;
        })
        .filter(
          (listing: { isActive: boolean }): listing is Listing =>
            listing !== null && listing.isActive
        );

      set({ listings });
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  },
}));
