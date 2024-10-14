import { useCallback } from "react";
import {
	useReadContract,
	useWriteContract,
	useAccount,
	useSwitchChain,
} from "wagmi";
// import { useReadContract, useWriteContract, useWaitForTransaction } from 'wagmi';
import { parseUnits, formatUnits } from "viem";
import {
	COURSE_PAYMENT_ABI,
	COURSE_PAYMENT_CA,
	USDC_ABI,
	USDC_CA,
} from "@/contracts/coursePayment";
import { useConnectModal } from "@rainbow-me/rainbowkit";
// import toast from "react-hot-toast";
import useAuth from "./useAuth";
import { useToast } from "./use-toast";

const CORRECT_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID, 10);

console.log(CORRECT_CHAIN_ID);

// const COURSE_PAYMENT_CA = 'YOUR_COURSE_PAYMENT_CONTRACT_ADDRESS';
// const COURSE_PAYMENT_ABI = ["bnghj"]; // Your CoursePayment contract ABI here

export function useCoursePayment() {
	const { address, isConnected, chain } = useAccount();
	const { openConnectModal } = useConnectModal();
	const { switchChain } = useSwitchChain();
	const { paymentWallet } = useAuth();
	const { toast } = useToast();


	// Helper function to check if the wallet is connected
	const checkConnectionAndChain = useCallback(async () => {
		if (!isConnected) {
			// toast("Please connect your wallet.");
            toast({
                title: "Please connect your wallet.",
                variant: "destructive",
            });
			openConnectModal?.();
			return false;
		}
		if (chain?.id !== CORRECT_CHAIN_ID) {
			toast({
				title: "Unsupported chain",
                variant: "destructive",
				description: "Switching to the correct network...",
			});
			try {
				switchChain({ chainId: CORRECT_CHAIN_ID });
				return false;
			} catch (error) {
				console.error("Failed to switch network:", error);
				// toast.error("Failed to switch network. Please switch manually.");
                toast({
                    title: "Failed to switch network. Please switch manually.",
                    variant: "destructive",
                });
				return false;
			}
		}
		return true;
	}, [
		isConnected,
		openConnectModal,
		chain,
		switchChain,
		paymentWallet,
		address,
	]);

	// Wrap contract write functions with the connection check
	const wrapWithConnectionAndChainCheck = useCallback(
		(writeFunction) => {
			return async (...args) => {
				if (await checkConnectionAndChain()) {
					return writeFunction(...args);
				}
			};
		},
		[checkConnectionAndChain]
	);

	const {
		writeContract: registerTutorRaw,
		data: registerTutorHash,
		isPending: isRegisterTutorPending,
		error: registerTutorError,
	} = useWriteContract();
	const {
		writeContract: updateTutorAddressRaw,
		data: updateTutorAddressHash,
		isPending: isUpdateTutorAddressPending,
		error: updateTutorAddressError,
	} = useWriteContract();
	const {
		writeContract: withdrawTutorBalanceRaw,
		data: withdrawTutorBalanceHash,
		isPending: isWithdrawTutorBalancePending,
		error: withdrawTutorBalanceError,
	} = useWriteContract();
	const {
		writeContract: purchaseCourseRaw,
		data: purchaseDataHash,
		isPending: isPurchasePending,
		error: purchaseError,
	} = useWriteContract();

	const {
		writeContract: approveUSDCRaw,
		data: approveDataHash,
		isPending: isApproving,
		error: approveError,
	} = useWriteContract({
		address: USDC_CA,
		abi: USDC_ABI,
		functionName: "approve",
	});
	// console.log(error);

	const approveUSDC = wrapWithConnectionAndChainCheck((amount) =>
		approveUSDCRaw({
			address: USDC_CA,
			abi: USDC_ABI,
			functionName: "approve",
			args: [COURSE_PAYMENT_CA, parseUnits(amount, 6)],
		})
	);
	// Register Tutor
	const registerTutor = wrapWithConnectionAndChainCheck((tutorId) =>
		registerTutorRaw({
			address: COURSE_PAYMENT_CA,
			abi: COURSE_PAYMENT_ABI,
			functionName: "registerTutor",
			args: [tutorId],
		})
	);

	// Update Tutor Address
	const updateTutorAddress = wrapWithConnectionAndChainCheck(
		(tutorId, newAddress) =>
			updateTutorAddressRaw({
				address: COURSE_PAYMENT_CA,
				abi: COURSE_PAYMENT_ABI,
				functionName: "updateTutorAddress",
				args: [tutorId, newAddress],
			})
	);

	// Withdraw Tutor Balance
	const withdrawTutorBalance = wrapWithConnectionAndChainCheck(
		(tutorId, amount) =>
			withdrawTutorBalanceRaw({
				address: COURSE_PAYMENT_CA,
				abi: COURSE_PAYMENT_ABI,
				functionName: "withdrawTutorBalance",
				args: [tutorId, parseUnits(amount, 6)],
			})
	);

	//   const { data: isAllowanceSufficient } = useContractRead({
	//     address: COURSE_PAYMENT_ADDRESS,
	//     abi: COURSE_PAYMENT_ABI,
	//     functionName: 'checkAllowance',
	//     args: [address, parseUnits(price.toString(), 6)],
	// });

	const getAllowanceStat = (address, price) => {
		return useReadContract({
			address: COURSE_PAYMENT_CA,
			abi: COURSE_PAYMENT_ABI,
			functionName: "checkAllowance",
			args: [address, parseUnits(price, 6)],
		});
	};

	// Purchase Course
	const purchaseCourse = wrapWithConnectionAndChainCheck(
		(tutorId, amount, courseId) =>
			purchaseCourseRaw({
				address: COURSE_PAYMENT_CA,
				abi: COURSE_PAYMENT_ABI,
				functionName: "purchaseCourse",
				args: [tutorId, parseUnits(amount, 6), courseId],
			})
	);

	// const { isLoading: isPurchaseProcessing, isSuccess: isPurchaseComplete } = useWaitForTransaction({
	//   hash: purchaseData?.hash,
	// })

	// Get Tutor Balance

	const getTutorBalance = (tutorId) => {
		return useReadContract({
			address: COURSE_PAYMENT_CA,
			abi: COURSE_PAYMENT_ABI,
			functionName: "getTutorBalance",
			args: [tutorId],
		});
	};

	// Get Total Tutor Balances

	const { data: totalTutorBalances } = useReadContract({
		address: COURSE_PAYMENT_CA,
		abi: COURSE_PAYMENT_ABI,
		functionName: "getTotalTutorBalances",
	});

	// Get Platform Fee
	const { data: platformFee } = useReadContract({
		address: COURSE_PAYMENT_CA,
		abi: COURSE_PAYMENT_ABI,
		functionName: "getPlatformFee",
	});

	// Format balances
	const formattedTotalTutorBalances = totalTutorBalances
		? formatUnits(totalTutorBalances, 6)
		: "0";
	const formattedPlatformFee = platformFee ? formatUnits(platformFee, 6) : "0";

	// console.log(getAllowanceStat)

	return {
		registerTutor,
		registerTutorHash,
		isRegisterTutorPending,
		approveUSDC,
		approveDataHash,
		isApproving,
		approveError:
			approveError?.cause?.code === 4001
				? "User denied transaction signature."
				: approveError?.cause?.reason,
		getAllowanceStat,
		registerTutorError:
			registerTutorError?.cause?.code === 4001
				? "User denied transaction signature."
				: registerTutorError?.cause?.reason,

		updateTutorAddress,
		updateTutorAddressHash,
		isUpdateTutorAddressPending,
		updateTutorAddressError:
			updateTutorAddressError?.cause?.code === 4001
				? "User denied transaction signature."
				: updateTutorAddressError?.cause?.reason,
		withdrawTutorBalance,
		withdrawTutorBalanceHash,
		isWithdrawTutorBalancePending,
		withdrawTutorBalanceError:
			withdrawTutorBalanceError?.cause?.code === 4001
				? "User denied transaction signature."
				: withdrawTutorBalanceError?.cause?.reason,
		purchaseCourse,
		purchaseDataHash,
		isPurchasePending,
		purchaseError:
			purchaseError?.cause?.code === 4001
				? "User denied transaction signature."
				: purchaseError?.cause?.reason,
		getTutorBalance,
		totalTutorBalances: formattedTotalTutorBalances,
		platformFee: formattedPlatformFee,
	};
}
