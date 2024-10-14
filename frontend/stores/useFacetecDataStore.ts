import type { FaceTecData } from "@/facetec/@types/faceTec";
import { create } from "zustand";

interface FacetecDataStore extends FaceTecData {
	setFacetecData: (data: Partial<FaceTecData>) => void;
	reset: () => void;
}

const initialState: FaceTecData = {
	isCompletelyDone: false,
	formattedData: {},
	idScanResult: "",
	isSuccessfullyMatched: false,
	sessionResult: "",
};

export const useFacetecDataStore = create<FacetecDataStore>((set) => ({
	...initialState,
	setFacetecData: (data: Partial<FaceTecData>) => {
		set((state) => ({
			...state,
			...data,
			// },
		}));
	},
	reset: () => {
		set(initialState);
	},
}));
