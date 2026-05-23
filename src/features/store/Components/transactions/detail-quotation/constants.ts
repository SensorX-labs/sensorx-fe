import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

export const cardClass =
    'bg-white rounded-xl border border-gray-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)]';

export const inputClass =
    'w-full h-12 px-4 rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900';

export const textareaClass =
    'w-full p-4 rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 resize-none';

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