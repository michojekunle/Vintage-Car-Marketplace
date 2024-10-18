import { ethers } from "ethers";

export const getProvider = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // Fallback to a read-only provider
    return new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
  }
};
