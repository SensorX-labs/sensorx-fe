export enum RfqStatus {
    DRAFT = 'Draft', // Nháp
    PENDING = 'Pending', // Chờ tiếp nhận
    ACCEPTED = 'Accepted', // Đã tiếp nhận
    REJECTED = 'Rejected', // Đã từ chối
    RESPONDED = 'Responded', // Đã phản hồi khách hàng
    CONVERTED = 'Converted', // Đã chuyển đổi thành đơn hàng
}

export const statusStyles: Record<string, string> = {
    [RfqStatus.DRAFT]: 'bg-slate-50 text-slate-500 border-slate-200',
    [RfqStatus.PENDING]: 'bg-amber-50 text-amber-600 border-amber-100',
    [RfqStatus.ACCEPTED]: 'bg-brand-green-50 text-brand-green-600 border-brand-green-100',
    [RfqStatus.REJECTED]: 'bg-rose-50 text-rose-600 border-rose-100',
    [RfqStatus.RESPONDED]: 'bg-blue-50 text-blue-600 border-blue-100',
    [RfqStatus.CONVERTED]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

export const statusLabels: Record<string, string> = {
    [RfqStatus.DRAFT]: 'Nháp',
    [RfqStatus.PENDING]: 'Chờ tiếp nhận',
    [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
    [RfqStatus.REJECTED]: 'Đã từ chối',
    [RfqStatus.RESPONDED]: 'Đã phản hồi',
    [RfqStatus.CONVERTED]: 'Đã chốt đơn',
};