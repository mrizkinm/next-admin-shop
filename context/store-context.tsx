'use client'

import { StoreInfo } from '@/app/types';
import React, { createContext, useContext } from 'react'

interface StoreContextType {
  storeInfo: StoreInfo;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: React.ReactNode;
  storeInfo: StoreInfo;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children, storeInfo }) => {
  return (
    <StoreContext.Provider value={{ storeInfo }}>
      {children}
    </StoreContext.Provider>
  );
};


