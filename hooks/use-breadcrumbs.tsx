"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

// This allows to add custom title as well
const routeMapping: { [key: string]: { title: string; link: string; }[] } = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/products': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Products', link: '/dashboard/products' }
  ],
  '/dashboard/categories': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Categories', link: '/dashboard/categories' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname as keyof typeof routeMapping]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}