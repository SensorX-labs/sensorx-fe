export enum PaymentStatus {
    PENDING = "PENDING" ,// chờ - dùng khi sinh QR 
    COMPLETED = "COMPLETED", // hoàn thành : tiền đã vào túi
    FAILED = "FAILED" // thất bại
}