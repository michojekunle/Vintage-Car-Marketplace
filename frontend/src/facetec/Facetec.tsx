import { useFacetecDataStore } from "@/store/useFacetecDataStore";
import { FaceTecButton, FaceTecInitializer } from "@/facetec/lib/faceTec";
import React, {  RefObject, useRef } from "react";
// import { useFaceTecData } from "./context/FacetecContext";

export default function Facetec() {
	// const { faceTecData } = useFaceTecData();

	const facetecData = useFacetecDataStore((state) => state);

	const statusRef = useRef<HTMLParagraphElement| null>(null)

	const paraInnerText = statusRef.current?.innerText


	// console.log({ faceTecData });
  
	// ** Vars
	// const IDUser = 'f9b8d0e0-4ade-4534-ba6b-bd1750d2a579' // CUSTOM ID USER

	return (
		<div className=" min-h-full grid justify-center items-center">
			<div id="controls" className="wrapping-box-container  ">
				<FaceTecInitializer  />
				<FaceTecButton paraInnerText={paraInnerText}/>
				<p ref={statusRef} id="status">Loading...</p>
			</div>
		</div>
	);
}
