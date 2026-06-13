# Kế hoạch Chi tiết: Giai đoạn 1 (Tái cấu trúc Front-end Báo cáo) - Đã Chốt

## Mục tiêu
Dọn dẹp triệt để thư mục `analytics/components` và `app/(admin)`, xóa bỏ các route thừa. Chỉ giữ lại đúng 2 route: `/reports/business` và `/reports/warehouse`.

## Các bước triển khai (Proposed Changes)

### 1. Dọn dẹp Files & Routes thừa (Clean-up)
- **Delete Route** `src/app/(admin)/dashboard`
- **Delete Route** `src/app/(admin)/reports/revenue`
- **Delete Route** `src/app/(admin)/reports/sales`
- **Delete Component** `src/features/system/analytics/components/admin/dashboard-page.tsx`
- **Delete Component** `src/features/system/analytics/components/admin/reports-revenue-page.tsx`
- **Delete Component** `src/features/system/analytics/components/admin/reports-sales-page.tsx`
- **Delete Adapter** `src/features/system/analytics/components/admin/dashboard-adapter.ts`

### 2. Thiết lập cấu trúc Route & Components mới
**2.1 Báo cáo Kinh Doanh**
- **New Route:** Tạo thư mục `src/app/(admin)/reports/business/page.tsx`.
- **New Component:** Tạo `src/features/system/analytics/components/admin/reports-business-page.tsx`.
  - Cấu trúc giao diện sẽ bám sát 4 nhóm chỉ số đã chốt (Core KPIs, Conversion, Product, Customer).
  - Tạm thời kết nối các dữ liệu đã có ở Backend (Doanh thu, Lợi nhuận, Đơn hàng, AOV, Top sản phẩm).
  - Các dữ liệu chưa có (như tỷ lệ chuyển đổi Quote->Order, Tỷ lệ khách hàng quay lại) sẽ để UI trống/mock tạm để sang **Giai đoạn 2** nâng cấp backend và gắn vào.
- **New Hook:** Tạo `src/features/system/analytics/hooks/use-business-analytics.ts` chuyên xử lý gọi API (`getDashboardStats`, `getRevenueReport`) để cung cấp data.

**2.2 Báo cáo Kho Vận**
- **Keep Route:** Giữ nguyên thư mục `src/app/(admin)/reports/warehouse/page.tsx`.
- **Modify Component:** Chỉnh sửa `src/features/system/analytics/components/admin/reports-warehouse-page.tsx`. Làm sạch code và thiết kế lại cho phù hợp với data thực tế từ backend.
- **New Hook:** Tạo `src/features/system/analytics/hooks/use-warehouse-analytics.ts` chuyên gọi API `getWarehouseStats`.

### 3. Cập nhật Sidebar Menu
- **Modify File:** `src/shared/configs/admin-menu.config.ts`.
  - Xóa item "Bảng điều khiển" (LayoutDashboard).
  - Đổi item "Báo cáo" thành menu phẳng hoặc gom lại gọn gàng với 2 menu con:
    - `Báo cáo kinh doanh` -> `href: '/reports/business'`
    - `Báo cáo kho vận` -> `href: '/reports/warehouse'`
