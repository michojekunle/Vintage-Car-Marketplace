import { Car, Hammer, Users, Wrench } from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Marketplace",
    href: "#marketplace",
  },
  {
    name: "Auctions",
    href: "#auctions",
  },
  {
    name: "Mechanics",
    href: "#mechanic-verification",
  },
];

export const makeOptions = ["Ford", "Volkswagen", "Chevrolet", "Austin"];
export const modelOptions = ["Mustang", "Beetle", "Corvette", "Mini"];
export const addCarSteps = [
  { id: 1, name: "Vehicle Details" },
  { id: 2, name: "Verification" },
  { id: 3, name: "Images Upload" },
  { id: 4, name: "Confirmation" },
];

export const filterOptions = ["All", "Make", "Year", "Model"];

export interface Car {
  id: number;
  listed: boolean;
  name: string;
  make: string;
  model: string;
  year: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  condition?: string;
  serviceHistory?: string[];
}

export const featuredCars: Car[] = [
  {
    id: 1,
    listed: true,
    name: "Classic Mustang",
    make: "Ford",
    model: "Mustang",
    year: 1965,
    rating: 4,
    reviews: 28,
    price: 20,
    image: "/mustang.png",
    condition: "Bad",
    serviceHistory: ["Oil change on 01/2023", "Tire rotation on 02/2023"],
  },
  {
    id: 2,
    listed: false,
    name: "Vintage Beetle",
    make: "Volkswagen",
    model: "Beetle",
    year: 1972,
    rating: 5,
    reviews: 42,
    price: 7,
    image: "/beetle.png",
    condition: "Good",
    serviceHistory: ["Brake check on 12/2022", "New battery on 01/2023"],
  },
  {
    id: 3,
    listed: true,
    name: "Retro Corvette",
    make: "Chevrolet",
    model: "Corvette",
    year: 1969,
    rating: 5,
    reviews: 37,
    price: 15,
    image: "/corvette.png",
    condition: "Excellent",
    serviceHistory: ["Fluid change on 03/2023", "Engine tune-up on 04/2023"],
  },
  {
    id: 4,
    listed: false,
    name: "Classic Mini",
    make: "Austin",
    model: "Mini",
    year: 1967,
    rating: 4,
    reviews: 31,
    price: 9,
    image: "/mini.png",
    condition: "Fair",
    serviceHistory: ["Rust treatment on 05/2023", "Brake pads replacement on 06/2023"],
  },
];


export const liveAuctions = [
  {
    id: 1,
    name: "1965 Classic Mustang",
    currentBid: "75 ETH",
    timeLeft: "2h 45m",
    image: "/mustang.png",
  },
  {
    id: 2,
    name: "1963 Aston Martin DB5",
    currentBid: "120 ETH",
    timeLeft: "4h 30m",
    image: "/mini.png",
  },
];

export const features = [
  {
    icon: Car,
    title: "NFT Ownership",
    description:
      "List your vintage cars as NFTs, Secure and verifiable ownership through VintageChain",
  },
  {
    icon: Hammer,
    title: "Auctions",
    description: "Participate in exciting timed auctions for rare vintage cars",
  },
  {
    icon: Wrench,
    title: "Mechanic Services",
    description:
      "Connect with expertise for maintenance and restoration services.",
  },
];

export const userRoles = [
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
];
