import { AuthProvider } from "./auth-context";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { cookies } from 'next/headers';
import AppSidebarMenu from "@/components/AppSidebarMenu";
import Header from "@/components/Header";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export const metadata = {
  title: 'Dashboard',
  description: 'Halaman dashboard',
};

export default async function DashboardPageLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebarMenu />
            <SidebarInset>
              <Header />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    </AuthProvider>
  )
}