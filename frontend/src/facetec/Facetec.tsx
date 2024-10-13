import { FaceTecButton, FaceTecInitializer } from "@/facetec/lib/faceTec";
import Reac from "react";

export default function Facetec() {
	// ** Vars


	return (
		<div className=" min-h-full grid justify-center items-center">
			<div id="controls" className="wrapping-box-container  ">
				<FaceTecInitializer />
				<FaceTecButton />
				<p id="status">Loading...</p>
			</div>
		</div>
	);
}
