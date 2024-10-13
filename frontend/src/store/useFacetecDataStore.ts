import { create } from "zustand";
import { FaceTecData } from "../@types/faceTec";


// type CounterStore = {
// 	count: number;
// 	increment: () => void;
// 	incrementAsync: () => Promise<void>;
// 	decrement: () => void;
// };
type FacetecDataStore = {
	facetecData: {
		documentData: string;
		formattedData: {};
		idScanResult: string;
		isSuccessfullyMatched: boolean;
		sessionResult: string;
	};
	setFacetecData: (data: Partial<FaceTecData>) => void;
};
// documentData: null;
// formattedData: null;
// idScanResult: null;
// isSuccessfullyMatched: false;
// sessionResult: null;

// export const useCounterStore = create<CounterStore>((set) => ({
// 	count: 0,
// 	increment: () => {
// 		set((state) => ({ count: state.count + 1 }));
// 	},
// 	incrementAsync: async () => {
// 		await new Promise((resolve) => setTimeout(resolve, 1000));
// 		set((state) => ({ count: state.count + 1 }));
// 	},
// 	decrement: () => {
// 		set((state) => ({ count: state.count - 1 }));
// 	},
// }));

export const useFacetecDataStore = create<FacetecDataStore>(
	(set) => ({
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

		// increment: () => {
		// 	set((state) => ({ count: state.count + 1 }));
		// },
		// incrementAsync: async () => {
		// 	await new Promise((resolve) => setTimeout(resolve, 1000));
		// 	set((state) => ({ count: state.count + 1 }));
		// },
		// decrement: () => {
		// 	set((state) => ({ count: state.count - 1 }));
		// },
	})
);
