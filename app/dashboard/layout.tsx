import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { cookies } from 'next/headers';
import AppSidebarMenu from "@/components/app-sidebar-menu";
import Header from "@/components/header";
import { UserDataProvider } from "../../context/user-data-context";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata = {
  title: 'Dashboard',
  description: 'Halaman dashboard',
};

export default async function DashboardPageLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <UserDataProvider>
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
    </UserDataProvider>
  )
}