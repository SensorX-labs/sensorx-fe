'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Receipt,
  Package,
  Layers,
  PackagePlus,
  PackageMinus,
  Warehouse,
  Megaphone,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronRight,
  UserCircle,
  FileEdit,
  FolderTree,
  Scale,
  ClipboardList
} from 'lucide-react';

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
  useSidebar,
} from '@/shared/components/shadcn-ui/sidebar';


export type SidebarItemType = {
  name: string;
  icon: React.ElementType;
  href?: string;
  subItems?: {
    name: string;
    href: string;
  }[];
};


const sidebarSections: {
  title: string;
  items: SidebarItemType[];
}[] = [
  {
    title: 'TỔNG QUAN',
    items: [
      {
        name: 'Bảng điều khiển',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'BÁN HÀNG',
    items: [
      {
        name: 'Khách hàng',
        icon: Users,
        href: '/sales/customers',
      },
      {
        name: 'Yêu cầu báo giá',
        icon: TrendingUp,
        href: '/sales/requestforquotation',
      },
      {
        name: 'Báo giá',
        icon: FileText,
        href: '/sales/quotations',
      },
      {
        name: 'Đơn hàng',
        icon: ShoppingCart,
        href: '/sales/orders',
      },
      {
        name: 'Hóa đơn',
        icon: Receipt,
        href: '/sales/invoices',
      },
    ],
  },
  {
    title: 'HÀNG HÓA',
    items: [
      {
        name: 'Hàng hóa',
        icon: Package,
        href: '/catalog/products',
      },
      {
        name: 'Danh mục',
        icon: FolderTree,
        href: '/catalog/categories',
      },
      {
        name: 'Đơn vị tính',
        icon: Scale,
        href: '/catalog/uoms',
      },
    ],
  },
  {
    title: 'KHO HÀNG',
    items: [
      {
        name: 'Phiếu nhập kho',
        icon: PackagePlus,
        href: '/warehouse/stockin',
      },
      {
        name: 'Phiếu xuất kho',
        icon: PackageMinus,
        href: '/warehouse/stockout',
      },
      {
        name: 'Tồn kho',
        icon: Warehouse,
        href: '/warehouse/stock',
      },
      {
        name: 'Phiếu soạn kho',
        icon: FileEdit,
        href: '/warehouse/picking-note',
      },
      {
        name: 'Danh sách kho',
        icon: Layers,
        href: '/warehouse/list',
      },
      {
        name: 'Yêu cầu cấp hàng',
        icon: ClipboardList,
        href: '/warehouse/supply-requests',
      }
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      {
        name: 'Nhân viên',
        icon: UserCircle,
        href: '/users/staff',
      },
      {
        name: 'Báo cáo',
        icon: BarChart3,
        subItems: [
          { name: 'Doanh thu', href: '/reports/revenue' },
          { name: 'Bán hàng', href: '/reports/sales' },
          { name: 'Kho hàng', href: '/reports/warehouse' },
        ],
      },
      {
        name: 'Cài đặt',
        icon: Settings,
        href: '/settings',
      },
    ],
  },
];


export default function AdminSidebar() {
  // Mặc định: tất cả menu đóng
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:bg-sidebar border-r-0">
      <SidebarHeader className="p-4 flex items-center gap-3 overflow-hidden">
        <span className="text-white text-xl font-bold uppercase tracking-wider group-data-[collapsible=icon]:hidden">
          SensorX
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-0">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title} className="mb-6 group-data-[collapsible=icon]:mb-0">
            <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-sidebar-foreground/70 uppercase group-data-[collapsible=icon]:hidden">
              {section.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isOpen = !!openItems[item.name];
                  const hasChildren = !!item.subItems?.length;

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
                              <span className="text-[13px] font-medium">
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
                              {item.subItems?.map((sub) => (
                                <SidebarMenuSubItem key={sub.name}>
                                  <SidebarMenuSubButton asChild>
                                    <Link
                                      href={sub.href}
                                      className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                    >
                                      {sub.name}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
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
                          <span className="text-[13px] font-medium">
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
}