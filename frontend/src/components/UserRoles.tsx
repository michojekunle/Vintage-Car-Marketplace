"use client";

import { userRoles } from "@/lib/constants";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const UserRoles = () => {
  const MotionCard = motion(Card);
  return (
    <section id="user-roles" className="mb-16 px-4 sm:px-10 md:px-16">
      <h3 className="text-lg lg:text-2xl font-bold mb-5 text-text-header text-center">
        What You Can Do on VintageChain
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 text-text-body">
        {userRoles.map((role, index) => (
          <MotionCard
            key={index}
            className="bg-white rounded-lg shadow-sm shadow-secondary-action overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <role.icon className="h-8 w-8 mr-4 text-amber-600" />
                <span>{role.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-lg">{role.description}</p>
            </CardContent>
          </MotionCard>
        ))}
      </div>
    </section>
  );
};
