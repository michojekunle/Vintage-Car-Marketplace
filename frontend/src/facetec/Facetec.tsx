import { FaceTecButton, FaceTecInitializer } from "@/facetec/lib/faceTec";
import React from "react";
import { useFaceTecData } from "./context/FacetecContext";

export default function Facetec() {
	const { faceTecData } = useFaceTecData();

	console.log({ faceTecData });

	// ** Vars
	// const IDUser = 'f9b8d0e0-4ade-4534-ba6b-bd1750d2a579' // CUSTOM ID USER

	return (
		<div
			id="controls"
			className="wrapping-box-container"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				alignItems: "center",
				justifyContent: "center",
				width: "100vw",
				minHeight: "100vh",
			}}
		>
			<FaceTecInitializer />
			<FaceTecButton />

			{/* <button
				id="liveness-button"
				type="button"
				onClick={() => onPhotoIDMatchPressed()}
				style={{ minWidth: "250px" }}
			>
				SignUp
			</button> */}

			{/* <button
        type="button"
        onClick={() => onLogIn(IDUser)}
        style={{ minWidth: '250px' }}
      >
        SignIn
      </button> */}

			<p id="status">Loading...</p>
		</div>
	);
}
