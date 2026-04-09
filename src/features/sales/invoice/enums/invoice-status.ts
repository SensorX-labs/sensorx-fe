export enum InvoiceStatus {
    UNPAID = "UNPAID", // chờ thanh toán 
    PARTIALLYPAID = "PARTIALLYPAID", // thanh toán một phần
    PAID = "PAID", // đã thanh toán
    ISSUED = "ISSUED", // đã xuất hóa đơn
    CANCELLED = "CANCELLED" // đã hủy
}