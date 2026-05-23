import { CanAccess } from '@/shared/components/common/can-access';

import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

import { cn } from '@/shared/utils';

import {
    statusLabels,
    statusStyles,
} from '../constants';

export function QuoteHeader({
    quote,
    onAccept,
    onReject,
}: any) {
    const statusStyle =
        statusStyles[quote.status];

    const statusLabel =
        statusLabels[quote.status];

    return (
        <div className="px-8 py-7 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>
                <p className="text-sm text-gray-500 mb-2">
                    Số báo giá
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                    {quote.code}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">

                <div
                    className={cn(
                        'px-4 py-2 rounded-full border text-sm font-semibold',
                        statusStyle
                    )}
                >
                    {statusLabel}
                </div>

                <CanAccess roles={['Customer']}>
                    {(quote.status ===
                        QuoteStatus.SENT ||
                        quote.status ===
                        QuoteStatus.APPROVED) && (
                            <>
                                <button
                                    onClick={onAccept}
                                    className="h-11 px-5 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition-all"
                                >
                                    Chốt báo giá
                                </button>

                                <button
                                    onClick={onReject}
                                    className="h-11 px-5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                >
                                    Từ chối
                                </button>
                            </>
                        )}
                </CanAccess>
            </div>
        </div>
    );
}