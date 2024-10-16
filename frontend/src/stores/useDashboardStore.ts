import { create } from "zustand";
import { useReadContract, useAccount } from "wagmi";
import { abi } from "../abi/CarNFTabi";
import { toast } from "@/hooks/use-toast";

interface DashboardStore {
  carsOwned: any[];
  fetchCarsOwned: () => void;
  isLoading: boolean;
  isError: boolean;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  carsOwned: [],
  isLoading: false,
  isError: false,
  fetchCarsOwned: () => {
    const { address } = useAccount();
    const contractAddress = "0x9E2f97f35fB9ab4CFe00B45bEa3c47164Fff1C16";

    if (!address) {
      toast({
        title: "Please connect your wallet",
      });
      return;
    }

    try {
      const { data: fetchedCarsOwned, isError, isLoading } = useReadContract({
        abi,
        address: contractAddress,
        functionName: "getNFTsOwnedBy",
        args: [address],
      });

      set({ carsOwned: fetchedCarsOwned as any[], isLoading: isLoading, isError: isError });
    } catch (error) {
      console.error("Error fetching car details:", error);
    //   set({ isLoading: false, isError: true });
      toast({
        title: "Error fetching car details",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  },
}));

export default useDashboardStore;
