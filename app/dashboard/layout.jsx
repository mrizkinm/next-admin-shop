import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { cookies } from 'next/headers';
import AppSidebarMenu from "@/components/app-sidebar-menu";
import Header from "@/components/header";
import { UserDataProvider } from "./user-data-context";

export const metadata = {
  title: 'Dashboard',
  description: 'Halaman dashboard',
};

export default async function DashboardPageLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <UserDataProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebarMenu />
        <SidebarInset>
          <main>
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserDataProvider>
  )
}