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
  Target,
  UserCircle,
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

/* ===================== TYPES ===================== */

export type SidebarItemType = {
  name: string;
  icon: React.ElementType;
  href?: string;
  subItems?: {
    name: string;
    href: string;
  }[];
};

/* ===================== DATA ===================== */

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
        href: '/customers',
      },
      {
        name: 'Tiềm năng',
        icon: TrendingUp,
        subItems: [
          { name: 'Leads', href: '/leads' },
          { name: 'Cơ hội', href: '/leads/opportunities' },
        ],
      },
      {
        name: 'Báo giá',
        icon: FileText,
        href: '/quotations',
      },
      {
        name: 'Đơn hàng',
        icon: ShoppingCart,
        href: '/orders',
      },
      {
        name: 'Hóa đơn',
        icon: Receipt,
        href: '/invoices',
      },
    ],
  },
  {
    title: 'KHO HÀNG',
    items: [
      {
        name: 'Hàng hóa',
        icon: Package,
        href: '/products',
      },
      {
        name: 'Phiếu nhập kho',
        icon: PackagePlus,
        href: '/warehouse/imports',
      },
      {
        name: 'Phiếu xuất kho',
        icon: PackageMinus,
        href: '/warehouse/exports',
      },
      {
        name: 'Tồn kho',
        icon: Warehouse,
        href: '/warehouse/stock',
      },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      {
        name: 'Chiến dịch',
        icon: Megaphone,
        href: '/campaigns',
      },
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      {
        name: 'Nhân viên',
        icon: UserCircle,
        href: '/staff',
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

/* ===================== COMPONENT ===================== */

export default function CrmSidebar() {
  // Mặc định: tất cả menu đóng
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:bg-[#1E1E2D] border-r-0">
      {/* ───────── Header ───────── */}
      <SidebarHeader className="p-4 flex items-center gap-3 overflow-hidden">
        <img src="assets/images/favicon.png" alt="SensorX Logo" className="w-10 h-10" />
        <span className="text-white text-xl font-bold uppercase tracking-wider group-data-[collapsible=icon]:hidden">
          SensorX
        </span>
      </SidebarHeader>

      {/* ───────── Content ───────── */}
      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-0">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title} className="mb-6 group-data-[collapsible=icon]:mb-0">
            <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-[#7B7CA8] uppercase group-data-[collapsible=icon]:hidden">
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
                              className="h-10 px-2 text-[#C4C5D6] hover:bg-[#2B2B40] hover:text-white transition-colors"
                            >
                              <Icon className="w-5 h-5 shrink-0 text-[#7B7CA8]" />
                              <span className="text-[13px] font-medium">
                                {item.name}
                              </span>
                              <ChevronRight
                                className={cn(
                                  'ml-auto w-4 h-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden',
                                  isOpen && 'rotate-90 text-white'
                                )}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                            <SidebarMenuSub className="ml-5 border-l border-[#2B2B40]">
                              {item.subItems?.map((sub) => (
                                <SidebarMenuSubItem key={sub.name}>
                                  <SidebarMenuSubButton asChild>
                                    <Link
                                      href={sub.href}
                                      className="text-[#C4C5D6] hover:text-white"
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
                          className="flex items-center gap-2 h-10 px-2 text-[#C4C5D6] hover:bg-[#2B2B40] hover:text-white transition-colors"
                        >
                          <Icon className="w-5 h-5 shrink-0 text-[#7B7CA8]" />
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