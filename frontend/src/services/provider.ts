import { ethers } from "ethers";

let provider: ethers.BrowserProvider | ethers.JsonRpcProvider;

export const getProvider = async () => {
  if (!provider) {
    if (typeof window !== "undefined" && window.ethereum) {
      // Lazy load the provider when the user explicitly connects
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      console.warn("MetaMask not detected. Using fallback provider.");
      provider = new ethers.JsonRpcProvider(process.env.NEXT_JSON_RPC_PROVIDER);
    }
  }
  return provider;
};

export const connectWallet = async () => {
  try {
    const currentProvider = await getProvider();
    await currentProvider.send("eth_requestAccounts", []);
    return currentProvider;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
};
