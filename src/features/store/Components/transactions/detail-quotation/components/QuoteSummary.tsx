import {
    Calendar,
    DollarSign,
    Package,
} from 'lucide-react';

export function QuoteSummary({
    quote,
}: any) {
    return (
        <div className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* DATE */}

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-gray-500" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Ngày báo giá
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                {quote.quoteDate
                                    ? new Date(
                                        quote.quoteDate
                                    ).toLocaleDateString(
                                        'vi-VN'
                                    )
                                    : '---'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TOTAL */}

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Tổng giá trị
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                {quote.grandTotal.toLocaleString(
                                    'vi-VN'
                                )}{' '}
                                đ
                            </p>
                        </div>
                    </div>
                </div>

                {/* PRODUCT */}

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-500" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Hạng mục
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                {
                                    quote.items.length
                                }{' '}
                                sản phẩm
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}