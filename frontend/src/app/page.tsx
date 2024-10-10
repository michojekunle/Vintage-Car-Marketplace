import { Cta, FeaturedCars, Features, Hero, SearchCar } from "@/components";

export default function Home() {
  return (
    <div className="w-screen">
      <Hero />
      <SearchCar />
      <FeaturedCars />
      <Features />
      <Cta />
    </div>
  );
}
