"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Loader2 } from "lucide-react"

const CarDetails = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching or loading delay
    setTimeout(() => setLoading(false), 1500)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Marketplace */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="text-indigo-600 hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Marketplace
          </Button>
        </div>

        {/* Car Details Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Car Image */}
            <div className="flex justify-center items-center">
              <Image
                width={400}
                height={300}
                alt="Vintage Car"
                src="/car.jpeg"
                className="rounded-lg object-cover"
              />
            </div>

            {/* Car Information */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Mercedes Benz C300
              </h2>
              <p className="text-xl text-green-600">$30,000</p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>VIN:</strong> 12345ABCDEFG67890
                </p>
                <p>
                  <strong>Year:</strong> 2015
                </p>
                <p className="flex items-center gap-1">
                  <strong>Condition:</strong> Excellent
                  <Check className="text-green-500 w-4 h-4" />
                </p>
                <p>
                  <strong>Service History:</strong> Up-to-date
                </p>
              </div>

              {/* Auction or Buyout Options */}
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-700">
                  Buyout Price: $30,000
                </p>
                <Button className="w-full bg-indigo-600 text-white">
                  Buy Now
                </Button>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-700">
                    Auction Ends In: 2 days 14 hrs
                  </p>
                  <Button className="w-full bg-yellow-500 text-white">
                    Place a Bid
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Service History and Mechanic Services */}
        <section className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Service History
          </h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-2 text-gray-600">
              <li>Service Date: 01/02/2024 - Oil Change & Brake Check</li>
              <li>Service Date: 12/10/2023 - Full Detailing</li>
              <li>Service Date: 08/15/2023 - Transmission Service</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Available Mechanic Services
          </h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-gray-700">
              Book a certified mechanic for repair or maintenance services
              directly through our platform.
            </p>
            <Button className="mt-4 bg-indigo-600 text-white">
              Book a Mechanic
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CarDetails