import React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Car, Clock } from "lucide-react";
import Link from "next/link";
import Testimonials from "./_components/MechanicTestimonials";

const MechanicsLandingPage = () => {
    return (
        <div className="bg-gray-100 text-gray-800">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[60vh] flex items-center justify-center"
                style={{ backgroundImage: "url('/mechanic.jpg')" }}
            >
                <div className="bg-black bg-opacity-50 p-8 rounded-lg flex flex-col items-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                        Your Trusted Mechanics
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-200 mb-6">
                        Reliable, efficient, and affordable vintage car repair services from <Link href='/' className="text-primary-action font-semibold">VintageChain</Link>.
                    </p>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        Book an Appointment
                    </Button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <Wrench className="h-12 w-12 text-amber-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold">Full Car Repair</h3>
                            <p className="mt-2 text-gray-600">
                                Comprehensive repair services for all vintage car models and makes.
                            </p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <Car className="h-12 w-12 text-amber-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold">Tire Replacement</h3>
                            <p className="mt-2 text-gray-600">
                                Quick tire replacements to get you back on the road safely.
                            </p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <Clock className="h-12 w-12 text-amber-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold">24/7 Emergency Service</h3>
                            <p className="mt-2 text-gray-600">
                                We&apos;re here when you need us the most, any time of day or night.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-primary-action py-12">
                <div className="container mx-auto text-center p-6">
                    <h2 className="text-3xl font-bold text-white mb-8">What Our Customers Say</h2>
                    {Testimonials ? <Testimonials/> : <p>Error loading testimonials.</p>}
                </div>
            </section>

            {/* C.T.A Section */}
            <section className="py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Get Your Vintage Car Back on Track</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Contact us today to schedule a service or learn more about what we offer.
                    </p>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        Contact Us
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default MechanicsLandingPage;
