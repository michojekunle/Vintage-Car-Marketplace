"use client";

import { Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { mockMechanics } from "@/lib/constants";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export const TopMechanics = () => {
  const MotionCard = motion(Card);

  const bookService = (mechanicId: number) => {
    console.log(`Booking service with mechanic ID: ${mechanicId}`);
  };

  const sortedMechanics = mockMechanics.toSorted((a, b) => b.rating - a.rating);

  return (
    <section id="mechanics" className="mx-2 py-10 px-4 sm:px-10 md:px-16">
      <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
        Top Mechanics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedMechanics.slice(0, 4).map((mechanic) => (
          <MotionCard
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            key={mechanic.id}
            className="flex flex-col bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-amber-600 transition-shadow duration-300"
          >
            <CardHeader>
              <h2 className="text-xl font-semibold">{mechanic.name}</h2>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{mechanic.rating}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-2">Specialties:</p>
              <ul className="list-disc list-inside mb-4">
                {mechanic.specialties.map((specialty) => (
                  <li key={specialty}>{specialty}</li>
                ))}
              </ul>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Next Available: {mechanic.availability}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => bookService(mechanic.id)}
                className="w-full bg-secondary-action hover:bg-amber-600"
              >
                Book Service
              </Button>
            </CardFooter>
          </MotionCard>
        ))}
      </div>

      <div className="flex justify-center py-5">
        <Button className="w-max bg-primary-action hover:bg-amber-600">
          View All
        </Button>
      </div>
    </section>
  );
};
