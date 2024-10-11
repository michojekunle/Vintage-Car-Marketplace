"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="relative bg-amber-900 text-white h-[100vh] z-0 ">
      <div className="text-center p-3 pt-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-amber-100"
        >
          Discover, Collect, and Trade
          <br />
          Vintage Cars as NFTs
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8"
        >
          Your premier platform for buying, selling, and maintaining{" "}
          <br className="hidden md:block" />
          classic cars as NFTs
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button className="border-2 border-white  bg-transparent hover:bg-white hover:text-amber-800">
            Explore Now
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-[2%] md:bottom-[8%] right-0 md:right-[22%]  -z-10"
      >
        <Image
          src="/car-amber.png"
          width={800}
          height={500}
          alt="vintage"
          priority
        />
      </motion.div>
    </div>
  );
}
