import React from 'react'
import { Cta, FeaturedCars, Features, Hero, SearchCar } from "@/components";

const page = () => {
  return (
    <div className="w-screen">
      <Hero />
      <SearchCar />
      <FeaturedCars />
      <Features />
      <Cta />
    </div>
  );
}

export default page