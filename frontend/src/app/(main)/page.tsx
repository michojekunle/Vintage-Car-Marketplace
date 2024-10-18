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
import { TopMechanics } from "@/components/TopMechanics";
import { useCarStore } from "@/stores/useCarStore";

const ITEMS_PER_PAGE = 8;

const Home: React.FC = () => {
  const { listings, auctions, fetchListings } = useCarStore();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredListings = useMemo(() => {
    return listings?.filter((car) => {
      const matchesSearch = car.metadata?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMake =
        selectedMake === "" ||
        car.metadata?.attributes
          ?.find((attr) => attr.trait_type === "Make")
          ?.value.toLowerCase() === selectedMake.toLowerCase();
      const matchesModel =
        selectedModel === "" ||
        car.metadata?.attributes
          ?.find((attr) => attr.trait_type === "Model")
          ?.value.toLowerCase() === selectedModel.toLowerCase();
      const carPrice = Number(car.price) / 1e18;
      const matchesPrice =
        carPrice >= priceRange[0] && carPrice <= priceRange[1];
      return matchesSearch && matchesMake && matchesModel && matchesPrice;
    });
  }, [listings, searchTerm, selectedMake, selectedModel, priceRange]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

  const paginatedListings: any = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMake, selectedModel, priceRange]);

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
        cars={paginatedListings}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalCars={filteredListings.length}
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
