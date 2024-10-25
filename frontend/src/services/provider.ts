import { ethers } from "ethers";

let cachedProvider: any = null;

export const getProvider = async (requestAccounts = false) => {
  if (typeof window !== "undefined" && window.ethereum) {
    if (requestAccounts && !cachedProvider) {
      // Requesting accounts explicitly if requestAccounts is true
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    // Use the cached provider if available, otherwise create a new one
    cachedProvider =
      cachedProvider || new ethers.BrowserProvider(window.ethereum);
    return cachedProvider;
  } else {
    // Fallback to a read-only provider
    return new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
  }
};
