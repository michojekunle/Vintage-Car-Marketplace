"use client";

import React, { useMemo, useState } from "react";
import {
  Cta,
  FeaturedCars,
  Features,
  Hero,
  SearchCar,
  MechanicVerification,
  UserRoles,
  LiveAuction,
} from "@/components";
import { featuredCars } from "@/lib/constants";
import { TopMechanics } from "@/components/TopMechanics";

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCars: ICarCard[] = useMemo(() => {
    return featuredCars.filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMake = selectedMake === "" || car.make === selectedMake;
      const matchesModel = selectedModel === "" || car.model === selectedModel;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesSearch && matchesMake && matchesModel && matchesPrice;
    });
  }, [searchTerm, selectedMake, selectedModel, priceRange]);
  
  const paginatedCars: ICarCard[] = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);
  

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  return (
    <div className="w-screen overflow-x-hidden">
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
        cars={paginatedCars} // Each object in this array should conform to ICarCard
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalCars={filteredCars.length}
      />
      <LiveAuction />
      <UserRoles />
      <TopMechanics />
      <MechanicVerification />
      <Cta />
    </div>
  );
};

export default Home;
