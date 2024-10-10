import { Cta, Features, Hero, SearchCar } from "@/components";

export default function Home() {
  return (
    <div className="w-screen">
      <Hero />
      <SearchCar />
      <Features />
      <Cta />
    </div>
  );
}
