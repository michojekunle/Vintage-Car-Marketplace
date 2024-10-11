"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Input } from "./ui/input";

export const Cta = () => {
  return (
    <section className="flex flex-col items-center justify-center bg-primary-action text-white py-12 text-center">
      <h3 className="text-2xl lg:text-3xl font-bold mb-4">
        Ready to Join the Revolution?
      </h3>
      <p className="text-lg lg:text-xl mb-8">
        Stay updated on new listings, auctions, and exclusive events
      </p>
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="text-lg py-6"
          />
          <Button
            type="submit"
            variant="outline"
            className="bg-transparent hover:bg-amber-800 hover:text-white text-white text-lg py-6"
          >
            Subscribe
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
