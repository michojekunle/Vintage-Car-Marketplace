import { useFacetecDataStore } from "@/store/useFacetecDataStore";
import { FaceTecButton, FaceTecInitializer } from "@/facetec/lib/faceTec";
import React from "react";
// import { useFaceTecData } from "./context/FacetecContext";

export default function Facetec() {
	// const { faceTecData } = useFaceTecData();

	const facetecData = useFacetecDataStore((state) => state.facetecData);


	// console.log({ faceTecData });

	// ** Vars
	// const IDUser = 'f9b8d0e0-4ade-4534-ba6b-bd1750d2a579' // CUSTOM ID USER

	return (
		<div
			id="controls"
			className="wrapping-box-container"
		>
			<FaceTecInitializer />
			<FaceTecButton />
			<p id="status">Loading...</p>
		</div>
	);
}
