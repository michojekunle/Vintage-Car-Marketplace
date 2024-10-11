"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, Verified } from "lucide-react";
import { motion } from "framer-motion";

const CarDetails = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching or loading delay
        setTimeout(() => setLoading(false), 1500);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Loader2 className="w-12 h-12 text-primary-action animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gray-200"
        >
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Back to Marketplace */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                >
                    <Button
                        variant="ghost"
                        className="text-primary-action flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5 font-bold" />
                        Back to Marketplace
                    </Button>
                </motion.div>

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
                            whileHover={{ scale: 1.05, rotate: 2 }} // Hover animation (slightly enlarges and rotates)
                            className="flex justify-center items-center"
                        >
                            <Image
                                width={400}
                                height={300}
                                alt="Vintage Car"
                                src="/car.jpeg"
                                className="rounded-lg object-cover transition-transform duration-300 ease-in-out" // Add transition styles
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
                                    <Verified className="text-green-500 w-4 h-4" />{" "}
                                    {/* Replacing Check with Verified */}
                                </p>
                                <p>
                                    <strong>Service History:</strong> Up-to-date
                                </p>
                            </div>

                            {/* Auction or Buyout Options */}
                            <div className="space-y-4">
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="text-lg font-semibold text-gray-700"
                                >
                                    Buyout Price: $30,000
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    <Button className="w-full bg-primary-action text-white font-bold">
                                        Buy Now
                                    </Button>
                                </motion.div>

                                <div className="border-t border-gray-200 pt-4">
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                        className="text-lg font-semibold text-gray-700"
                                    >
                                        Auction Ends In: 2 days 14 hrs
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.1, duration: 0.5 }}
                                    >
                                        <Button className="w-full bg-yellow-500 text-white font-bold">
                                            Place a Bid
                                        </Button>
                                    </motion.div>
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

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="text-3xl font-bold text-gray-800 mt-12 mb-6"
                    >
                        Available Mechanic Services
                    </motion.h3>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="bg-white shadow-lg rounded-xl p-6"
                    >
                        <p className="text-gray-700">
                            Book a certified mechanic for repair or maintenance services
                            directly through our platform.
                        </p>
                        <Button className="mt-4 bg-primary-action text-white font-bold">
                            Book a Mechanic
                        </Button>
                    </motion.div>
                </section>
            </main>
        </motion.div>
    );
};

export default CarDetails;
