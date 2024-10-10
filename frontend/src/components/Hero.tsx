import Image from "next/image";
import Navbar from "./Navbar";

export function Hero() {
  return (
    <div className="relative bg-[#1c2657] text-white h-[80vh] m-10 rounded-lg z-0">
      <Navbar />
      <div className="text-center mt-[5rem]">
        <h2 className="text-5xl font-bold mb-4">
          Revolutionizing Vintage Car Ownership
        </h2>
        <p className="text-2xl mb-8">
          Buy, sell, and maintain classic cars with blockchain technology
        </p>
        <div className="space-x-4">
          <button className="bg-white text-[#1c2657] px-6 py-2 rounded-full font-bold hover:bg-blue-100">
            Explore Cars
          </button>
          <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-[#1c2657]">
            List Your Car
          </button>
        </div>
      </div>
      <Image
        src="/car.png"
        width={800}
        height={500}
        alt="vintage"
        className="absolute -bottom-[10%] right-[22%] -z-10"
      />
    </div>
  );
}
