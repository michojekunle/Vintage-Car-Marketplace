"use client";

import React, { useState } from "react";
import { Cta, FeaturedCars, Features, Hero, SearchCar } from "@/components";
import { featuredCars } from "@/lib/constants";
import LiveAuction from "@/components/LiveAuction";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);

  const filteredCars = featuredCars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === "" || car.make === selectedMake;
    const matchesModel = selectedModel === "" || car.model === selectedModel;
    const matchesPrice =
      car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesSearch && matchesMake && matchesModel && matchesPrice;
  });

  return (
    <div className="w-screen">
      <Hero />
      <Features />
      <SearchCar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <FeaturedCars
        cars={filteredCars}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      <LiveAuction />
      <Cta />
      <footer className=" bg-amber-50 bg-opacity-90 backdrop-blur-sm text-secondary-action py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 VintageNFTCars. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
