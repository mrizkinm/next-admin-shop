'use client'

import React, { createContext, useContext } from 'react'

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children, storeInfo }) => {
  return (
    <StoreContext.Provider value={{ storeInfo }}>
      {children}
    </StoreContext.Provider>
  );
};


