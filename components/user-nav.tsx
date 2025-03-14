'use client';

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// import { useUserData } from '@/context/user-data-context';
import { useRouter } from 'next/navigation';
import { Cog, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signOut, useSession } from 'next-auth/react';

const UserNav = () => {
  const router = useRouter();
  // const { user } = useUserData();
  const { data: session } = useSession();
  const user = session?.user;

  const onLogout = async () => {
    try {
      // const data ={
      //   id: user?.id
      // }
      // Perform login request (replace with actual API call)
      // const response = await fetch("/api/auth/logout", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });
      
      const responseData = await response.json();

      if (response.ok) {
        // Redirect to dashboard or other protected page on success
        await signOut({
          redirect: false
        });
        router.push("/login");
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative border h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>{user?.name?.split(' ').map(word => word[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/dashboard/profile`}>
            <DropdownMenuItem className="cursor-pointer">
              Profile
              <DropdownMenuShortcut><User /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/settings`}>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            <DropdownMenuShortcut><Cog /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => onLogout()}>
          Log out
          <DropdownMenuShortcut><LogOut /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav