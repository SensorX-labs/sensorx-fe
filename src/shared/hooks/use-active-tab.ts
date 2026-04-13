'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const routeMap: Record<string, string> = {
  '/dashboard': 'Bảng điều khiển',
  '/catalog/products': 'Hàng hóa',
  '/catalog/categories': 'Danh mục',
  '/catalog/uoms': 'Đơn vị tính',
  '/sales/customers': 'Khách hàng',
  '/sales/requestforquotation': 'Yêu cầu báo giá',
  '/sales/quotations': 'Báo giá',
  '/sales/orders': 'Đơn hàng',
  '/sales/invoices': 'Hóa đơn',
  '/warehouse/stockin': 'Phiếu nhập kho',
  '/warehouse/stockout': 'Phiếu xuất kho',
  '/warehouse/stock': 'Tồn kho',
  '/warehouse/picking-note': 'Phiếu soạn kho',
  '/warehouse/list': 'Danh sách kho',
  '/warehouse/supply-requests': 'Yêu cầu cung ứng',
  '/warehouse/transfer-orders': 'lệnh điều chuyển',
  '/users/staff': 'Nhân viên',
  '/settings': 'Cài đặt',
  '/reports/revenue': 'Báo cáo doanh thu',
  '/reports/sales': 'Báo cáo bán hàng',
  '/reports/warehouse': 'Báo cáo kho hàng',
};

export function useActiveTab() {
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    if (routeMap[pathname]) return routeMap[pathname];

    const entry = Object.entries(routeMap).find(([path]) => 
      pathname.startsWith(path) && path !== '/dashboard'
    );
    
    return entry ? entry[1] : 'Dashboard';
  }, [pathname]);

  return activeTab;
}
