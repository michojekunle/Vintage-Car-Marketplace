"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArchiveX, Gavel } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { useAuctionStore } from "@/stores/useAuctionStore";

const MotionCard = motion(Card);

export const LiveAuction: React.FC = () => {
  const { auctions, fetchAuctions, placeBid } = useAuctionStore();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (tokenId: bigint, currentBid: bigint) => {
    const bidAmount = currentBid + BigInt(1e18);
    await placeBid(tokenId, bidAmount);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
          Live Auction
        </h3>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Experience the thrill of bidding on rare and valuable classic cars.
          Our live auction platform allows you to participate in real-time
          bidding wars for the most sought-after vehicles.
        </p>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {auctions && auctions?.length > 0 ? (
            auctions?.map((auction) => (
              <MotionCard
                key={auction.tokenId.toString()}
                className="overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base capitalize">
                      {auction?.metadata?.name || `Car #${auction?.tokenId}`}
                    </CardTitle>
                    <CountdownTimer
                      initialTime={auction.auctionEndTime.toString()}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Image
                    src={auction.metadata?.image || "/placeholder-image.jpg"}
                    alt={auction.metadata?.name || "Car image"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Current Bid</span>
                    <span>
                      {(Number(auction.highestBid) / 1e18).toFixed(2)} ETH
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handlePlaceBid(auction.tokenId, auction.highestBid)
                    }
                  >
                    <Gavel className="mr-2 h-4 w-4" /> Place Bid
                  </Button>
                </CardFooter>
              </MotionCard>
            ))
          ) : (
            <div className="flex flex-col gap-2 items-center self-center">
              <ArchiveX size={44} className="text-red-400" />
              <p className="text-center text-lg font-medium text-text-body">
                No cars found.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
