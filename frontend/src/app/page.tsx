import React from "react";
import { Cta, FeaturedCars, Features, Hero, SearchCar } from "@/components";

const page = () => {
  return (
    <div className="w-screen">
      <Hero />
      <SearchCar />
      <FeaturedCars />
      <Features />
      <Cta />
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 VintageNFTCars. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default page;
