'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'

import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}