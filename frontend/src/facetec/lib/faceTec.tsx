import type { FaceTecSDK as TFaceTecSDK } from "../../../public/core-sdk/FaceTecSDK.js/FaceTecSDK";

import { config } from "@/facetec/configs/faceTec";
// import { Enrollment } from "@/facetec/services/processors/enrollment";
// import { Authenticate } from "@/facetec/services/processors/authenticate";
import {
	enableAllButtons,
	displayStatus,
	formatUIForDevice,
	fadeOutMainUIAndPrepareForSession,
	handleErrorGettingServerSessionToken,
	showMainUI,
	generateUUId,
} from "@/facetec/helpers/faceTecUtilities";

import { en } from "@/facetec/locale/faceTec";
import { PhotoIDMatchProcessor } from "../services/processors/PhotoIDMatchProcessor";
import {
	FaceTecIDScanResult,
	FaceTecSessionResult,
} from "../../../public/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import { useEffect } from "react";
import { FaceTecData } from "../@types/faceTec";
import { useFacetecDataStore } from "@/store/useFacetecDataStore";

type TResult = string | null;

type TCallbackGetSession = (token: string) => void;

declare let FaceTecSDK: typeof TFaceTecSDK;

let identifier: string = "";
let processor: PhotoIDMatchProcessor;
let result: TResult = null;
// let IDScanResult: TResult = null;
let flashUserResult = "";
let latestIDScanResult: FaceTecIDScanResult | null = null;
// let latestSessionResult: FaceTecSessionResult | null ;
declare global {
	interface Window {
		FaceTecSDK: typeof TFaceTecSDK;
	}
}

function initializeFaceTecSDK(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined" || !window.FaceTecSDK) {
			reject(new Error("FaceTecSDK not available"));
			return;
		}

		const { FaceTecSDK } = window;

		// Set directories first
		FaceTecSDK.setResourceDirectory("/core-sdk/FaceTecSDK.js/resources");
		FaceTecSDK.setImagesDirectory("/core-sdk/FaceTec_images");

		// Initialize SDK
		FaceTecSDK.initializeInDevelopmentMode(
			config.DeviceKeyIdentifier,
			config.PublicFaceScanEncryptionKey,
			(successful: boolean) => {
				if (successful) {
					// Only configure localization after successful initialization
					try {
						FaceTecSDK.configureLocalization(en);
						enableAllButtons();
						formatUIForDevice();

						const status = FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
							FaceTecSDK.getStatus()
						);
						displayStatus(status);

						resolve();
					} catch (error) {
						console.error("Error during post-initialization:", error);
						reject(error);
					}
				} else {
					reject(new Error("FaceTecSDK initialization failed"));
				}
			}
		);
	});
}

export function FaceTecInitializer() {
	useEffect(() => {
		initializeFaceTecSDK()
			.then(() => {
				console.log("FaceTecSDK initialized successfully");
			})
			.catch((error) => {
				console.error("Failed to initialize FaceTecSDK:", error);
			});
	}, []);

	return null;
}

export function FaceTecButton() {
	// const { updateFaceTecData } = useFaceTecData();
	const setFacetecData = useFacetecDataStore((state) => state.setFacetecData);

	console.log(processor?.isSuccess());

	const handlePhotoIDMatch = () => {
		initializeResultObjects();
		fadeOutMainUIAndPrepareForSession();

		getSessionToken((token: string) => {
			identifier = "browser_sample_app_" + generateUUId();

			processor = new PhotoIDMatchProcessor(token, {
				getLatestEnrollmentIdentifier,
				onComplete: createOnCompleteHandler(setFacetecData),
				clearLatestEnrollmentIdentifier,
			});
		});
	};

	return (
		<button
			className="bg-gray-600 p-4 rounded-md text-white"
			onClick={handlePhotoIDMatch}
		>
			Start Photo ID Match
		</button>
	);
}

/**
 *
 */

function initializeResultObjects(): void {
	// IDScanResult = null;
	result = null;
}

// function onComplete(): void {
//   showMainUI()
//   enableAllButtons()

//   if (!processor?.isSuccess()) {
//     clearLatestEnrollmentIdentifier()

//     displayStatus('Session exited early, see logs for more details.')

//     return
//   }

//   displayStatus('Success')
// }

// Show the final result with the Session Review Screen.
// let onComplete: OnComplete;

export function createOnCompleteHandler(
	setFacetecData: (data: Partial<FaceTecData>) => void
) {
	return function onComplete(
		sessionResult: FaceTecSessionResult | null,
		idScanResult: FaceTecIDScanResult | null,
		latestNetworkResponseStatus: number,
		latestDocumentData: any
	): void {
		// Update global variables as in your original code
		latestIDScanResult = idScanResult;
		//   latestSessionResult = sessionResult;

		// Update context

		// Rest of your original onComplete logic
		if (processor.isSuccess()) {
			localStorage.setItem(
				"biometrics",
				JSON.stringify({ latestIDScanResult, flashUserResult })
			);
			localStorage.setItem(
				"latestDocumentData",
				JSON.stringify({ latestDocumentData })
			);

			const formattedData = extractIdDetails(latestDocumentData);
			setFacetecData({
				sessionResult,
				idScanResult,
				documentData: latestDocumentData,
				formattedData,
				isSuccessfullyMatched: true,
			});

			// setIDScanResult(formattedData);
			displayStatus("Success");

			console.log(formattedData);
		} else {
			setFacetecData({
				isSuccessfullyMatched: false,
			});
			console.log({ sessionResult, idScanResult });
			displayStatus("Unable to complete verification");

			if (isNetworkResponseServerIsOffline(latestNetworkResponseStatus)) {
				console.log("Server is down");
				return;
			}
		}

		showMainUI();
		enableAllButtons();
	};
}



