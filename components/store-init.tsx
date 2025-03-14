'use client';

import { useStore } from '@/store/shop-store';
import { useEffect } from 'react';

export default function StoreInitializer() {
  const { fetchStore } = useStore();
  
  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return null;
}