export enum QuoteStatus {
    DRAFT = 'Draft',        // Nháp
    PENDING = 'Pending',    // Chờ duyệt
    RETURNED = 'Returned',  // Sếp từ chối
    APPROVED = 'Approved',  // Đã duyệt
    SENT = 'Sent',          // Đã gửi khách
    ORDERED = 'Ordered',    // Đã sinh đơn hàng 
    EXPIRED = 'Expired',    // Hết hạn
}