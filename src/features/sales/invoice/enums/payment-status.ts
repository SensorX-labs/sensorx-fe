export enum PaymentStatus {
    PENDING = "Pending", // chờ - dùng khi sinh QR 
    PARTIALLY_PAID = "PartiallyPaid", // đã thanh toán một phần
    COMPLETED = "Completed", // hoàn thành : tiền đã vào túi
    FAILED = "Failed", // thất bại
    CANCELLED = "Cancelled" // bị hủy
}