"use client"

import { createContext, useContext, useState, useCallback } from 'react';
import type { FaceTecSessionResult, FaceTecIDScanResult } from "../../../public/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import { useFacetecDataStore } from '@/store/useFacetecDataStore';

interface FaceTecData {
  sessionResult: FaceTecSessionResult | null;
  idScanResult: FaceTecIDScanResult | null;
  documentData: any;
  formattedData: any;
  isSuccessfullyMatched?: boolean; 
}

interface FaceTecContextType {
  faceTecData: FaceTecData;
  updateFaceTecData: (data: Partial<FaceTecData>) => void;
}

const FaceTecContext = createContext<FaceTecContextType | undefined>(undefined);

export function FaceTecProvider({ children }: { children: React.ReactNode }) {
  // const [faceTecData, setFaceTecData] = useState<FaceTecData>({
  //   sessionResult: null,
  //   idScanResult: null,
  //   documentData: null,
  //   formattedData: null,
  //   isSuccessfullyMatched: false
  // });

  const setFacetecData = useFacetecDataStore((state) => state.setFacetecData);


  // const facetecData = 

  const updateFaceTecData = useCallback((newData: Partial<FaceTecData>) => {
    setFacetecData(prevData => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  return (
    <FaceTecContext.Provider value={{ faceTecData, updateFaceTecData }}>
      {children}
    </FaceTecContext.Provider>
  );
}

export function useFaceTecData() {
  const context = useContext(FaceTecContext);
  if (context === undefined) {
    throw new Error('useFaceTecData must be used within a FaceTecProvider');
  }
  return context;
}