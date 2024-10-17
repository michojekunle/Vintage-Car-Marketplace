import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { VINTAGE_CAR_MARKETPLACE_ABI, VINTAGE_CAR_MARKETPLACE_ADDRESS } from "@/app/contracts/VintageCarMarketplace";

const CORRECT_CHAIN_ID = 84532;

export function useGetOwnedCars() {
  const { address } = useAccount();

  const getListing = async (tokenId: number) => {
    const result = await readContract(config, {
      address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
      abi: VINTAGE_CAR_MARKETPLACE_ABI,
      functionName: "getListing",
      args: [tokenId],
      chainId: CORRECT_CHAIN_ID,
    });
    return result;
  };

  const getUserListings = async () => {
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
            return formatCarData(allTokensOwned[index], data)
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

    const result = await readContract(config, {
      address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
      abi: VINTAGE_CAR_MARKETPLACE_ABI,
      functionName: "getNFTsOwnedBy",
      args: [address],
      chainId: CORRECT_CHAIN_ID,
    });
    return result;
  };

  const getAllListings = async () => {
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
            return formatCarData(allTokensOwned[index], data)
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

  return { getListing, getUserListings, getAllListings };
}
