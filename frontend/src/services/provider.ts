import { ethers } from "ethers";

export const getProvider = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    console.warn("MetaMask not detected. Using fallback provider.");
    return new ethers.JsonRpcProvider(process.env.NEXT_JSON_RPC_PROVIDER);
  }
};
