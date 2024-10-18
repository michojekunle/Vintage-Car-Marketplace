"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Wallet,
  Menu,
  Clock,
  Wrench,
  Users,
  Gavel,
  ShieldCheck,
} from "lucide-react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import Image from "next/image";

const MotionCard = motion(Card);

export default function Landing() {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const carListings = [
    {
      name: "1965 Ford Mustang",
      price: 45,
      make: "Ford",
      model: "Mustang",
      year: 1965,
      image: "/mustang.png",
    },
    {
      name: "Vintage Beetle",
      price: 62,
      make: "Volkswagen",
      model: "Beetle",
      year: 1957,
      image: "/beetle.png",
    },
    {
      name: "Classic Mini",
      price: 58,
      make: "Austin",
      model: "Mini",
      year: 1970,
      image: "/mini.png",
    },
    {
      name: "1963 Corvette Sting Ray",
      price: 75,
      make: "Chevrolet",
      model: "Corvette",
      year: 1963,
      image: "/corvette.png",
    },
  ];

  const filteredListings = carListings.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      car.price >= priceRange[0] &&
      car.price <= priceRange[1]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen scroll-smooth bg-white  text-gray-800">
      <header className="border-b border-amber-200 sticky top-0 z-50 bg-amber-50 bg-opacity-90 backdrop-blur-sm px-4 sm:px-10 md:px-16">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Car className="h-8 w-8 text-amber-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-amber-800">VintageChain</h1>
          </div>
          <nav
            className={`md:flex gap-8 px-4 sm:px-10 md:px-16 ${
              isMenuOpen
                ? "block absolute top-full left-0 right-0 bg-amber-50 p-4"
                : "hidden"
            } md:relative md:bg-transparent md:p-0`}
          >
            <Link
              href="#user-roles"
              className="block md:inline-block py-2 text-amber-800 hover:text-amber-600 transition-colors"
            >
              User Roles
            </Link>
            <Link
              href="#marketplace"
              className="block md:inline-block py-2 text-amber-800 hover:text-amber-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="#auctions"
              className="block md:inline-block py-2 text-amber-800 hover:text-amber-600 transition-colors"
            >
              Auctions
            </Link>
            <Link
              href="#mechanic-verification"
              className="block md:inline-block py-2 text-amber-800 hover:text-amber-600 transition-colors"
            >
              Mechanic Verification
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div
                className="flex items-center cursor-pointer"
                onClick={openAccountModal ? () => openAccountModal() : () => {}}
              >
                {/* <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold"> */}
                <Avatar>
                  <AvatarImage src="" alt="@user" />
                  <AvatarFallback className="bg-amber-500">AU</AvatarFallback>
                </Avatar>
                {/* </div> */}

                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Connected Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {address
                      ? `${address.slice(0, 8)}...${address.slice(-7)}`
                      : ""}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-400 text-white"
                onClick={openConnectModal ? () => openConnectModal() : () => {}}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-28 py-16 space-y-32 px-4 sm:px-10 md:px-16">
        <section id="hero" className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-amber-900"
          >
            Discover, Collect, and Trade
            <br />
            Vintage Cars as NFTs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-amber-700 mb-8"
          >
            Your premier platform for buying, selling, and maintaining classic
            cars as NFTs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="#user-roles">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white text-lg px-8 py-4 rounded-full">
                Explore Now
              </Button>
            </Link>
          </motion.div>
        </section>

        <section id="user-roles" className="mb-16">
          <h3 className="text-3xl font-semibold mb-12 text-center text-amber-900">
            What You Can Do on VintageChain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Buyers",
                description:
                  "Browse and purchase classic cars as NFTs, participate in auctions, and schedule maintenance services.",
                icon: Users,
              },
              {
                title: "Sellers",
                description:
                  "List your vintage cars as NFTs, set prices or create auctions, and reach a global market of enthusiasts.",
                icon: Car,
              },
              {
                title: "Mechanics",
                description:
                  "Offer your expertise, get verified, and connect with classic car owners for maintenance and restoration services.",
                icon: Wrench,
              },
            ].map((role, index) => (
              <MotionCard
                key={index}
                className="bg-white border-amber-200 overflow-hidden"
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

        <section id="marketplace" className="mb-16">
          <h3 className="text-3xl font-semibold mb-12 text-center text-amber-900">
            NFT Marketplace
          </h3>
          <p className="text-amber-700 mb-8 text-center text-xl max-w-3xl mx-auto">
            Explore our curated collection of classic cars, each represented as
            a unique NFT. These digital assets provide proof of ownership and a
            detailed history of each vehicle.
          </p>
          <div className="mb-12 flex flex-col md:flex-row gap-6 justify-center">
            <div className="flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ford">Ford</SelectItem>
                <SelectItem value="chevrolet">Chevrolet</SelectItem>
                <SelectItem value="dodge">Dodge</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mustang">Mustang</SelectItem>
                <SelectItem value="bel-air">Bel Air</SelectItem>
                <SelectItem value="challenger">Challenger</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-12 max-w-md mx-auto">
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Price Range (ETH)
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-amber-600 mt-2">
              <span>{priceRange[0]} ETH</span>
              <span>{priceRange[1]} ETH</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((car, index) => (
              <MotionCard
                key={index}
                className="bg-white border-amber-200"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{car.name}</span>
                    <Badge variant="secondary">{car.price} ETH</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={car.image}
                    alt={car.name}
                    width={200}
                    height={300}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-amber-700 mb-2">Year: {car.year}</p>
                  <p className="text-amber-700 mb-2">Make: {car.make}</p>
                  <p className="text-amber-700 mb-2">Model: {car.model}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </div>
        </section>

        <section id="auctions" className="mb-16">
          <h3 className="text-3xl font-semibold mb-12 text-center text-amber-900">
            Live Auctions
          </h3>
          <p className="text-amber-700 mb-8 text-center text-xl max-w-3xl mx-auto">
            Experience the thrill of bidding on rare and valuable classic cars.
            Our live auction platform allows you to participate in real-time
            bidding wars for the most sought-after vehicles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "1969 Chevrolet Camaro",
                currentBid: "75 ETH",
                timeLeft: "2h 45m",
                image:
                  "/placeholder.svg?height=200&width=300&text=1969+Chevrolet+Camaro",
              },
              {
                name: "1963 Aston Martin DB5",
                currentBid: "120 ETH",
                timeLeft: "4h 30m",
                image:
                  "/placeholder.svg?height=200&width=300&text=1963+Aston+Martin+DB5",
              },
            ].map((auction, index) => (
              <MotionCard
                key={index}
                className="bg-white border-amber-200"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-2xl">
                    <span>{auction.name}</span>
                    <Badge variant="destructive" className="text-lg">
                      <Clock className="h-5 w-5 mr-2" />
                      {auction.timeLeft}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={auction.image}
                    alt={auction.name}
                    width={200}
                    height={300}
                    className="w-full h-64 object-cover rounded-md mb-6"
                  />
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-amber-700 text-lg">Current Bid</span>
                    <span className="text-2xl font-semibold text-amber-800">
                      {auction.currentBid}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6">
                    <Gavel className="h-6 w-6 mr-2" />
                    Place Bid
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </div>
        </section>

        <section id="mechanic-verification" className="mb-16">
          <h3 className="text-3xl font-semibold mb-12 text-center  text-amber-900">
            Mechanic Verification
          </h3>
          <p className="text-amber-700 mb-8 text-center text-xl max-w-3xl mx-auto">
            Are you a skilled mechanic specializing in classic cars? Get
            verified on VintageChain to offer your services to our community of
            vintage car enthusiasts.
          </p>
          <MotionCard
            className="bg-white border-amber-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ShieldCheck className="h-8 w-8 mr-4 text-amber-600" />
                Mechanic Verification Process
              </CardTitle>
              <CardDescription className="text-lg">
                Complete the following steps to become a verified mechanic on
                VintageChain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-4 text-amber-700 text-lg">
                <li>
                  Fill out the application form with your professional details
                </li>
                <li>Upload copies of your certifications and licenses</li>
                <li>
                  Provide references from previous classic car restoration
                  projects
                </li>
                <li>
                  Pass a brief online assessment of your vintage car knowledge
                </li>
                <li>Schedule a video interview with our verification team</li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6">
                Start Verification Process
              </Button>
            </CardFooter>
          </MotionCard>
        </section>

        <section className="text-center mb-16">
          <h3 className="text-3xl font-semibold mb-8 text-amber-900">
            Join Our Community
          </h3>
          <p className="text-amber-700 mb-8 text-xl">
            Stay updated on new listings, auctions, and exclusive events
          </p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex w-full max-w-md items-center space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="text-lg py-6"
              />
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg py-6"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-amber-200 mt-16 bg-amber-50 py-8 px-4 sm:px-10 md:px-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h4 className="font-semibold mb-4 text-xl text-amber-900">
                About VintageChain
              </h4>
              <p className="text-amber-700">
                Revolutionizing vintage car ownership and maintenance through
                blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-xl text-amber-900">
                Quick Links
              </h4>
              <ul className="space-y-2 text-amber-700">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Auctions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Mechanic Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Verification
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-xl text-amber-900">
                Legal
              </h4>
              <ul className="space-y-2 text-amber-700">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    KYC/AML Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-xl text-amber-900">
                Connect With Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-amber-600 hover:text-amber-500 transition-colors"
                >
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-amber-600 hover:text-amber-500 transition-colors"
                >
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-amber-600 hover:text-amber-500 transition-colors"
                >
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-amber-200 text-center text-amber-700">
            <p>&copy; 2024 VintageChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
