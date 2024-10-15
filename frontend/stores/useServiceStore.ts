import { create } from "zustand";

// Define the shape of the service request
interface ServiceRequest {
  id: number;
  carName: string; // Added this field if you intend to use it later
  carModel: string;
  requestDate: string; // You can set a default date if needed
  serviceType: string;
  payment: number; // Consider using a string if dealing with ETH to avoid float issues
  isCompleted: boolean;
  user: string; // Added user field if you need to track who requested the service
}

// Define the store's state and actions
interface ServiceStore {
  serviceRequests: ServiceRequest[];
  addServiceRequest: (request: ServiceRequest) => void;
  updateServiceRequest: (requestId: number) => void;
  fetchServiceRequests: () => void;
}

const useServiceStore = create<ServiceStore>((set) => ({
  serviceRequests: [],
  addServiceRequest: (request) =>
    set((state) => ({
      serviceRequests: [...state.serviceRequests, request],
    })),
  updateServiceRequest: (requestId) =>
    set((state) => ({
      serviceRequests: state.serviceRequests.map((request) =>
        request.id === requestId ? { ...request, isCompleted: true } : request
      ),
    })),
  fetchServiceRequests: () => {
    // Dummy data fetch function
    const dummyData: ServiceRequest[] = [
      {
        id: 1,
        carName: "Toyota Camry", // Added this field
        carModel: "Camry",
        requestDate: "2024-10-01", // Default date added
        serviceType: "Oil Change",
        payment: 0.05,
        isCompleted: false,
        user: "User1", // Added user for tracking
      },
      {
        id: 2,
        carName: "Honda Accord",
        carModel: "Accord",
        requestDate: "2024-10-02",
        serviceType: "Brake Replacement",
        payment: 0.07,
        isCompleted: false,
        user: "User2",
      },
      {
        id: 3,
        carName: "Ford Mustang",
        carModel: "Mustang",
        requestDate: "2024-10-03",
        serviceType: "Tire Rotation",
        payment: 0.03,
        isCompleted: false,
        user: "User3",
      },
      {
        id: 4,
        carName: "Chevrolet Malibu",
        carModel: "Malibu",
        requestDate: "2024-10-04",
        serviceType: "Battery Replacement",
        payment: 0.05,
        isCompleted: false,
        user: "User4",
      },
    ];
    set({ serviceRequests: dummyData });
  },
}));

export default useServiceStore;