function extractIdDetails(jsonString: any) {
	let parsedData;
	// console.log(first)
	try {
		// First, try parsing the string directly
		parsedData = JSON.parse(jsonString);
	} catch (error) {
		// If direct parsing fails, try removing extra backslashes
		try {
			const cleanJsonString = jsonString.replace(/\\/g, "");
			parsedData = JSON.parse(cleanJsonString);
		} catch (innerError) {
			console.error("Failed to parse JSON:", innerError);
			// return null;
			parsedData = jsonString;
		}
	}

	// Initialize an object to store extracted details
	const extractedDetails: any = {};

	// Function to process groups and extract fields
	function processGroups(groups: any) {
		groups.forEach((group: any) => {
			group.fields.forEach((field: any) => {
				extractedDetails[field.fieldKey] = field.value;
			});
		});
	}

	// Process both scanned and user confirmed values
	if (parsedData.scannedValues && parsedData.scannedValues.groups) {
		processGroups(parsedData.scannedValues.groups);
	}

	// Add template information
	if (parsedData.templateInfo) {
		extractedDetails.documentCountry = parsedData.templateInfo.documentCountry;
		extractedDetails.documentType = parsedData.templateInfo.templateType;
	}

	return extractedDetails;
}

// function extractIdDetails(jsonString: any) {
// 	let parsedData;

// 	try {
// 		// First, try parsing the string directly
// 		// parsedData = JSON.parse(jsonString);
// 		parsedData = jsonString
// 	} catch (error) {
// 		// If direct parsing fails, try removing extra backslashes
// 		const cleanJsonString = jsonString.replace(/\\/g, "");
// 		try {
// 			// parsedData = JSON.parse(cleanJsonString);
// 			parsedData = cleanJsonString
// 		} catch (innerError) {
// 			console.error("Failed to parse JSON:", innerError);
// 			return null;
// 		}
// 	}

// 	// Initialize an object to store extracted details
// 	const extractedDetails: any = {};

// 	// Function to process groups and extract fields
// 	function processGroups(groups: any) {
// 		groups.forEach((group: any) => {
// 			group.fields.forEach((field: any) => {
// 				extractedDetails[field.fieldKey] = field.value;
// 			});
// 		});
// 	}

// 	// Process both scanned and user confirmed values
// 	if (parsedData.scannedValues && parsedData.scannedValues.groups) {
// 		processGroups(parsedData.scannedValues.groups);
// 	}

// 	// Add template information
// 	if (parsedData.templateInfo) {
// 		extractedDetails.documentCountry = parsedData.templateInfo.documentCountry;
// 		extractedDetails.documentType = parsedData.templateInfo.templateType;
// 	}

// 	return extractedDetails;
// }

function isNetworkResponseServerIsOffline(
	networkResponseStatus: number
): boolean {
	return networkResponseStatus >= 500;
}

function getSessionToken(callback: TCallbackGetSession): void {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `${config.BaseURL}/session-token`);
	xhr.setRequestHeader("X-Device-Key", config.DeviceKeyIdentifier);
	xhr.setRequestHeader(
		"X-User-Agent",
		FaceTecSDK.createFaceTecAPIUserAgentString("")
	);

	xhr.onreadystatechange = function (): void {
		if (this.readyState === XMLHttpRequest.DONE) {
			let sessionToken = "";

			try {
				sessionToken = JSON.parse(this.responseText).sessionToken;

				if (typeof sessionToken !== "string") {
					onServerSessionTokenError();
					return;
				}
			} catch {
				onServerSessionTokenError();
				return;
			}

			callback(sessionToken);
		}
	};

	xhr.onerror = function (): void {
		onServerSessionTokenError();
	};

	xhr.send();
}

function onServerSessionTokenError(): void {
	handleErrorGettingServerSessionToken();
}

export function setLatestSessionResult(sessionResult: TResult): void {
	result = sessionResult;
}

export function getLatstSessionResult(): TResult {
	return result;
}

// export function setIDScanResult(idScanResult: any): void {
// 	IDScanResult = idScanResult;
// }

// export function getIDScanResult(): any {
// 	return IDScanResult;
// }

function getLatestEnrollmentIdentifier(): string {
	return identifier;
}

export function setLatestServerResult(responseJSON: string): void {
	console.log(responseJSON);
}

export function clearLatestEnrollmentIdentifier(): void {
	identifier = "";
}
