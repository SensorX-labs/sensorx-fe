import { cn } from '@/shared/utils';

import { Clock, CheckCircle2 } from 'lucide-react';

export type Status = 'Pending' | 'Accepted' | 'Declined' | 'Expired';
const statusLabel: Record<Status, { label: string; icon: any; className: string }> = {
    'Pending': {
        label: 'Chờ phản hồi',
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    'Accepted': {
        label: 'Đã chốt',
        icon: CheckCircle2,
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    'Declined': {
        label: 'Đã từ chối',
        icon: CheckCircle2,
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    'Expired': {
        label: 'Hết hạn',
        icon: Clock,
        className: 'bg-red-50 text-red-700 border-red-200',
    }
};
interface QuoteHeaderProps {
    status: Status;
    code: string;
}

export function QuoteHeader({
    status,
    code
}: QuoteHeaderProps) {
    const currentStatusConfig = statusLabel[status];

    return (
        <div className="px-8 py-7 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>
                <p className="text-sm text-gray-500 mb-2">
                    Số báo giá
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                    {code}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div
                    className={cn(
                        'px-4 py-2 rounded-full border text-sm font-semibold',
                        currentStatusConfig?.className || 'bg-gray-50 text-gray-700 border-gray-200'
                    )}
                >
                    {currentStatusConfig?.label || status}
                </div>
            </div>
        </div>
    );
}