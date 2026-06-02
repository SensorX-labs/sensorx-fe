import {
  LayoutDashboard, Users, FileText, ShoppingCart, Receipt,
  Package, Layers, PackagePlus, PackageMinus, Warehouse,
  TrendingUp, BarChart3, Settings, UserCircle, Shield,
  FileEdit, FolderTree, ClipboardList, ArrowRightLeft,
  BadgeDollarSign, LineChart, PieChart, Boxes, User
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const MENU_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, FileText, ShoppingCart, Receipt,
  Package, Layers, PackagePlus, PackageMinus, Warehouse,
  TrendingUp, BarChart3, Settings, UserCircle, Shield,
  FileEdit, FolderTree, ClipboardList, ArrowRightLeft,
  BadgeDollarSign, LineChart, PieChart, Boxes, User
};

export interface MenuItem {
  name: string;
  iconName: string;
  href?: string;
  roles?: string[];
  hidden?: boolean;
  subItems?: {
    name: string;
    iconName: string;
    href: string;
    roles?: string[];
  }[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const ADMIN_MENU_CONFIG: MenuSection[] = [
  {
    title: 'TỔNG QUAN',
    items: [
      {
        name: 'Bảng điều khiển',
        iconName: 'LayoutDashboard',
        href: '/dashboard',
        roles: ['Manager']
      },
      {
        name: 'Báo cáo',
        iconName: 'BarChart3',
        roles: ['Manager'],
        subItems: [
          { name: 'Doanh thu', iconName: 'LineChart', href: '/reports/revenue' },
          { name: 'Bán hàng', iconName: 'PieChart', href: '/reports/sales' },
          { name: 'Kho hàng', iconName: 'Boxes', href: '/reports/warehouse' },
        ],
      },
    ],
  },
  {
    title: 'BÁN HÀNG',
    items: [
      {
        name: 'Yêu cầu báo giá',
        iconName: 'TrendingUp',
        href: '/sales/RFQ',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Báo giá',
        iconName: 'FileText',
        href: '/sales/quotations',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Đơn hàng',
        iconName: 'ShoppingCart',
        href: '/sales/orders',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Hóa đơn',
        iconName: 'Receipt',
        href: '/sales/invoices',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Khách hàng',
        iconName: 'Users',
        href: '/sales/customers',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Lịch sử thanh toán',
        iconName: 'BadgeDollarSign',
        href: '/sales/payment-histories',
        roles: ['Manager', 'SaleStaff']
      },
    ],
  },
  {
    title: 'DANH MỤC',
    items: [
      {
        name: 'Hàng hóa',
        iconName: 'Package',
        href: '/catalog/products',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Bảng giá nội bộ',
        iconName: 'BadgeDollarSign',
        href: '/catalog/internal-prices',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Danh mục sản phẩm',
        iconName: 'FolderTree',
        href: '/catalog/categories',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Nhà cung cấp',
        iconName: 'Layers',
        href: '/catalog/suppliers',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Đơn vị tính',
        iconName: 'Boxes',
        href: '/catalog/unit-of-quantities',
        roles: ['Manager', 'SaleStaff']
      },
    ],
  },
  {
    title: 'KHO HÀNG',
    items: [
      {
        name: 'Tồn kho',
        iconName: 'Warehouse',
        href: '/warehouse/stock',
        roles: ['Manager', 'WarehouseStaff']
      },
      {
        name: 'Phiếu nhập kho',
        iconName: 'PackagePlus',
        href: '/warehouse/stockin',
        roles: ['WarehouseStaff']
      },
      {
        name: 'Phiếu soạn kho',
        iconName: 'FileEdit',
        href: '/warehouse/picking-note',
        roles: ['WarehouseStaff']
      },
      {
        name: 'Phiếu xuất kho',
        iconName: 'PackageMinus',
        href: '/warehouse/stockout',
        roles: ['WarehouseStaff']
      }
    ],
  },
  {
    title: 'CHUỖI CUNG ỨNG',
    items: [
      {
        name: 'Danh sách kho',
        iconName: 'Layers',
        href: '/warehouse/list',
        roles: ['Manager']
      },
      {
        name: 'Yêu cầu cung ứng',
        iconName: 'ClipboardList',
        href: '/warehouse/supply-requests',
        roles: ['Manager', 'WarehouseStaff']
      },
      {
        name: 'lệnh điều chuyển',
        iconName: 'ArrowRightLeft',
        href: '/warehouse/transfer-orders',
        roles: ['Manager', 'WarehouseStaff']
      }
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      {
        name: 'Tài khoản',
        iconName: 'Shield',
        href: '/users/accounts',
        roles: ['Admin']
      },
      {
        name: 'Nhân viên',
        iconName: 'UserCircle',
        href: '/users/staff',
        roles: ['Manager', 'Admin']
      },
      {
        name: 'Cài đặt',
        iconName: 'Settings',
        href: '/settings',
        roles: ['Admin', 'Manager']
      },
      {
        name: 'Thông tin cá nhân',
        iconName: 'User',
        href: '/settings/profile',
        roles: ['Manager', 'SaleStaff', 'WarehouseStaff', 'Admin'],
        hidden: true
      },
    ],
  },
];

export const getAllAdminPaths = (): string[] => {
  const paths = new Set<string>();
  ADMIN_MENU_CONFIG.forEach(section => {
    section.items.forEach(item => {
      if (item.href) paths.add(item.href);
      item.subItems?.forEach(sub => paths.add(sub.href));
    });
  });
  return Array.from(paths);
};

export const getAllowedRoutes = (userRole: string): string[] => {
  const allowed: string[] = [];

  ADMIN_MENU_CONFIG.forEach(section => {
    section.items.forEach(item => {
      if (item.roles && !item.roles.includes(userRole)) return;

      if (item.href) allowed.push(item.href);

      item.subItems?.forEach(sub => {
        if (!sub.roles || sub.roles.includes(userRole)) {
          allowed.push(sub.href);
        }
      });
    });
  });

  return allowed;
};
