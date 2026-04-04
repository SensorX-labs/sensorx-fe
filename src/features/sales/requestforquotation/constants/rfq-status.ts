export enum RfqStatus {
    DRAFT = 'DRAFT', // Nháp
    PENDING = 'PENDING', // Chờ phân bổ
    ACCEPTED = 'ACCEPTED', // Đã tiếp nhận
    REJECTED = 'REJECTED', // Đã từ chối
    RESPONDED = 'RESPONDED', // đã thương lượng
    NEGOTIATING = 'NEGOTIATING', // đang thương lượng
    CONVERTED = 'CONVERTED', // đã chuyển đổi thành báo giá
}