'use client';

import React, { useContext } from 'react'
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
import { UserDataContext } from '@/app/dashboard/user-data-context';
import { useRouter } from 'next/navigation';
import { Cog, LogOut, User } from 'lucide-react';
import Link from 'next/link';

const UserNav = () => {
  const router = useRouter();
  const { user } = useContext(UserDataContext);

  const onLogout = async () => {
    try {
      const data ={
        id: user.id
      }
      // Perform login request (replace with actual API call)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const responseData = await response.json();

      if (response.ok) {
        // Redirect to dashboard or other protected page on success
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
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
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