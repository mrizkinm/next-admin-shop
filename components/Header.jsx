import React from 'react'
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import ThemeButton from './theme-button';
import UserNav from './user-nav';
import Breadcrumbs from './breadcrumbs';

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        <ThemeButton />
        <UserNav />
      </div>
    </header>
  );
}

export default Header