export enum QuoteStatus {
    DRAFT = 'DRAFT', // Nháp
    PENDING = 'PENDING', // Chờ duyệt
    RETURNED = 'RETURNED', // Sếp từ chối
    APPROVED = 'APPROVED', // Đã duyệt
    SENT = 'SENT', // Đã gửi khách
    ORDERED = 'ORDERED', // Đã sinh đơn hàng 
    EXPIRED = 'EXPIRED', // Hết hạn
}