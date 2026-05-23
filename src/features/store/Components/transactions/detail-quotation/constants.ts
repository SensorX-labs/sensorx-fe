import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

export const statusStyles: Record<
    string,
    string
> = {
    [QuoteStatus.DRAFT]:
        'bg-gray-100 text-gray-600 border-gray-200',

    [QuoteStatus.PENDING]:
        'bg-yellow-50 text-yellow-700 border-yellow-200',

    [QuoteStatus.APPROVED]:
        'bg-green-50 text-green-700 border-green-200',

    [QuoteStatus.RETURNED]:
        'bg-red-50 text-red-700 border-red-200',

    [QuoteStatus.SENT]:
        'bg-blue-50 text-blue-700 border-blue-200',

    [QuoteStatus.ORDERED]:
        'bg-emerald-50 text-emerald-700 border-emerald-200',

    [QuoteStatus.EXPIRED]:
        'bg-gray-100 text-gray-500 border-gray-200',
};

export const statusLabels: Record<
    string,
    string
> = {
    [QuoteStatus.DRAFT]: 'Nháp',
    [QuoteStatus.PENDING]:
        'Chờ phản hồi',

    [QuoteStatus.APPROVED]:
        'Đã chốt',

    [QuoteStatus.RETURNED]:
        'Đã từ chối',

    [QuoteStatus.SENT]:
        'Chờ phản hồi',

    [QuoteStatus.ORDERED]:
        'Đã chốt',

    [QuoteStatus.EXPIRED]:
        'Hết hạn',
};