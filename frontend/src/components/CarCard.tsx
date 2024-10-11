import { Star } from "lucide-react";
import Image from "next/image";

export const CarCard = ({
  image,
  name,
  make,
  model,
  year,
  rating,
  reviews,
  price,
  listed,
  onClick,
}: ICarCard) => (
  <button
    type="button"
    className="relative bg-white rounded-lg shadow-md shadow-amber-100 overflow-hidden cursor-pointer hover:shadow-amber-600 transition-shadow duration-300 flex flex-col justify-between text-left border border-amber-800"
    onClick={onClick}
  >
    <Image
      src={image}
      alt={name}
      width={300}
      height={250}
      className="flex justify-center w-full min-h-[250px] max-h-[250px] object-cover"
      priority
    />
    <div className="p-4">
      <h4 className="font-bold text-lg mb-2">{name}</h4>

      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Make: </span>
        {make}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Model: </span>
        {model}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Year: </span>
        {year}
      </p>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
            fill={i < rating ? "currentColor" : "none"}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({reviews} reviews)</span>
      </div>
      <p className="text-primary-action font-bold">{price} ETH</p>
    </div>
    <p
      className={`absolute px-2 rounded-md right-2 top-2 text-sm font-semibold ${
        listed === "Listed"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {listed}
    </p>
  </button>
);
