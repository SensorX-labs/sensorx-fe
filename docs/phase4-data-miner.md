# Kế hoạch Chi tiết: Giai đoạn 4 (Phát triển Miner & Giả lập Dữ liệu Kho) - Đã Chốt

Dựa trên cấu trúc hệ thống (có 2 kho vận `warehouse-api-1`, `warehouse-api-2`) và luồng nghiệp vụ thực tế (xuất kho phải qua PickingNote và Invoice phải thanh toán qua Sepay), Giai đoạn 4 sẽ được thiết kế lại chi tiết và bám sát logic hệ thống.

## 1. Vị trí triển khai
- **Project:** `SensorX.Miner` (Node.js).
- **Mục tiêu:** Sinh dữ liệu phục vụ test biểu đồ kho, bao gồm tạo tài khoản và mô phỏng chu trình Nhập - Xuất phức tạp.

## 2. Chi tiết các công việc (Proposed Changes)

### 2.1 Tạo Tài khoản cho 2 Kho
- **Script/Logic:** Tạo đúng **2 tài khoản** nhân viên kho.
- **Phân bổ:** 
  - Tài khoản 1 gán quản lý Kho 1 (`warehouse-1`).
  - Tài khoản 2 gán quản lý Kho 2 (`warehouse-2`).
- **Mật khẩu:** `123456` cho cả 2 tài khoản.

### 2.2 Giả lập Nhập Kho (Inbound) - `import_warehouse_inbound.js`
- **Mục tiêu:** Tạo dữ liệu tồn kho đầu vào và vẽ biểu đồ Inbound.
- **Logic thực hiện:**
  - Lấy danh sách Product hiện có.
  - Sinh ngẫu nhiên các giao dịch **StockIn (Nhập kho)** trải dài trong quá khứ 3 - 6 tháng.
  - Cập nhật số lượng vật lý vào Tồn kho (Inventory) của 2 kho để đảm bảo có hàng phục vụ xuất.
  - Script này chạy độc lập và có thể chạy lại nhiều lần để bơm thêm hàng.

### 2.3 Giả lập Xuất Kho (Outbound) - `simulate_warehouse_outbound.js`
- **Mục tiêu:** Mô phỏng thao tác của nhân viên kho trên các PickingNote có sẵn để tạo dữ liệu StockOut (Xuất kho).
- **Vấn đề Sepay & Thanh toán:** Mô phỏng thanh toán để thỏa mãn điều kiện xuất kho.
- **Logic thực hiện:**
  1. **Quét dữ liệu:** Lấy danh sách các Đơn hàng / PickingNote hiện có.
  2. **Xử lý Thanh toán (Mock Payment):** Gửi request giả lập Webhook của Sepay HOẶC chọc thẳng API/DB để set trạng thái Invoice = `Paid`, từ đó mở khóa các PickingNote.
  3. **Xử lý Thiếu hàng:** Kiểm tra các PickingNote vừa được mở khóa xem Kho có đủ hàng không.
     - *Nếu thiếu hàng:* Gọi tự động hàm nhập hàng để bơm thêm tồn kho.
  4. **Mô phỏng Thao tác Xuất kho:** Lặp qua các PickingNote đã đủ điều kiện, tự động gọi các API thao tác của nhân viên kho theo thứ tự:
     - `StartPicking` (Bắt đầu soạn hàng).
     - `CompletePicking` / `Packed` (Đóng gói).
     - `Ship` / `CreateStockOut` (Hoàn tất xuất kho -> tạo record StockOut).
  5. Việc này sẽ sinh ra dữ liệu xuất kho chuẩn nghiệp vụ để thống kê.

## 3. Thực thi
- Quá trình chạy Miner sẽ được thực hiện bằng 2 lệnh riêng biệt sau khi hệ thống backend hoàn thiện:
  - `node src/import_warehouse_inbound.js`
  - `node src/simulate_warehouse_outbound.js`
