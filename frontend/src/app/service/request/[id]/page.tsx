/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCarStore } from "../../../../stores/useCarStore";
import useServiceStore from "../../../../stores/useServiceStore";
import { toast } from "sonner";

const ServiceRequest = () => {
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const [serviceDescription, setServiceDescription] = useState("");
  const [mechanics, setMechanics] = useState([
    { name: "Mechanic A", rate: 50 },
    { name: "Mechanic B", rate: 60 },
    { name: "Mechanic C", rate: 55 },
  ]);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const { selectedCar } = useCarStore();
  const router = useRouter();
  const { carId } = useParams();

  useEffect(() => {
    // Fetch car details and available mechanics based on carId if needed
    setLoading(false);
  }, [carId]);

  const handleServiceRequest = async () => {
    if (!selectedMechanic || !serviceDescription) {
      toast.error(
        "Please select a mechanic and provide a service description."
      );
      return;
    }

    setButtonLoading(true);

    try {
      // Estimate cost based on mechanic's rate
      const estimatedHours = 2; // Can be made dynamic based on user input
      const selectedMechanicObj = mechanics.find(
        (m) => m.name === selectedMechanic
      );

      if (selectedMechanicObj) {
        const cost = selectedMechanicObj.rate * estimatedHours;
        setEstimatedCost(cost);

        // Unique ID for the service request
        const requestId = Date.now();

        // Create the service request object
        const newServiceRequest = {
          id: requestId,
          carName: selectedCar?.name || "Unknown Car", // Get the car name
          carModel: selectedCar?.model || "Unknown Model", // Get the car model
          requestDate: new Date().toISOString(),
          serviceType: serviceDescription,
          payment: cost,
          isCompleted: false,
          user: "CurrentUser",
        };

        // Store the service request in Zustand
        const serviceStore = useServiceStore.getState();
        serviceStore.addServiceRequest(newServiceRequest);

        // Show success toast
        toast.success(
          `Service request submitted! Estimated cost: ${cost} ETH.`
        );
        router.push("/dashboard"); // Redirect to main user dashboard page
      }
    } catch (error: any) {
      toast.error("Failed to submit the service request.");
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Request Service for {selectedCar?.name || "Car"}
          </h2>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Select Mechanic:
            </label>
            <Select onValueChange={setSelectedMechanic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Mechanic" />
              </SelectTrigger>
              <SelectContent>
                {mechanics.map((mechanic) => (
                  <SelectItem key={mechanic.name} value={mechanic.name}>
                    {mechanic.name} - ${mechanic.rate}/hour
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">
              Service Description:
            </label>
            <Textarea
              placeholder="Describe the issue or service required..."
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          {estimatedCost && (
            <div className="mb-4 text-gray-600">
              <p>
                <strong>Estimated Cost:</strong> {estimatedCost} ETH
              </p>
            </div>
          )}

          <Button
            onClick={handleServiceRequest}
            className="w-full bg-amber-700 text-white mt-2"
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Submit Service Request"
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default ServiceRequest;
