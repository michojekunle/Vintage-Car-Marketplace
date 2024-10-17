// import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import {
  VINTAGE_CAR_MARKETPLACE_ABI,
  VINTAGE_CAR_MARKETPLACE_ADDRESS,
} from "@/contracts/VintageCarMarketplace";

const CORRECT_CHAIN_ID = 84532;

export function useGetListings() {
  //   const { address } = useAccount();

  const getListing = async (tokenId: number) => {
    const result = (await readContract(config, {
      address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
      abi: VINTAGE_CAR_MARKETPLACE_ABI,
      functionName: "getListing",
      args: [tokenId],
      chainId: CORRECT_CHAIN_ID,
    })) as IListing;
    return result;
  };

  const getUserListings = async () => {
    // const result = await readContract(config, {
    //   address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
    //   abi: VINTAGE_CAR_MARKETPLACE_ABI,
    //   functionName: "getNFTsOwnedBy",
    //   args: [address],
    //   chainId: CORRECT_CHAIN_ID,
    // });
    // return result;
  };

  const getAllListings = async () => {
    // implement getAll listings function with
    return;
  };

  return { getListing, getUserListings, getAllListings };
}
