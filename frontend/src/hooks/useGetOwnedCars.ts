import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { multicall } from "@wagmi/core";
import axios from "axios";
import {
	VINTAGE_CAR_NFT_ABI,
	VINTAGE_CAR_NFT_ADDRESS,
} from "@/contracts/VintageCarNFT";
import { toast } from "sonner";
import { useOwnCarStore } from "../../stores/useOwnCarsStore";

type Attributes = {
	trait_type: string;
	value: string;
};
const CORRECT_CHAIN_ID = 84532;

export function useGetOwnedCars() {
	const setCarsLoading = useOwnCarStore(state => state.setFetchCarsLoading)

	const getAllOwnedTokens = async () => {
		setCarsLoading(true)
		try {
			const result = await readContract(config, {
				abi: VINTAGE_CAR_NFT_ABI,
				address: VINTAGE_CAR_NFT_ADDRESS,
				functionName: "getNFTsOwnedBy",
				args: ['0x6c8fcDeb117a1d40Cd2c2eB6ECDa58793FD636b1'],
				chainId: CORRECT_CHAIN_ID,
			});
			return result;
		} catch (error) {
			setCarsLoading(false)
			toast.error(`Error fetching owned tokens: ${error}`)
		}
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
						setCarsLoading(false)
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
						setCarsLoading(false)
						console.error("Error fetching metadata:", error);
						return null;
					}
				})
			);
            console.log({carData})

			return carData.filter((car) => car);
		}
		setCarsLoading(false)
		return [];
	};

	return { getAllOwnedTokens, getAllcarsDetails };
}
