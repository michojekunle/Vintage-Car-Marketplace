import Image from "next/image";
import Navbar from "./Navbar";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="relative bg-primary-action text-white h-[80vh] m-10 rounded-lg z-0">
      <Navbar />
      <div className="text-center mt-[5rem]">
        <h2 className="text-5xl font-bold mb-4">
          Revolutionizing Vintage Car Ownership
        </h2>
        <p className="text-2xl mb-8">
          Buy, sell, and maintain classic cars with blockchain technology
        </p>
        <div className="space-x-4">
          <Button className=" bg-white text-primary hover:bg-blue-100">
            Explore Cars
          </Button>
          <Button className="border-2 border-white  bg-transparent">
            List Your Car
          </Button>
        </div>
      </div>
      <Image
        src="/car.png"
        width={800}
        height={500}
        alt="vintage"
        className="absolute -bottom-[13%] right-[22%] -z-10"
      />
    </div>
  );
}
