'use client';

import { StoreInfo } from '@/app/types';
import { create } from 'zustand';

interface ShopState {
  storeInfo: StoreInfo | null;
  loading: boolean;
  fetchStore: () => Promise<void>;
  setStore: (store: StoreInfo) => void;
}

export const useStore = create<ShopState>((set) => ({
  storeInfo: null,
  loading: false,
  fetchStore: async () => {
    set({ loading: true });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const responseData = await response.json();
    set({ storeInfo: responseData, loading: false });
  },
  setStore: (store) => set({ storeInfo: store }),
}));
