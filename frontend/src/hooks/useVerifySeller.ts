import { useCallback } from "react";
import { useAccount, useSwitchChain } from "wagmi";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useToast } from "./use-toast";

const CORRECT_CHAIN_ID = "";

console.log(CORRECT_CHAIN_ID);

export function useCoursePayment() {
	const { address, isConnected, chain } = useAccount();
	const { openConnectModal } = useConnectModal();
	const { switchChain } = useSwitchChain();
	const { toast } = useToast();

	// Helper function to check if the wallet is connected
	const checkConnectionAndChain = useCallback(async () => {
		if (!isConnected) {
			// toast("Please connect your wallet.");
			toast({
				title: "Please connect your wallet.",
				variant: "destructive",
			});
			openConnectModal?.();
			return false;
		}
		if (chain?.id !== CORRECT_CHAIN_ID) {
			toast({
				title: "Unsupported chain",
				variant: "destructive",
				description: "Switching to the correct network...",
			});
			try {
				switchChain({ chainId: CORRECT_CHAIN_ID });
				return false;
			} catch (error) {
				console.error("Failed to switch network:", error);
				// toast.error("Failed to switch network. Please switch manually.");
				toast({
					title: "Failed to switch network. Please switch manually.",
					variant: "destructive",
				});
				return false;
			}
		}
		return true;
	}, [isConnected, openConnectModal, chain, switchChain, address]);

	return { checkConnectionAndChain };
}
