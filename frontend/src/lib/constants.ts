export const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
  },
  {
    name: "Auctions",
    href: "/auctions",
  },
  {
    name: "Mechanics",
    href: "/mechanics",
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

export const featuredCars = [
  {
    id: 1,
    listed: "Listed",
    name: "Classic Mustang",
    make: "Ford",
    model: "Mustang",
    year: 1965,
    rating: 4,
    reviews: 28,
    price: 20,
    image: "/mustang.png",
  },
  {
    id: 2,
    listed: "Sold",
    name: "Vintage Beetle",
    make: "Volkswagen",
    model: "Beetle",
    year: 1972,
    rating: 5,
    reviews: 42,
    price: 7,
    image: "/beetle.png",
  },
  {
    id: 3,
    listed: "Listed",
    name: "Retro Corvette",
    make: "Chevrolet",
    model: "Corvette",
    year: 1969,
    rating: 5,
    reviews: 37,
    price: 15,
    image: "/corvette.png",
  },
  {
    id: 4,
    listed: "Sold",
    name: "Classic Mini",
    make: "Austin",
    model: "Mini",
    year: 1967,
    rating: 4,
    reviews: 31,
    price: 9,
    image: "/mini.png",
  },
];

export const liveAuctions = [
  {
    name: "1965 Classic Mustang",
    currentBid: "75 ETH",
    timeLeft: "2h 45m",
    image: "/mustang.png",
  },
  {
    name: "1963 Aston Martin DB5",
    currentBid: "120 ETH",
    timeLeft: "4h 30m",
    image: "/mini.png",
  },
];
