"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Verified, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { useCarStore } from "@/stores/useCarStore";
import Link from "next/link";
import carMarketplaceAbi from "../../ABIs/marketPlaceContractABI.json";
import BidDialog from "@/components/BidDialog";
import CountdownTimer from "@/components/CountdownTimer";

// Use the contract address from environment variables
const CONTRACT_ADDRESS = "0x6782c1E2bb9fEeD99A4ac155F8521250601b383e";

const CarDetails: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { selectedCar } = useCarStore();
  const router = useRouter();

  // Manage the component's mounted state and loading animation
  useEffect(() => {
    setIsMounted(true);
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Early return for loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  // Early return if not mounted or car details are missing
  if (!isMounted || !selectedCar) return null;

  const handleListCarButtonClick = () => {
    router.push("/list-your-car");
  };

  // Utility to determine styling based on car condition
  const getConditionStyles = (condition: string | undefined) => {
    switch (condition) {
      case "Excellent":
        return { textColor: "text-green-500", iconColor: "text-green-500" };
      case "Good":
        return { textColor: "text-blue-500", iconColor: "text-blue-500" };
      case "Fair":
        return { textColor: "text-yellow-500", iconColor: "text-yellow-500" };
      case "Bad":
        return { textColor: "text-red-500", iconColor: "text-red-500" };
      default:
        return { textColor: "text-gray-500", iconColor: "text-gray-500" };
    }
  };

  const { textColor, iconColor } = getConditionStyles(selectedCar.condition);

  // Helper function to get the signer from the user's wallet
  const getSigner = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request access to accounts
    return provider.getSigner(); // Return the signer instance
  };

  // Buy car function with transaction handling
  const handleBuyNow = async () => {
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        carMarketplaceAbi,
        signer
      );
      const tx = await contract.buyCar(selectedCar.id, {
        value: ethers.parseEther(selectedCar.price.toString()),
      });
      // const gasEstimate = await contract.estimateGas.buyCar(selectedCar.id, {
      //   value: ethers.parseEther(selectedCar.price.toString()),
      // });
      // console.log("Estimated Gas:", gasEstimate);

      await tx.wait();
      alert("Car purchased successfully!");
    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  const getAttributeValue = (traitType: string) => {
    const attribute = selectedCar?.metadata?.attributes?.find(
      (attr: { trait_type: string }) => attr.trait_type === traitType
    );
    return attribute ? attribute.value : "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="text-primary-action flex items-center gap-2 hover:bg-primary-action-light"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home Page
          </Button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex justify-center items-center"
            >
              <Image
                width={400}
                height={300}
                alt={selectedCar?.metadata?.name}
                src={selectedCar?.metadata?.image}
                className="rounded-lg object-cover transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-800">
                {selectedCar?.metadata?.name}
              </h2>
              <p className="text-2xl text-primary-action font-bold">
                {Number(selectedCar?.startingPrice) / 1e18} ETH
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>VIN:</strong> {getAttributeValue("VIN")}
                </p>
                <p>
                  <strong>Year:</strong> {getAttributeValue("Year")}
                </p>
                <p className={`flex items-center gap-1`}>
                  <strong>Condition:</strong>{" "}
                  <span className={`${textColor}`}>
                    {getAttributeValue("Exterior Condition")}
                  </span>
                  <Verified className={`w-4 h-4 ${iconColor}`} />
                </p>
                <p>
                  <strong>Service History:</strong>{" "}
                  {selectedCar?.serviceHistory
                    ? selectedCar?.serviceHistory.join(", ")
                    : "No service history available"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-700">
                  Buyout Price: {Number(selectedCar?.buyoutPrice) / 1e18} ETH
                </p>
                <Button
                  className="w-full bg-primary-action text-white"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
                {/* auction section */}

                {selectedCar?.active && (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="text-lg font-semibold text-gray-700">
                      Auction Ends In:{" "}
                      <CountdownTimer
                        initialTime={selectedCar?.auctionEndTime.toString()}
                      />
                    </div>

                    <p className="font-semibold text-lg py-3 text-gray-700">
                      Current Bid:{" "}
                      {(Number(selectedCar?.highestBid) / 1e18).toFixed(2)} ETH
                    </p>

                    <BidDialog auction={selectedCar} />
                  </div>
                )}
              </div>
              {selectedCar.listed ? (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Book a Mechanic
                  </h3>
                  <p className="text-sm text-gray-600">
                    Schedule a service with a verified mechanic on{" "}
                    <Link
                      href={"/"}
                      className="text-primary-action font-semibold"
                    >
                      VintageChain
                    </Link>
                  </p>
                  <Button
                    className="w-full bg-amber-700 text-white mt-2"
                    onClick={() =>
                      router.push(`/service/request/${selectedCar.id}`)
                    }
                  >
                    Schedule a Service
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold text-red-600">
                    Service Unavailable
                  </h3>
                  <p className="text-sm text-gray-600">
                    This car is not listed for sale, so mechanic services are
                    unavailable.
                  </p>
                  <Button
                    className="mt-2 px-4 py-1 text-sm font-semibold text-primary-action border border-primary-action rounded-md hover:bg-primary-action-light"
                    onClick={handleListCarButtonClick}
                  >
                    List Car Now
                  </Button>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Book a Mechanic
                </h3>
                <p className="text-sm text-gray-600">
                  Schedule a service for your car with a verified mechanic on{" "}
                  <Link
                    href={"/"}
                    className="text-primary-action font-semibold"
                  >
                    VintageChain
                  </Link>
                </p>
                <Button
                  className="w-full bg-amber-700 text-white mt-2"
                  onClick={() =>
                    router.push(`/service/request/${selectedCar.id}`)
                  }
                >
                  Schedule a Service
                </Button>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-sm text-gray-600">Available Mechanics:</p>
                  <ul className="list-disc list-inside">
                    <li>Mechanic A - $50/hour</li>
                    <li>Mechanic B - $60/hour</li>
                    <li>Mechanic C - $55/hour</li>
                  </ul>
                </div>
              </div>

              {/* <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xl font-semibold text-red-600">
                  Service Unavailable
                </h3>
                <p className="text-sm text-gray-600">
                  This car is currently not listed for sale, so mechanic
                  services are unavailable.
                </p>
                <Button
                  className="mt-2 px-4 py-1 text-sm font-semibold text-primary-action border border-primary-action rounded-full hover:bg-primary-action hover:text-white transition"
                  onClick={handleListCarButtonClick}
                >
                  List Car
                </Button>
              </div> */}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CarDetails;
