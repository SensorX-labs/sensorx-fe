'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, LogOut, LayoutDashboard } from 'lucide-react';

import { cn } from '@/shared/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/shadcn-ui/collapsible';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from '@/shared/components/shadcn-ui/sidebar';
import Cookies from 'js-cookie';
import { useUser } from '@/shared/hooks/use-user';
import { ADMIN_MENU_CONFIG, MENU_ICONS } from '@/shared/configs/admin-menu.config';

export default function AdminSidebar() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const { user } = useUser();

  const toggle = (name: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const canView = (itemRoles?: string[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    return user?.role && itemRoles.includes(user.role);
  };

  return (
    <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:bg-sidebar border-r-0">
      <SidebarHeader className="px-6 mt-4 flex h-17 items-center overflow-hidden">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Image
              src="/assets/images/logo.png"
              alt="SensorX Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="truncate text-white text-xl font-bold uppercase tracking-wider group-data-[collapsible=icon]:hidden">
            SensorX
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2 group-data-[collapsible=icon]:px-0">
        {ADMIN_MENU_CONFIG.map((section) => {
          const visibleItems = section.items.filter(item => canView(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={section.title} className="group-data-[collapsible=icon]:mb-0" >
              <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-sidebar-foreground/70 uppercase group-data-[collapsible=icon]:hidden">
                {section.title}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const Icon = MENU_ICONS[item.iconName] || LayoutDashboard;
                    const isOpen = !!openItems[item.name];
                    const visibleSubItems = item.subItems?.filter(sub => canView(sub.roles));
                    const hasChildren = !!visibleSubItems?.length;

                    if (hasChildren) {
                      return (
                        <SidebarMenuItem key={item.name}>
                          <Collapsible
                            open={isOpen}
                            onOpenChange={() => toggle(item.name)}
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.name}
                                className="h-10 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group/menu-button"
                              >
                                <Icon className="w-5 h-5 shrink-0 text-sidebar-foreground/70 group-hover/menu-button:text-sidebar-accent-foreground transition-colors" />
                                <span className="text-[13px] font-medium group-data-[collapsible=icon]:hidden">
                                  {item.name}
                                </span>
                                <ChevronRight
                                  className={cn(
                                    'ml-auto w-4 h-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden',
                                    isOpen && 'rotate-90 text-sidebar-accent-foreground'
                                  )}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                              <SidebarMenuSub className="ml-5 border-l border-sidebar-accent">
                                {visibleSubItems?.map((sub) => {
                                  const SubIcon = MENU_ICONS[sub.iconName] || LayoutDashboard;
                                  return (
                                    <SidebarMenuSubItem key={sub.name}>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={sub.href}
                                          className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground group/sub-button"
                                        >
                                          <SubIcon className="w-4 h-4 shrink-0 text-sidebar-foreground/50 group-hover/sub-button:text-sidebar-accent-foreground transition-colors" />
                                          <span className="text-[13px]">{sub.name}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        </SidebarMenuItem>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton tooltip={item.name} asChild>
                          <Link
                            href={item.href!}
                            className="flex items-center gap-2 h-10 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group/menu-button"
                          >
                            <Icon className="w-5 h-5 shrink-0 text-sidebar-foreground/70 group-hover/menu-button:text-sidebar-accent-foreground transition-colors" />
                            <span className="text-[13px] font-medium group-data-[collapsible=icon]:hidden">
                              {item.name}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-6 group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                Cookies.remove('token');
                Cookies.remove('user');
                window.location.href = '/login';
              }}
              className="h-10 px-2 text-sidebar-foreground hover:bg-red-500 hover:text-white transition-all group/logout"
              tooltip="Đăng xuất"
            >
              <LogOut className="w-5 h-5 shrink-0 text-sidebar-foreground/70 group-hover/logout:text-white transition-colors" />
              <span className="text-[13px] font-medium group-data-[collapsible=icon]:hidden">
                Đăng xuất tài khoản
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  );
}