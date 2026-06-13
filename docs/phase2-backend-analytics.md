# Kế hoạch Chi tiết: Giai đoạn 2 (Xây dựng API Thống kê Báo cáo Kinh doanh) - Đã chốt

## 1. Vị trí triển khai (Location)
Tất cả sẽ được thực hiện trong project **`SensorX.Master`** (vì service này nắm giữ Order, Quote, và Customer data).
- **Endpoint:** `GET /api/analytics/business-report`
- **Query File:** `SensorX.Master.Application\Queries\Analytics\GetBusinessReportStats\GetBusinessReportStatsQuery.cs`
- **Handler File:** `GetBusinessReportStatsHandler.cs`

## 2. Logic tính toán chi tiết (Code Logic)

Trong `GetBusinessReportStatsHandler`, chúng ta sẽ inject các `IQueryBuilder<T>` (Order, Quote, Customer) để tính toán gom nhóm dữ liệu trong 1 Query duy nhất dựa theo `TimeRange` (Từ ngày - Đến ngày).

### 2.1 Chỉ số cốt lõi (Core KPIs) & Top Sản phẩm
- `TotalRevenue`: Tổng `Order.TotalAmount` của các đơn hàng thành công trong kỳ.
- `GrossProfit`: Lợi nhuận = Doanh thu - Chi phí vốn (Cost).
- `TotalOrders`: Tổng số đơn hàng (`Count` của Order).
- `AOV`: `TotalRevenue` / `TotalOrders`.
- `TopProducts`: Truy xuất từ `OrderItem`, Group by `ProductId`, Sum(Quantity) và Sum(Price) -> Lấy Top 5.

### 2.2 Tỷ lệ chuyển đổi Quote (Conversion Rate)
- `TotalQuotes`: Đếm số lượng Quote được tạo trong khoảng thời gian.
- `ConvertedQuotes`: Đếm số lượng Quote có `Status == QuoteStatus.Ordered` (hoặc `Converted`).
- `ConversionRate`: `(ConvertedQuotes / TotalQuotes) * 100`.

### 2.3 Thông tin khách hàng (Customer Insights)
- `NewCustomers`: Đếm số lượng Customer có `CreatedAt` nằm trong khoảng thời gian đang xét.
- `ReturningCustomers`: Đếm số lượng Customer có phát sinh Order trong kỳ này, NHƯNG `CreatedAt` của họ nằm ở trước kỳ đang xét (tức là khách cũ quay lại mua).
- `TopCustomers`: Lấy Top 5 khách hàng đóng góp doanh thu lớn nhất trong kỳ thông qua việc Group Order theo `CustomerId` và Sum(`TotalAmount`).

## 3. Mẫu dữ liệu lấy ra (Data Model)
Response trả về cho API sẽ gộp chung tất cả trong 1 Object: `BusinessReportStatsResponse`:

```csharp
public class BusinessReportStatsResponse 
{
    // 1. Core
    public decimal TotalRevenue { get; set; }
    public decimal GrossProfit { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    
    // 2. Conversion
    public int TotalQuotes { get; set; }
    public int ConvertedQuotes { get; set; }
    public double ConversionRate { get; set; }

    // 3. Customers
    public int NewCustomers { get; set; }
    public int ReturningCustomers { get; set; }
    public List<CustomerRevenueDto> TopCustomers { get; set; }

    // 4. Products
    public List<ProductSalesDto> TopProducts { get; set; }
}
```

## 4. Xử lý trên Front-end
- Tạo custom hook `useBusinessReportStats(timeRange)` trong thư mục `hooks` của page analytics.
- Hook này gọi đúng 1 API: `api.master.get('/analytics/business-report')`.
- Không cần Adapter trung gian, response model map thẳng 1-1 với UI component.
