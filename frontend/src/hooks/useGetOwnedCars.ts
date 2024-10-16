import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { multicall } from "@wagmi/core";
import axios from "axios";
import {
	VINTAGE_CAR_NFT_ABI,
	VINTAGE_CAR_NFT_ADDRESS,
} from "@/app/contracts/VintageCarNFT";

type Attributes = {
	trait_type: string;
	value: string;
};
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
			console.log({ uris });

			const carData = await Promise.all(
				uris?.map(async (uri, index) => {
					try {
						const response = await axios.get(uri?.result as string);
						const data = response.data;
                        console.log({data})
						return {
							id: Number(allTokensOwned[index]),
							name: data.name,
							make: data.attributes.find(
								(attribute: Attributes) => attribute.trait_type === "Make"
							).value,
							model: data.attributes.find(
								(attribute: Attributes) => attribute.trait_type === "Model"
							).value,
							year: data.attributes.find(
								(attribute: Attributes) => attribute.trait_type === "Year"
							).value,
							image: data.image,
							exteriorCondition: data.attributes.find(
								(attribute: Attributes) =>
									attribute.trait_type === "Exterior Condition"
							).value,
							engineCondition: data.attributes.find(
								(attribute: Attributes) =>
									attribute.trait_type === "Engine Condition"
							).value,
							allImages: data.properties.files,
						};
					} catch (error) {
						console.error("Error fetching metadata:", error);
						return null;
					}
				})
			);

			return carData.filter((car) => car);
		}
		return [];
	};

	return { getAllOwnedTokens, getAllcarsDetails };
}
