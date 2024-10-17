"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ShieldCheck,
  UserCheck,
  FileCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import VerificationStep from "./verification-step";
import type { VerificationStatus } from "../page";
import { useFacetecDataStore } from "../../../../stores/useFacetecDataStore";

interface VerificationProgressProps {
  verificationStatus: VerificationStatus;
  setVerificationStatus: Dispatch<SetStateAction<VerificationStatus>>;
}

export default function VerificationProgress({
  verificationStatus,
  setVerificationStatus,
}: VerificationProgressProps) {
  const [progress, setProgress] = useState(0);
  const resetDetails = useFacetecDataStore((state) => state.reset);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
      setTimeout(() => {
        setProgress(100);
      }, 3000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {verificationStatus === "verifying" && "Verifying Your Identity"}
            {verificationStatus === "success" && "Verification Successful"}
            {verificationStatus === "failed" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "verifying" &&
              "Please wait while we process your information"}
            {verificationStatus === "success" &&
              "Your identity has been successfully verified"}
            {verificationStatus === "failed" &&
              "We couldn't verify your identity. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === "verifying" && (
            <>
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-blue-500" />
                </motion.div>
              </div>
              <Progress value={progress} className="mb-4" />
            </>
          )}
          {verificationStatus === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <p className="text-center text-green-600">
                Your account is now fully verified!
              </p>
            </div>
          )}
          {verificationStatus === "failed" && (
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <XCircle className="w-16 h-16 text-red-500" />
              </motion.div>
              <p className="text-center text-red-600">
                We encountered an issue during verification.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  resetDetails();
                  setVerificationStatus("verifying");
                }}
              >
                Try Again
              </Button>
            </div>
          )}
          <div className="space-y-4 mt-6">
            <VerificationStep
              icon={UserCheck}
              title="Personal Information"
              description="Verifying your personal details"
              completed={progress >= 33 || verificationStatus === "success"}
              failed={verificationStatus === "failed"}
            />
            <VerificationStep
              icon={FileCheck}
              title="Document Check"
              description="Analyzing submitted documents"
              completed={progress >= 66 || verificationStatus === "success"}
              failed={verificationStatus === "failed"}
            />
            <VerificationStep
              icon={ShieldCheck}
              title="Security Verification"
              description="Performing final security checks"
              completed={progress >= 100 || verificationStatus === "success"}
              failed={verificationStatus === "failed"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
