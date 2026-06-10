# Kế hoạch Chi tiết: Giai đoạn 3 (Thiết kế API Báo cáo Kho) - Đã Chốt

## 1. Vị trí triển khai (Location)
- **Service:** `SensorX.Warehouse`
- **Endpoint:** `GET /api/analytics/warehouse-report`
- **Tên Query:** `GetWarehouseReportStatsQuery`
- **Thư mục lưu trữ:** `SensorX.Warehouse.Application\Queries\Analytics\GetWarehouseReportStats\`

## 2. Logic tính toán chi tiết (Code Logic)

Trong `GetWarehouseReportStatsHandler`, inject `IQueryBuilder<InventoryItem>`, `IQueryBuilder<StockIn>`, và `IQueryBuilder<StockOut>`.

### 2.1 Chỉ số Tổng quan (Core Metrics)
Lấy theo `TimeRange` (tháng/tuần/ngày):
- `TotalInventory`: Tổng `Quantity` của tất cả `InventoryItem` hiện tại.
- `InboundThisPeriod`: Tổng `Quantity` trong `StockIn` thuộc kỳ đang xét.
- `OutboundThisPeriod`: Tổng `Quantity` trong `StockOut` thuộc kỳ đang xét.
- `TotalInventoryValue`: Tính tổng giá trị lưu động: Sum(`InventoryItem.Quantity * Product.Price`).

### 2.2 Biểu đồ Xuất Nhập (Inbound/Outbound Chart)
- Group `StockIn` và `StockOut` theo Tháng (nếu TimeRange là Năm/Toàn thời gian) hoặc theo Ngày (nếu TimeRange là Tuần/Tháng).
- Trả về 1 mảng các điểm dữ liệu `[ { period: "Th1", inbound: 2800, outbound: 2400 }, ... ]`.

### 2.3 Phân bổ Danh mục (Category Distribution - Pie Chart)
- Join `InventoryItem` với `Product`.
- Group by `Product.Category`.
- Sum `Quantity` để lấy số lượng tồn kho theo từng ngành hàng.

### 2.4 Bảng Dữ liệu Chi tiết Kho (Warehouse Table)
- Lấy danh sách các `Category`.
- Với mỗi `Category`, trả về:
  - `TotalItems`: Số lượng chủng loại sản phẩm.
  - `InStock`: Tổng số lượng tồn vật lý hiện hành.
  - `Imported`: Tổng số lượng nhập (`StockIn`) trong kỳ.
  - `Exported`: Tổng số lượng xuất (`StockOut`) trong kỳ.
  - `Value`: Tổng giá trị định giá của danh mục đó trong kho.

## 3. Mẫu dữ liệu lấy ra (Data Model)
Trả về 1 Response Model duy nhất `WarehouseReportStatsResponse`:

```csharp
public class WarehouseReportStatsResponse 
{
    public int TotalInventory { get; set; }
    public int InboundThisPeriod { get; set; }
    public double InboundGrowthPercent { get; set; }
    public int OutboundThisPeriod { get; set; }
    public double OutboundGrowthPercent { get; set; }
    public decimal TotalInventoryValue { get; set; }

    public List<InboundOutboundChartDto> InboundOutboundChart { get; set; }
    public List<CategoryDistributionDto> CategoryDistribution { get; set; }

    public List<WarehouseCategoryTableDto> CategoryTableData { get; set; }
}
```

## 4. Tích hợp Front-end
- Tạo `src/features/system/analytics/hooks/use-warehouse-analytics.ts`.
- Gọi API `/analytics/warehouse-report` và bind trực tiếp vào trang `reports-warehouse-page.tsx`.
