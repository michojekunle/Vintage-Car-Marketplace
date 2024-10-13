import type { FaceTecData } from "@/facetec/@types/faceTec";
import { create } from "zustand";

interface FacetecDataStore extends FaceTecData {
	setFacetecData: (data: Partial<FaceTecData>) => void;
}

export const useFacetecDataStore = create<FacetecDataStore>((set) => ({
	documentData: "",
	formattedData: {},
	idScanResult: "",
	isSuccessfullyMatched: false,
	sessionResult: "",
	
	setFacetecData: (data: Partial<FaceTecData>) => {
		set((state) => ({
			// facetecData: {
			...state,
			...data,
			// },
		}));
	},
}));
