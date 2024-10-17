"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import UnlistCarDialog from "./unlist-car-dialog";
import ListCarDialog from "./list-car-dialog";
import { listingFormSchema } from "@/schema";
// import { useListCar } from "@/hooks/useListCar";
import { useGetOwnedCars } from "@/hooks/useGetOwnedCars";
// import { useNFTApproval } from "@/hooks/useNFTApproval";
import { VINTAGE_CAR_AUCTION_ADDRESS } from "@/app/contracts/VintageCarAuction";
import { injected, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { baseSepolia } from "viem/chains";
import {
  VINTAGE_CAR_MARKETPLACE_ABI,
  VINTAGE_CAR_MARKETPLACE_ADDRESS,
} from "@/app/contracts/VintageCarMarketplace";
import {
  VINTAGE_CAR_NFT_ABI,
  VINTAGE_CAR_NFT_ADDRESS,
} from "@/app/contracts/VintageCarNFT";
import { CORRECT_CHAIN_ID } from "@/hooks/useNFTApproval";
import { parseEther } from "viem";
import { ZeroAddress } from "ethers";
import { useGetListings } from "@/hooks/useGetListings";

type ListingFormValues = z.infer<typeof listingFormSchema>;

const defaultValues: Partial<ListingFormValues> = {
  listingType: "normalSale",
  enableBuyout: false,
  durationUnit: "hours",
};

export default function UserCarDetail({ tokenId }: { tokenId?: number }) {
  const router = useRouter();
  const { chainId, address } = useAccount();
  const { connectAsync } = useConnect();
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(true);
  const [listTxloading, setListTxLoading] = useState(false);
  const [listing, setListing] = useState<IListing>();
  const [isCheckingListed, setIsCheckingListed] = useState(true);
  const [isListed, setIsListed] = useState(false);
  const [carDetail, setCarDetail] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { getCarDetail } = useGetOwnedCars();
  const { getListing } = useGetListings();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchCarDetail = async () => {
      if (tokenId) {
        const detail = await getCarDetail(tokenId);
        setCarDetail(detail);
        setLoading(false);
      }
    };
    fetchCarDetail();
  }, [tokenId, getCarDetail]);

  useEffect(() => {
    const checkCarListed = async () => {
      if (tokenId) {
        const detail: IListing = await getListing(tokenId);
        console.log(detail);
		setListing(detail);
        if (
          detail.seller !== ZeroAddress &&
          detail.seller === address &&
          detail.isActive
        ) {
          setIsListed(true);
        }
        setIsCheckingListed(false);
      }
    };
    checkCarListed();
  }, [tokenId, getListing]);

  const handleFixedPriceList = async (price: number) => {
    try {
      setListTxLoading(true);
      if (chainId !== CORRECT_CHAIN_ID) {
        try {
          await connectAsync({
            chainId: baseSepolia.id,
            connector: injected(),
          });
        } catch (error) {
          toast.success(`An error occured: ${error}`);
          setListTxLoading(false);
        }
      }

      const approveResponse = await writeContractAsync({
        chainId: baseSepolia.id,
        address: VINTAGE_CAR_NFT_ADDRESS as `0x${string}`,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "approve",
        args: [VINTAGE_CAR_AUCTION_ADDRESS, tokenId],
      });

      // Check if the approve transaction was successful
      if (approveResponse) {
        console.log(
          `Approve transaction sent successfully: ${approveResponse}`
        );
        toast.success(
          "Approve transaction confirmed, proceeding with listing..."
        );

        // Step 2: Wait until the transaction is mined
        const approveTransactionReceipt = await waitForTransactionReceipt(
          config,
          {
            hash: approveResponse,
          }
        );

        console.log(approveTransactionReceipt);

        if (approveTransactionReceipt.status === "success") {
          console.log(
            "Approve transaction confirmed, proceeding with listing..."
          );
          toast.success(
            "Approve transaction confirmed, proceeding with listing..."
          );

          //   Step 3: Call createFixedPriceListing function after approval
          const listingTxResponse = await writeContractAsync({
            chainId: baseSepolia.id,
            address: VINTAGE_CAR_MARKETPLACE_ADDRESS as `0x${string}`,
            abi: VINTAGE_CAR_MARKETPLACE_ABI,
            functionName: "createFixedPriceListing",
            args: [tokenId, parseEther(`${price}`)],
          });

          console.log(listingTxResponse);

          const listingTransactionReceipt = await waitForTransactionReceipt(
            config,
            {
              hash: listingTxResponse,
            }
          );

          if (listingTransactionReceipt.status === "success") {
            console.log("Status", listingTransactionReceipt.status);
            toast.success("Listing Transaction Successful!");
            setIsListed(true);
            setListTxLoading(false);
            setIsDialogOpen(false);
          }
        } else {
          console.error("Listing transaction failed or was reverted!");
          toast.error("Listing transaction failed or was reverted!");
          setListTxLoading(false);
        }
      } else {
        console.error("Approve transaction failed");
        toast.error("Approval transaction failed!");
        setListTxLoading(false);
      }
    } catch (error) {
      console.log(error);
      setListTxLoading(false);
    }
  };

  const handleAuctionList = async (
    startingPrice: number,
    buyoutPrice: number,
    duration: number
  ) => {
    try {
      setListTxLoading(true);
      if (chainId !== CORRECT_CHAIN_ID) {
        try {
          await connectAsync({
            chainId: baseSepolia.id,
            connector: injected(),
          });
        } catch (error) {
          toast.success(`An error occured: ${error}`);
          setListTxLoading(false);
        }
      }

      const approveResponse = await writeContractAsync({
        chainId: baseSepolia.id,
        address: VINTAGE_CAR_NFT_ADDRESS as `0x${string}`,
        abi: VINTAGE_CAR_NFT_ABI,
        functionName: "approve",
        args: [VINTAGE_CAR_AUCTION_ADDRESS, tokenId],
      });

      // Check if the approve transaction was successful
      if (approveResponse) {
        console.log(
          `Approve transaction sent successfully: ${approveResponse}`
        );
        toast.success(
          "Approve transaction confirmed, proceeding with listing..."
        );

        // Step 2: Wait until the transaction is mined
        const approveTransactionReceipt = await waitForTransactionReceipt(
          config,
          {
            hash: approveResponse,
          }
        );

        console.log(approveTransactionReceipt);

        if (approveTransactionReceipt.status === "success") {
          console.log(
            "Approve transaction confirmed, proceeding with listing..."
          );
          toast.success(
            "Approve transaction confirmed, proceeding with listing..."
          );

          //   Step 3: Call createFixedPriceListing function after approval
          const listingTxResponse = await writeContractAsync({
            chainId: baseSepolia.id,
            address: VINTAGE_CAR_MARKETPLACE_ADDRESS as `0x${string}`,
            abi: VINTAGE_CAR_MARKETPLACE_ABI,
            functionName: "createAuctionListing",
            args: [
              tokenId,
              parseEther(`${startingPrice}`),
              parseEther(`${buyoutPrice}`),
              duration,
            ],
          });

          console.log(listingTxResponse);

          const listingTransactionReceipt = await waitForTransactionReceipt(
            config,
            {
              hash: listingTxResponse,
            }
          );

          if (listingTransactionReceipt.status === "success") {
            console.log("Status", listingTransactionReceipt.status);
            toast.success("Listing Transaction Successful!");
            setIsListed(true);
            setListTxLoading(false);
            setIsDialogOpen(false);
          }
        } else {
          console.error("Listing transaction failed or was reverted!");
          toast.error("Listing transaction failed or was reverted!");
          setListTxLoading(false);
        }
      } else {
        console.error("Approve transaction failed");
        toast.error("Approval transaction failed!");
        setListTxLoading(false);
      }
    } catch (error) {
      console.log(error);
      setListTxLoading(false);
    }
  };

  const onSubmit = (data: ListingFormValues) => {
    if (data.listingType === "auction") {
      if (data.enableBuyout) {
        if (!data.buyoutPrice)
          return form.setError("buyoutPrice", {
            type: "manual",
            message: "Buyout Price is required",
          });
      }
      if (!data.startingPrice)
        return form.setError("startingPrice", {
          type: "manual",
          message: "Starting Price is required",
        });

      if (!data.duration || !data.durationUnit)
        return form.setError("duration", {
          type: "manual",
          message: "Auction duration is required",
        });

	  const duration = useCallback(() => {
		if(data.durationUnit === 'days') return Number(data.duration) * 24 * 60 * 60;
		if(data.durationUnit === 'hours') return Number(data.duration) * 60 * 60;
		if(data.durationUnit === 'minutes') return Number(data.duration) * 60;
		return Number(data.duration);
	  }, [data.duration, data.durationUnit]);	

	  const buyoutPrice = data.enableBuyout ? Number(data.buyoutPrice) : 0;

      handleAuctionList(Number(data.startingPrice), buyoutPrice, duration());
    }

    if (data.listingType === "normalSale" && data.salePrice) {
      handleFixedPriceList(Number(data.salePrice));
    } else {
      form.setError("salePrice", {
        type: "manual",
        message: "Sale Price is required",
      });
    }
  };

  const handleUnlist = (listing: IListing) => {
    console.log("Unlist clicked");
    toast.warning("Unlist clicked");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="text-primary-action hover:underline flex items-center gap-2 px-0 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full flex-1 flex justify-center items-center bg-[#fbf8ed]">
              <Image
                width={600}
                height={400}
                alt="Car Image"
                src={carDetail?.image ?? "/car.jpeg"}
                className="object-cover w-full max-h-[200px] hover:scale-110 hover:rotate-3 transition duration-1000"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                {carDetail?.name || "Mercedes Benz C300"}
              </h2>
              {false ? (
                <p className="text-xl text-green-600">
                  ${carDetail?.price || ""}
                </p>
              ) : null}
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>VIN:</strong> {carDetail?.vin || "nil"}
                </p>
                <p>
                  <strong>Make:</strong> {carDetail?.make || "nil"}
                </p>
                <p>
                  <strong>Model:</strong> {carDetail?.model || "nil"}
                </p>
                <p>
                  <strong>Year:</strong> {carDetail?.year || "nil"}
                </p>
                <p className="flex items-center gap-1">
                  <strong>Engine Condition:</strong>{" "}
                  {carDetail?.exteriorCondition || "nil"}
                  <Check className="text-green-500 w-4 h-4" />
                </p>
                <p className="flex items-center gap-1">
                  <strong>Exterior Condition:</strong>{" "}
                  {carDetail?.engineCondition || "nil"}
                  <Check className="text-green-500 w-4 h-4" />
                </p>
                <p>
                  <strong>Color:</strong> {carDetail?.color || "2015"}
                </p>
                <p>
                  <strong>Mileage:</strong> {carDetail?.mileage || "2015"}
                </p>

                <p>
                  <strong>Service History:</strong>{" "}
                  {carDetail?.serviceHistory || "Up-to-date"}
                </p>
                <p
                  className={`${
                    isListed
                      ? "text-green-600 bg-green-100"
                      : "text-amber-600 bg-amber-100"
                  } py-1 mt-2 px-4 inline-block rounded-full`}
                >
                  <strong>
                    {isCheckingListed ? (
                      <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                    ) : isListed ? (
                      "Listed"
                    ) : (
                      "Not Listed"
                    )}
                  </strong>
                </p>
              </div>
              <div className="pt-4">
                {isListed ? (
                  <UnlistCarDialog handleUnlist={() => handleUnlist(listing!)} />
                ) : (
                  <ListCarDialog
                    form={form}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    loading={listTxloading}
                    onSubmit={onSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Service History
            </h3>
            <div className="bg-white shadow-md rounded-lg p-4">
              <ul className="space-y-2 text-gray-600">
                {carDetail?.serviceHistory?.map(
                  (service: string, index: number) => (
                    <li key={index}>{service}</li>
                  )
                ) || (
                  <>
                    <li>Service Date: 01/02/2024 - Oil Change & Brake Check</li>
                    <li>Service Date: 12/10/2023 - Full Detailing</li>
                    <li>Service Date: 08/15/2023 - Transmission Service</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Available Mechanic Services
            </h3>
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-700 mb-4">
                Book a certified mechanic for repair or maintenance services
                directly through our platform.
              </p>
              <Button className="bg-primary-action text-white">
                Book a Mechanic
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
