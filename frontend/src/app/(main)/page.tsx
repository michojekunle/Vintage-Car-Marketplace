"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useCarStore } from "@/stores/useCarStore";

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const { listings, auctions, fetchListings } = useCarStore();

  useEffect(() => {
    fetchListings();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCars = useMemo(() => {
    return featuredCars.filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMake = selectedMake === "" || car.make === selectedMake;
      const matchesModel = selectedModel === "" || car.model === selectedModel;
      const matchesPrice =
        car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesSearch && matchesMake && matchesModel && matchesPrice;
    });
  }, [searchTerm, selectedMake, selectedModel, priceRange]);

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);

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
        cars={paginatedCars}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalCars={filteredCars.length}
        listings={listings}
      />
      <LiveAuction auctions={auctions} />
      <UserRoles />
      <TopMechanics />
      <MechanicVerification />
      <Cta />
    </div>
  );
};

export default Home;
