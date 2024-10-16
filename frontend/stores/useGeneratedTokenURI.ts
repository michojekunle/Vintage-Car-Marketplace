import { create } from "zustand";

interface generatedTokenURI {
	generatedTokenURI: string | null;
	setGeneratedTokenURI: (tokenURI: string) => void;
}

export const usegeneratedTokenURI = create<generatedTokenURI>((set) => ({
	generatedTokenURI: null,
	setGeneratedTokenURI: (tokenURI) => set({ generatedTokenURI: tokenURI }),
}));
