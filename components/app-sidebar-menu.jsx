'use client';

import { useUserData } from '@/context/user-data-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import {
  Boxes,
  ChevronRight,
  ChevronsUpDown,
  Cog,
  Edit,
  User,
  Home,
  Users,
  List,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <Home />,
    isActive: false,
    items: []
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: <Boxes />,
    isActive: false,
    items: []
  },
  {
    title: 'Categories',
    url: '/dashboard/categories',
    icon: <List />,
    isActive: false,
    items: []
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: <ShoppingBag />,
    isActive: false,
    items: []
  },
  {
    title: 'Customers',
    url: '/dashboard/customers',
    icon: <Users />,
    isActive: false,
    items: []
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: <User />,
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: <Edit />
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: <Cog />
      }
    ]
  }
];

const AppSidebarMenu = () => {
  const pathname = usePathname();
  const { user } = useUserData();

  const [ shop, setShop] = useState({})
  const [ loading, setLoading ] = useState(true)

  const getData = async () => {
    try {
      const response = await fetch("/api/data/shop", { method: "GET" });

      const responseData = await response.json();
      setShop(responseData[0]);
    } catch (error) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    } finally {
      setLoading(false)
    };
  };

  useEffect(() => {
    getData()
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image src="/img/gundam.png" width={30} height={30} alt="Image" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            {loading
              ? <span className="truncate font-semibold">Loading...</span>
              : <span className="truncate font-semibold">{shop?.name}</span>
            }
            <span className="truncate text-xs">Welcome admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage />
                    <AvatarFallback className="rounded-lg">
                      {user?.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage />
                      <AvatarFallback className="rounded-lg">
                        {user?.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link href={`/dashboard/profile`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/settings`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Cog />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebarMenu;