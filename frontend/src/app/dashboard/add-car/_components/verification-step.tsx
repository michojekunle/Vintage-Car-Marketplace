import React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const VerificationStep = ({ status }: { status: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {status === "loading" && (
        <>
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          <h3 className="mt-4 text-lg font-medium">Verifying ownership...</h3>
          <p className="mt-2 text-gray-500">This may take a few moments</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-lg font-medium">Verification Successful!</h3>
          <p className="mt-2 text-gray-500">
            Your ownership has been confirmed
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-16 w-16 text-red-500" />
          <h3 className="mt-4 text-lg font-medium">Verification Failed</h3>
          <p className="mt-2 text-gray-500">
            Please check your details and try again
          </p>
        </>
      )}
    </div>
  );
};

export default VerificationStep;
