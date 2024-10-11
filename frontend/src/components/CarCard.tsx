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
    className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between text-left"
    onClick={onClick}
  >
    <Image
      src={image}
      alt={name}
      width={300}
      height={250}
      className="flex justify-center min-h-[250px] max-h-[250px]"
      priority
    />
    <div className="p-4">
      <h4 className="font-bold text-lg mb-2">{name}</h4>
      <p className="text-sm text-gray-600 mb-2">
        {make} {model}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Year:</span>
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
    <p className="absolute px-2 bg-gray-100 rounded-md left-2 top-2 text-sm">{listed}</p>
  </button>
);
