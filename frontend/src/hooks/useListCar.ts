import { useCallback } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
	VINTAGE_CAR_MARKETPLACE_ABI,
	VINTAGE_CAR_MARKETPLACE_ADDRESS,
} from "@/app/contracts/VintageCarMarketplace";
import { toast } from "sonner";
const CORRECT_CHAIN_ID = 84532;


export function useListCar() {
	const { address, isConnected, chain } = useAccount();
	const { openConnectModal } = useConnectModal();
	const { switchChain } = useSwitchChain();

	// Helper function to check if the wallet is connected
	const checkConnectionAndChain = useCallback(async () => {
		if (!isConnected) {
			// toast("Please connect your wallet.");
			toast.error("Please connect your wallet.")
			openConnectModal?.();
			return false;
		}
		if (chain?.id !== CORRECT_CHAIN_ID) {
			toast.error("Switching to the correct network...");
			try {
				switchChain({ chainId: CORRECT_CHAIN_ID });
				return false;
			} catch (error) {
				console.error("Failed to switch network:", error);
				// toast.error("Failed to switch network. Please switch manually.");
				toast.error("Failed to switch network. Please switch manually.");
				return false;
			}
		}
		return true;
	}, [isConnected, openConnectModal, chain, switchChain, address]);

	const wrapWithConnectionAndChainCheck = (writeFunction: any) => {
		return async (...args: any) => {
			if (await checkConnectionAndChain()) {
				return writeFunction(...args);
			}
		};
	};

	const {
		writeContract: listCarRaw,
		data: listDataHash,
		isPending: islistPending,
		error: listError,
	} = useWriteContract();

	const listCarWithFixedPrice = wrapWithConnectionAndChainCheck(
		(tokenId: number, price: number) =>
			listCarRaw({
				address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
				abi: VINTAGE_CAR_MARKETPLACE_ABI,
				functionName: "createFixedPriceListing",
				args: [tokenId, price],
			})
	);

    const listCarWithAuction = wrapWithConnectionAndChainCheck(
		(tokenId: number, startingPrice: number, buyoutPrice: number, duration: number) =>
			listCarRaw({
				address: VINTAGE_CAR_MARKETPLACE_ADDRESS,
				abi: VINTAGE_CAR_MARKETPLACE_ABI,
				functionName: "createAuctionListing",
				args: [tokenId, startingPrice, buyoutPrice, duration],
			})
	);

	return { listCarWithFixedPrice, listCarWithAuction, listDataHash, islistPending, listError };
}
