import { create } from "zustand";

export interface OwnCar {
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
	allImages: [];
	exteriorCondition: string | undefined;
	engineCondition: string | undefined;
	serviceHistory?: string[] | null;
}

interface OwnCarStore {
	ownCars: OwnCar[];
	setOwnCars: (car: OwnCar[]) => void;
	fetchCarsLoading: boolean;
	setFetchCarsLoading: (loadingState: boolean) => void;
}

export const useOwnCarStore = create<OwnCarStore>((set) => ({
	ownCars: [],
	setOwnCars: (car) => set({ ownCars: car }),
	fetchCarsLoading: false,
	setFetchCarsLoading: (loadingState: boolean) => set({ fetchCarsLoading: loadingState })
}));
