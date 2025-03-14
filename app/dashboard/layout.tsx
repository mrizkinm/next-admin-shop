import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { cookies } from 'next/headers';
import AppSidebarMenu from "@/components/app-sidebar-menu";
import Header from "@/components/header";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { getStoreInfo } from "@/lib/api";
import StoreInitializer from "@/components/store-init";

export async function generateMetadata() {
  // Ambil data store secara dinamis
  const store = await getStoreInfo();
  const storeInfo = store;

  return {
    title: storeInfo.name,
    description: storeInfo.description,
  };
}

export default async function DashboardPageLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <>
      <StoreInitializer />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebarMenu />
        <SidebarInset>
          <NuqsAdapter>
            <main>
              <Header />
              {children}
            </main>
          </NuqsAdapter>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}