import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Attributes = {
  trait_type: string;
  value: string;
};

export const formatCarData = (tokenId: number, data: any) => {
  return {
    id: Number(tokenId),
    name: data.name,
    make: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "Make"
    ).value,
    model: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "Model"
    ).value,
    year: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "Year"
    ).value,
    vin: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "VIN"
    ).value,
    color: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "Color"
    ).value,
    mileage: data.attributes.find(
      (attribute: Attributes) => attribute.trait_type === "Mileage"
    ).value,
    image: data.image,
    description: data.description,
    exteriorCondition: data.attributes.find(
      (attribute: Attributes) =>
        attribute.trait_type === "Exterior Condition"
    ).value,
    engineCondition: data.attributes.find(
      (attribute: Attributes) =>
        attribute.trait_type === "Engine Condition"
    ).value,
    allImages: data.properties.files,
  }
}