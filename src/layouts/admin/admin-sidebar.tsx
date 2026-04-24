'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  TrendingUp,
  BarChart3,
  Settings,
  ChevronRight,
  UserCircle,
  FileEdit,
  FolderTree,
  ClipboardList,
  ArrowRightLeft,
  BadgeDollarSign,
  LineChart,
  PieChart,
  Boxes
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
} from '@/shared/components/shadcn-ui/sidebar';

export type SidebarItemType = {
  name: string;
  icon: React.ElementType;
  href?: string;
  subItems?: {
    name: string;
    icon: React.ElementType;
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
        {
          name: 'Báo cáo',
          icon: BarChart3,
          subItems: [
            { name: 'Doanh thu', icon: LineChart, href: '/reports/revenue' },
            { name: 'Bán hàng', icon: PieChart, href: '/reports/sales' },
            { name: 'Kho hàng', icon: Boxes, href: '/reports/warehouse' },
          ],
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
      title: 'DANH MỤC',
      items: [
        {
          name: 'Danh mục sản phẩm',
          icon: FolderTree,
          href: '/catalog/categories',
        },
        {
          name: 'Bảng giá nội bộ',
          icon: BadgeDollarSign,
          href: '/catalog/internal-prices',
        },
        {
          name: 'Hàng hóa',
          icon: Package,
          href: '/catalog/products',
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
        }
      ],
    },
    {
      title: 'CHUỖI CUNG ỨNG',
      items: [
        {
          name: 'Danh sách kho',
          icon: Layers,
          href: '/warehouse/list',
        },
        {
          name: 'Yêu cầu cung ứng',
          icon: ClipboardList,
          href: '/warehouse/supply-requests',
        },
        {
          name: 'lệnh điều chuyển',
          icon: ArrowRightLeft,
          href: '/warehouse/transfer-orders',
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
          name: 'Cài đặt',
          icon: Settings,
          href: '/settings',
        },
      ],
    },
  ];

export default function AdminSidebar() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
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
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title} className="group-data-[collapsible=icon]:mb-0" >
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
                              {item.subItems?.map((sub) => {
                                const SubIcon = sub.icon;
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
        ))}
      </SidebarContent>
    </Sidebar >
  );
}