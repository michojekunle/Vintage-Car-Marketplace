import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { ButtonInput } from "@/components/ui/button-input";
import Image from "next/image";

const ImagesUploadStep = () => {
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const handleImageSelect = (files: FileList | null) => {
		if (!files) return;

		const fileArray = Array.from(files);
		if (fileArray.length > 5) {
			alert("You can only upload up to 5 images");
			return;
		}
		setSelectedImages(fileArray);

		const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
		setPreviews((prev) => {
			prev.forEach((url) => URL.revokeObjectURL(url));
			return newPreviews;
		});
	};

	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const uploadToIPFS = async () => {
		setIsUploading(true);
		try {
		
			// Simulate upload to ipfs
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Uploaded to IPFS:");
			// You might want to call a function here to mint NFT with these hashes
		} catch (error) {
			console.error("Error uploading to IPFS:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
				<ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
				<ButtonInput
					value={
						selectedImages.length > 0
							? `${selectedImages.length} images selected`
							: undefined
					}
					placeholder="Upload images"
					onClick={() => {
						const input = document.createElement("input");
						input.type = "file";
						input.multiple = true;
						input.accept = "image/*";
						input.max="5"; 
						input.onchange = (e: Event) => {
							const target = e.target as HTMLInputElement;
							handleImageSelect(target.files);
						};
						input.click();
					}}
				/>
				<p className="mt-2 text-sm text-gray-500">
					Upload up to 5 high-quality images
				</p>
			</div>

			{/* Image Previews */}
			<div className="grid grid-cols-3 gap-4 mt-4">
				{previews.map((preview, index) => (
					<div key={index} className="relative aspect-square">
						<Image
							src={preview}
							alt={`Preview ${index + 1}`}
							className="w-full h-full object-cover rounded-lg"
							width={200}
							height={200}
						/>
						<button
							onClick={() => removeImage(index)}
							className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
						>
							<X size={16} />
						</button>
					</div>
				))}
			</div>

			{selectedImages.length > 0 && (
				<Button
					onClick={uploadToIPFS}
					disabled={isUploading}
					className="w-full"
				>
					{isUploading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Uploading to IPFS...
						</>
					) : (
						"Upload to IPFS"
					)}
				</Button>
			)}

			{/* {ipfsHashes.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">IPFS Hashes:</h3>
          <div className="space-y-2">
            {ipfsHashes.map((hash, index) => (
              <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                {hash}
              </div>
            ))}
          </div>
        </div>
      )} */}
		</div>
	);
};

export default ImagesUploadStep;
