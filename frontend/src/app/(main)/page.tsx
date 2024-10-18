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
  }, [fetchListings]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCars = useMemo(() => {
    if (!listings || listings.length === 0) return [];

    return listings?.filter((car) => {
      const matchesSearch = car?.metadata?.name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());
      const matchesMake =
        selectedMake === "" ||
        car?.metadata?.attributes?.find((attr) => attr.trait_type === "Make")
          ?.value === selectedMake;
      const matchesModel =
        selectedModel === "" ||
        car?.metadata?.attributes?.find((attr) => attr.trait_type === "Model")
          ?.value === selectedModel;
      const matchesPrice =
        car?.price >= priceRange[0] && car?.price <= priceRange[1];
      return matchesSearch && matchesMake && matchesModel && matchesPrice;
    });
  }, [listings, searchTerm, selectedMake, selectedModel, priceRange]);

  const totalPages = Math.ceil(filteredCars?.length / ITEMS_PER_PAGE);

  const paginatedCars = useMemo(() => {
    if (!filteredCars || filteredCars?.length === 0) return [];

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars?.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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
