import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Gavel } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { liveAuctions } from "@/lib/constants";
import CountdownTimer from "./CountdownTimer";

const MotionCard = motion(Card);
const LiveAuction = () => {
  return (
    <section id="auctions" className="py-12 px-4 sm:px-10 md:px-16">
      <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
        Live Auction
      </h3>

      <p className="text-amber-700 mb-8 text-center text-xl max-w-3xl mx-auto">
        Experience the thrill of bidding on rare and valuable classic cars. Our
        live auction platform allows you to participate in real-time bidding
        wars for the most sought-after vehicles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10">
        {liveAuctions.map((auction) => (
          <MotionCard
            key={auction.id}
            className="relative bg-white border border-neutral-100 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-amber-600 transition-shadow duration-300 flex flex-col justify-between text-left"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base md:text-lg gap-2">
                <span>{auction.name}</span>
                <CountdownTimer initialTime={auction.timeLeft} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={auction.image}
                alt={auction.name}
                width={200}
                height={200}
                className="w-full min-h-[200px] max-h-[200px] object-cover rounded-md mb-6"
              />
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-700 font-medium text-base md:text-lg">
                  Current Bid
                </span>
                <span className="text-xl font-semibold text-amber-800">
                  {auction.currentBid}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-secondary-action hover:bg-amber-600 text-white text-base font-medium py-4">
                <Gavel className="h-6 w-6 mr-2" />
                Place Bid
              </Button>
            </CardFooter>
          </MotionCard>
        ))}
      </div>
    </section>
  );
};

export default LiveAuction;
