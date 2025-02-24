import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { cookies } from 'next/headers';
import AppSidebarMenu from "@/components/app-sidebar-menu";
import Header from "@/components/header";
// import { UserDataProvider } from "../../context/user-data-context";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { getStoreInfo } from "@/lib/api";
import { StoreProvider } from "@/context/store-context";

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
  const store = await getStoreInfo();
  const storeInfo = store;

  return (
    // <UserDataProvider>
      <StoreProvider storeInfo={storeInfo}>
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
      </StoreProvider>
    // </UserDataProvider>
  )
}