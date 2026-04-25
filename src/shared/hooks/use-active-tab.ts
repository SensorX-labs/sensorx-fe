'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export type TabInfo = {
  title: string;
  description?: string;
};

const routeMap: Record<string, TabInfo> = {
  '/dashboard': {
    title: 'Bảng điều khiển',
    description: 'Tổng quan hoạt động kinh doanh, số liệu và tình trạng hệ thống theo thời gian thực',
  },

  '/reports/revenue': {
    title: 'Báo cáo doanh thu',
    description: 'Phân tích doanh thu theo thời gian, khách hàng và kênh bán hàng',
  },
  '/reports/sales': {
    title: 'Báo cáo bán hàng',
    description: 'Theo dõi hiệu suất bán hàng, đơn hàng và xu hướng tiêu thụ sản phẩm',
  },
  '/reports/warehouse': {
    title: 'Báo cáo kho hàng',
    description: 'Thống kê tồn kho, nhập xuất và tình trạng luân chuyển hàng hóa',
  },

  '/sales/customers': {
    title: 'Khách hàng',
    description: 'Quản lý thông tin khách hàng và lịch sử giao dịch',
  },
  '/sales/requestforquotation': {
    title: 'Yêu cầu báo giá',
    description: 'Tiếp nhận và quản lý các yêu cầu báo giá từ khách hàng',
  },
  '/sales/quotations': {
    title: 'Báo giá',
    description: 'Tạo và quản lý các báo giá gửi tới khách hàng',
  },
  '/sales/orders': {
    title: 'Đơn hàng',
    description: 'Quản lý đơn hàng từ tạo mới đến hoàn tất',
  },
  '/sales/invoices': {
    title: 'Hóa đơn',
    description: 'Quản lý hóa đơn và theo dõi tình trạng thanh toán',
  },

  '/warehouse/stockin': {
    title: 'Phiếu nhập kho',
    description: 'Ghi nhận và quản lý các hoạt động nhập hàng vào kho',
  },
  '/warehouse/stockout': {
    title: 'Phiếu xuất kho',
    description: 'Quản lý việc xuất hàng phục vụ bán hàng hoặc điều chuyển',
  },
  '/warehouse/stock': {
    title: 'Tồn kho',
    description: 'Theo dõi số lượng tồn và tình trạng hàng hóa trong kho',
  },
  '/warehouse/picking-note': {
    title: 'Phiếu soạn kho',
    description: 'Hỗ trợ soạn hàng theo đơn để chuẩn bị xuất kho',
  },
  '/warehouse/list': {
    title: 'Danh sách kho',
    description: 'Quản lý hệ thống kho và thông tin từng kho',
  },
  '/warehouse/supply-requests': {
    title: 'Yêu cầu cung ứng',
    description: 'Tạo và theo dõi các yêu cầu bổ sung hàng hóa',
  },
  '/warehouse/transfer-orders': {
    title: 'Lệnh điều chuyển',
    description: 'Quản lý việc điều chuyển hàng hóa giữa các kho',
  },

  '/users/staff': {
    title: 'Nhân viên',
    description: 'Quản lý thông tin nhân sự và phân quyền hệ thống',
  },
  '/settings': {
    title: 'Cài đặt',
    description: 'Cấu hình hệ thống và các thiết lập chung',
  },

  '/catalog/products': {
    title: 'Hàng hóa',
    description: 'Quản lý danh sách hàng hóa, thông tin và trạng thái kinh doanh',
  },
  '/catalog/categories': {
    title: 'Danh mục sản phẩm',
    description: 'Phân loại và tổ chức hệ thống danh mục sản phẩm',
  },
  '/catalog/internal-prices': {
    title: 'Bảng giá nội bộ',
    description: 'Quản lý chính sách giá, phân tầng số lượng và chiết khấu cho đối tác',
  },
};

export function useActiveTab(): TabInfo {
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    let result: string | TabInfo = 'Dashboard';

    if (routeMap[pathname]) {
      result = routeMap[pathname];
    } else {
      const entry = Object.entries(routeMap).find(([path]) =>
        pathname.startsWith(path) && path !== '/dashboard'
      );
      if (entry) result = entry[1];
    }

    if (typeof result === 'string') {
      return { title: result };
    }

    return result;
  }, [pathname]);

  return activeTab;
}
