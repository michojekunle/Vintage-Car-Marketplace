"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Verified, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CarDetails = () => {
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track component mount
  const router = useRouter();

  useEffect(() => {
    // Ensure component is mounted to avoid hydration mismatch
    setIsMounted(true);
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Marketplace */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="text-primary-action flex items-center gap-2 hover:bg-primary-action-light hover:no-underline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Button>
        </div>


        {/* Car Details Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Car Image */}
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
                alt="Vintage Car"
                src="/car.jpeg"
                className="rounded-lg object-cover transition-transform duration-300 ease-in-out"
              />
            </motion.div>

            {/* Car Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-800">
                Chevrolet Bel Air
              </h2>
              <p className="text-2xl text-primary-action font-bold">$30,000</p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>VIN:</strong> 12345ABCDEFG67890
                </p>
                <p>
                  <strong>Year:</strong> 2015
                </p>
                <p className="flex items-center gap-1">
                  <strong>Condition:</strong> Excellent
                  <Verified className="text-green-500 w-4 h-4" />
                </p>
                <p>
                  <strong>Service History:</strong> Up-to-date
                </p>
              </div>

              {/* Auction or Buyout Options */}
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-700">
                  Buyout Price: $30,000
                </p>
                <Button className="w-full bg-primary-action text-white">
                  Buy Now
                </Button>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-700">
                    Auction Ends In: 2 days 14 hrs
                  </p>
                  <Button className="w-full bg-amber-500 text-white">
                    Place a Bid
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Car Service History and Mechanic Services */}
        <section className="mt-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            Service History
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="bg-white shadow-lg rounded-xl p-6"
          >
            <ul className="space-y-3 text-gray-600">
              <li>Service Date: 01/02/2024 - Oil Change & Brake Check</li>
              <li>Service Date: 12/10/2023 - Full Detailing</li>
              <li>Service Date: 08/15/2023 - Transmission Service</li>
            </ul>
          </motion.div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Available Mechanic Services
          </h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-gray-700">
              Book a certified mechanic for repair or maintenance services
              directly through our platform.
            </p>
            <Button className="mt-4 bg-primary-action text-white">
              Book a Mechanic
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CarDetails;
