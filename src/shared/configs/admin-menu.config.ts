import { 
  LayoutDashboard, Users, FileText, ShoppingCart, Receipt, 
  Package, Layers, PackagePlus, PackageMinus, Warehouse, 
  TrendingUp, BarChart3, Settings, UserCircle, Shield, 
  FileEdit, FolderTree, ClipboardList, ArrowRightLeft, 
  BadgeDollarSign, LineChart, PieChart, Boxes 
} from 'lucide-react';

export const MENU_ICONS: Record<string, any> = {
  LayoutDashboard, Users, FileText, ShoppingCart, Receipt, 
  Package, Layers, PackagePlus, PackageMinus, Warehouse, 
  TrendingUp, BarChart3, Settings, UserCircle, Shield, 
  FileEdit, FolderTree, ClipboardList, ArrowRightLeft, 
  BadgeDollarSign, LineChart, PieChart, Boxes
};

export interface MenuItem {
  name: string;
  iconName: string;
  href?: string;
  roles?: string[];
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
        href: '/sales/requestforquotation',
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
    ],
  },
];

/**
 * Lấy danh sách tất cả các path trong Admin Area
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
 * Kiểm tra xem một Path có bị chặn đối với Role hiện tại không dựa trên config
 */
export const isRouteBlocked = (pathname: string, userRole: string): boolean => {
  for (const section of ADMIN_MENU_CONFIG) {
    for (const item of section.items) {
      const isParentMatch = item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`));
      
      // Nếu khớp với menu cha
      if (isParentMatch) {
        if (item.roles && !item.roles.includes(userRole)) return true;
      }
      
      // Kiểm tra menu con (ngay cả khi không khớp cha, vì con có href riêng)
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (pathname === sub.href || pathname.startsWith(`${sub.href}/`)) {
            // Chặn nếu cha yêu cầu quyền mà user không có
            if (item.roles && !item.roles.includes(userRole)) return true;
            // Chặn nếu bản thân con yêu cầu quyền mà user không có
            if (sub.roles && !sub.roles.includes(userRole)) return true;
          }
        }
      }
    }
  }
  return false;
};

/**
 * Tìm đường dẫn hợp lệ đầu tiên mà Role này được phép truy cập
 */
export const getFirstAllowedPath = (userRole: string): string => {
  for (const section of ADMIN_MENU_CONFIG) {
    for (const item of section.items) {
      // Nếu cha yêu cầu quyền mà user không có -> Bỏ qua cả cụm này (bao gồm cả con)
      if (item.roles && !item.roles.includes(userRole)) continue;

      // Nếu menu chính có href
      if (item.href) return item.href;
      
      // Kiểm tra menu con
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (!sub.roles || sub.roles.includes(userRole)) {
            return sub.href;
          }
        }
      }
    }
  }
  return '/'; // Mặc định về trang chủ nếu không có quyền nào
};
