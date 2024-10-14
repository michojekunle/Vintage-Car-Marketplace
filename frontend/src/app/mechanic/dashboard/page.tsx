"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
// import { useRouter } from "next/navigation";
import useServiceStore from "../../../../stores/useServiceStore";

const MechanicDashboard = () => {
  const { serviceRequests, fetchServiceRequests, updateServiceRequest } = useServiceStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        await fetchServiceRequests(); // Fetch requests from Zustand store
      } catch (err) {
        console.error(err);
        setError("Failed to fetch service requests.");
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [fetchServiceRequests]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await updateServiceRequest(requestId); // Update request in Zustand store
      alert("Service Request Accepted!");
      // router.push(`/mechanic/service/${requestId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to accept the service request.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Mechanic Dashboard</h1>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
            <p className="text-lg text-gray-600">Loading service requests...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : serviceRequests.length > 0 ? (
          serviceRequests.map((request) => (
            <div key={request.id} className="p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-lg font-bold">Service Request for {request.carModel}</h3>
              <p className="text-gray-600">Service Type: {request.serviceType}</p>
              <p className="text-gray-600">Proposed Payment: {request.payment} ETH</p>
              <p className="text-gray-600">Status: {request.isCompleted ? "Completed" : "Pending"}</p>
              <Button
                className={`mt-4 ${request.isCompleted ? "bg-gray-300" : "bg-primary-action text-white"}`}
                onClick={() => handleAcceptRequest(request.id)}
                disabled={request.isCompleted}
              >
                {request.isCompleted ? "Completed" : "Accept Request"}
              </Button>
            </div>
          ))
        ) : (
          <p>No pending service requests.</p>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
