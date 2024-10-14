import { create } from 'zustand';

interface Car {
    id: number;
    listed: string;
    name: string;
    make: string;
    model: string;
    year: number;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    condition: string | undefined;
    serviceHistory?: string[] | null; // Array of strings to represent service records
  }
  

interface CarStore {
  selectedCar: Car | null;
  setSelectedCar: (car: Car) => void;
}

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
}));
