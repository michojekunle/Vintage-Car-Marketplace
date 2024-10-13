import { FaceTecData } from "@/facetec/@types/faceTec";
import { create } from "zustand";

type FacetecDataStore = {
	facetecData: FaceTecData;
	setFacetecData: (data: Partial<FaceTecData>) => void;
};

export const useFacetecDataStore = create<FacetecDataStore>((set) => ({
	facetecData: {
		documentData: "",
		formattedData: {},
		idScanResult: "",
		isSuccessfullyMatched: false,
		sessionResult: "",
	},
	setFacetecData: (data: Partial<FaceTecData>) => {
		set((state) => ({
			facetecData: {
				...state.facetecData,
				...data,
			},
		}));
	},
}));
