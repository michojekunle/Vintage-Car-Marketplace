import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/app/contracts/VintageCarNFT";
import { toast } from "sonner";
export const CORRECT_CHAIN_ID = 84532;

export function useNFTApproval() {
  const { address, isConnected, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();

  // Helper function to check if the wallet is connected
  const checkConnectionAndChain = useCallback(async () => {
    if (!isConnected) {
      // toast("Please connect your wallet.");
      toast.error("Please connect your wallet.");
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
          await writeFunction(...args);
      }
    };
  };

  const {
    writeContract: approvalCarRaw,
    data: approvalTxHash,
    isPending: isApprovalPending,
    isSuccess: approvalSuccess,
    error: approvalError,
  } = useWriteContract();

  const approveCarNft = wrapWithConnectionAndChainCheck(
    (address: string, tokenId: number) =>
      approvalCarRaw({
        address: VINTAGE_CAR_NFT_ADDRESS,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "approve",
        args: [address, tokenId],
      })
  );

  return {
    approveCarNft,
    approvalTxHash,
    isApprovalPending,
    approvalSuccess,
    approvalError,
  };
}
