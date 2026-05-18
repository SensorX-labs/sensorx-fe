import {
  LayoutDashboard, Users, FileText, ShoppingCart, Receipt,
  Package, Layers, PackagePlus, PackageMinus, Warehouse,
  TrendingUp, BarChart3, Settings, UserCircle, Shield,
  FileEdit, FolderTree, ClipboardList, ArrowRightLeft,
  BadgeDollarSign, LineChart, PieChart, Boxes, User
} from 'lucide-react';

export const MENU_ICONS: Record<string, any> = {
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
        name: 'Khách hàng',
        iconName: 'Users',
        href: '/sales/customers',
        roles: ['Manager', 'SaleStaff']
      },
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
    ],
  },
  {
    title: 'DANH MỤC',
    items: [
      {
        name: 'Danh mục sản phẩm',
        iconName: 'FolderTree',
        href: '/catalog/categories',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Bảng giá nội bộ',
        iconName: 'BadgeDollarSign',
        href: '/catalog/internal-prices',
        roles: ['Manager', 'SaleStaff']
      },
      {
        name: 'Hàng hóa',
        iconName: 'Package',
        href: '/catalog/products',
        roles: ['Manager', 'SaleStaff']
      },
    ],
  },
  {
    title: 'KHO HÀNG',
    items: [
      {
        name: 'Phiếu nhập kho',
        iconName: 'PackagePlus',
        href: '/warehouse/stockin',
        roles: ['Manager', 'WarehouseStaff']
      },
      {
        name: 'Phiếu xuất kho',
        iconName: 'PackageMinus',
        href: '/warehouse/stockout',
        roles: ['Manager', 'WarehouseStaff']
      },
      {
        name: 'Tồn kho',
        iconName: 'Warehouse',
        href: '/warehouse/stock',
        roles: ['Manager', 'WarehouseStaff']
      },
      {
        name: 'Phiếu soạn kho',
        iconName: 'FileEdit',
        href: '/warehouse/picking-note',
        roles: ['Manager', 'WarehouseStaff']
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
        roles: ['Manager']
      },
      {
        name: 'lệnh điều chuyển',
        iconName: 'ArrowRightLeft',
        href: '/warehouse/transfer-orders',
        roles: ['Manager']
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
        roles: ['Manager', 'Admin']
      },
      {
        name: 'Nhân viên',
        iconName: 'UserCircle',
        href: '/users/staff',
        roles: ['Manager']
      },
      {
        name: 'Cài đặt',
        iconName: 'Settings',
        href: '/settings',
        roles: ['Admin']
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

/**
 * Lấy danh sách tất cả các path trong Admin Area (không phân biệt quyền)
 */
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

/**
 * Lấy danh sách các Route được phép truy cập cho một Role cụ thể (Whitelist)
 */
export const getAllowedRoutes = (userRole: string): string[] => {
  const allowed: string[] = [];

  ADMIN_MENU_CONFIG.forEach(section => {
    section.items.forEach(item => {
      // Nếu cha yêu cầu quyền mà user không có -> Bỏ qua toàn bộ cụm
      if (item.roles && !item.roles.includes(userRole)) return;

      // Thêm href của menu chính
      if (item.href) allowed.push(item.href);

      // Kiểm tra menu con
      item.subItems?.forEach(sub => {
        if (!sub.roles || sub.roles.includes(userRole)) {
          allowed.push(sub.href);
        }
      });
    });
  });

  return allowed;
};
