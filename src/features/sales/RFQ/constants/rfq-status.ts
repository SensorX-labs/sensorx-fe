export enum RfqStatus {
    DRAFT = 'Draft', // Nháp
    PENDING = 'Pending', // Chờ tiếp nhận
    ACCEPTED = 'Accepted', // Đã tiếp nhận
    REJECTED = 'Rejected', // Đã từ chối
    CONVERTED = 'Converted', // Đã chuyển đổi thành báo giá
}

export const statusStyles: Record<string, string> = {
    [RfqStatus.DRAFT]: 'bg-gray-50 text-gray-500 border-gray-200',
    [RfqStatus.PENDING]: 'bg-amber-50 text-amber-600 border-amber-100',
    [RfqStatus.ACCEPTED]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    [RfqStatus.REJECTED]: 'bg-rose-50 text-rose-600 border-rose-100',
    [RfqStatus.CONVERTED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

export const statusLabels: Record<string, string> = {
    [RfqStatus.DRAFT]: 'Nháp',
    [RfqStatus.PENDING]: 'Chờ tiếp nhận',
    [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
    [RfqStatus.REJECTED]: 'Đã từ chối',
    [RfqStatus.CONVERTED]: 'Đã sinh báo giá',
};