"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuctionStore } from "@/stores/useAuctionStore";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { parseEther } from "viem";

export const BidDialog = ({ auction }: any) => {
  const [bidAmount, setBidAmount] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const { placeBid } = useAuctionStore();
  const { address } = useAccount();

  const handleBidSubmit = async () => {
    if (!address) {
      toast.error("Please connect your wallet to place a bid.");
      return;
    }

    if (!bidAmount || isNaN(parseFloat(bidAmount))) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    if (parseFloat(bidAmount) <= Number(auction.highestBid) / 1e18) {
      toast.error("Your bid must be higher than the current highest bid.");
      return;
    }

    setIsLoading(true);
    try {
      const bidAmountWei = parseEther(bidAmount);

      const transaction: any = await placeBid(
        auction.tokenId,
        bidAmountWei,
        address
      );
      toast.success(
        `Bid placed successfully! Transaction hash: ${transaction.transactionHash}`
      );
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error(`Error placing bid: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-secondary-action">Place Bid</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            Enter the amount you want to bid for{" "}
            {auction?.metadata?.name || `Car #${auction.tokenId}`}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bid-amount" className="text-right">
              Bid Amount (ETH)
            </label>
            <Input
              id="bid-amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="col-span-3"
              min={(Number(auction.highestBid) / 1e18 + 0.01).toString()}
              step="0.01"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-secondary-action"
            onClick={handleBidSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidDialog;
