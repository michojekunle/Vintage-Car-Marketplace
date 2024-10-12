"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative bg-primary-action text-white h-[100vh] z-0 ">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.5,
            },
          },
        }}
        className="text-center p-3 pt-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-amber-100"
        >
          Discover, Collect, and Trade
          <br className="hidden md:block" />
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
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="#marketplace">
            <Button className="border-2 border-white  bg-transparent hover:bg-white hover:text-amber-800">
              Explore Now
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-20, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-[2%] md:bottom-[15%] right-0 md:right-[25%]  -z-10"
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
