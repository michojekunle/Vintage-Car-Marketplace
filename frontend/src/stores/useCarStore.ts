import { ethers } from "ethers";
import { create } from "zustand";
import { abi as marketplaceAbi } from "@/abi/marketPlace.json";
import { getProvider } from "@/services/provider";

const multicallAbi = [
  "function aggregate((address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
];

const MARKETPLACE_ADDRESS = "0x6782c1E2bb9fEeD99A4ac155F8521250601b383e";
const MULTICALL_ADDRESS = "0x7F41b9A82BE6eB20EFD4C1030255FeaE0A442913";

const fetchActiveListings = async (set: any) => {
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

    const calls = [];
    let tokenId = 0;
    const batchSize = 1000;

    while (true) {
      const batchCalls = [];
      for (let i = 0; i < batchSize; i++) {
        batchCalls.push({
          target: MARKETPLACE_ADDRESS,
          callData: marketplaceContract.interface.encodeFunctionData(
            "getListing",
            [tokenId + i]
          ),
        });
      }

      const [, returnData] = await multicallContract.aggregate.staticCall(
        batchCalls
      );

      let allInvalid = true;
      for (let i = 0; i < batchSize; i++) {
        try {
          const decodedResult =
            marketplaceContract.interface.decodeFunctionResult(
              "getListing",
              returnData[i]
            );
          if (decodedResult && decodedResult.isActive) {
            allInvalid = false;
            calls.push(batchCalls[i]);
          }
        } catch (error) {
          console.log({ error });
        }
      }

      if (allInvalid) {
        break; // end of valid token IDs
      }

      tokenId += batchSize;
    }

    const [, multicallResult] = await multicallContract.aggregate.staticCall(
      calls
    );

    const listings: Listing[] = multicallResult
      .map((returnData: string, index: number) => {
        try {
          const decodedResult =
            marketplaceContract.interface.decodeFunctionResult(
              "getListing",
              returnData
            );
          return {
            tokenId: (tokenId + index).toString(),
            ...decodedResult,
          };
        } catch (error) {
          console.log({ error });
          return null;
        }
      })
      .filter(
        (listing: Listing | null): listing is Listing =>
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
