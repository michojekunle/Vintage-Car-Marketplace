import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { multicall } from "@wagmi/core";
import axios from "axios";
import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/contracts/VintageCarNFT";
import { formatCarData } from "@/lib/utils";

const CORRECT_CHAIN_ID = 84532;

export function useGetOwnedCars() {
  const { address } = useAccount();

  const getAllOwnedTokens = async () => {
    const result = await readContract(config, {
      abi: VINTAGE_CAR_NFT_ABI,
      address: VINTAGE_CAR_NFT_ADDRESS,
      functionName: "getNFTsOwnedBy",
      args: [address],
      chainId: CORRECT_CHAIN_ID,
    });
    return result;
  };

  const getAllcarsDetails = async () => {
    const allTokensOwned = (await getAllOwnedTokens()) as [];
    if (allTokensOwned.length > 0) {
      const contractsData: any[] = allTokensOwned.map((id) => ({
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "tokenURI",
        args: [id],
      }));

      const uris = await multicall(config, {
        contracts: contractsData,
      });

      const carData = await Promise.all(
        uris?.map(async (uri, index) => {
          try {
            const response = await axios.get(uri?.result as string);
            const data = response.data;
            return formatCarData(allTokensOwned[index], data);
          } catch (error) {
            console.error("Error fetching metadata:", error);
            return null;
          }
        })
      );
      console.log({ carData });

      return carData.filter((car) => car);
    }
    return [];
  };

  const getCarDetail = async (tokenId: number) => {
    if (tokenId >= 0) {
      const uri = await readContract(config, {
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "tokenURI",
        args: [tokenId],
      });

      let carData;
      try {
        const response = await axios.get(uri as string);
        const data = response.data;
        carData = formatCarData(tokenId, data);
        return carData;
      } catch (error) {
        console.error("Error fetching metadata:", error);
        return null;
      }
    }
    return [];
  };

  return { getAllOwnedTokens, getAllcarsDetails, getCarDetail };
}
