export enum OrderStatus {
    PendingPayment = "PendingPayment" , // chờ thanh toán
    Processing = "Processing", // đang chuẩn bị đơn hàng
    Dispatched = "Dispatched", // đã xuất kho
    Cancelled = "Cancelled" // đơn bị hủy
}