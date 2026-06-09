export function QuoteTable({
    quote,
}: any) {
    return (
        <div className="px-8 pb-8">

            <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    Chi tiết sản phẩm
                </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">

                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-100">

                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                                Sản phẩm
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                                ĐVT
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                                SL
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500">
                                Đơn giá
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500">
                                Thành tiền
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {quote.items.map(
                            (
                                item: any
                            ) => (
                                <tr
                                    key={
                                        item.id
                                    }
                                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                                >
                                    <td className="px-6 py-5">

                                        <p className="font-semibold text-gray-900">
                                            {item.productName || 'Chưa cập nhật'}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Mã: {item.productCode}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5 text-center text-sm text-gray-700">
                                        {
                                            item.unit
                                        }
                                    </td>

                                    <td className="px-6 py-5 text-center font-semibold">
                                        {
                                            item.quantity
                                        }
                                    </td>

                                    <td className="px-6 py-5 text-right text-sm text-gray-700">
                                        {item.unitPrice.toLocaleString(
                                            'vi-VN'
                                        )}
                                    </td>

                                    <td className="px-6 py-5 text-right font-semibold text-gray-900">
                                        {item.totalLineAmount.toLocaleString(
                                            'vi-VN'
                                        )}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* TOTAL */}

            <div className="mt-8 flex justify-end">

                <div className="w-full max-w-sm rounded-xl bg-gray-50 border border-gray-100 p-6 space-y-4">

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Tạm tính
                        </span>

                        <span className="font-semibold">
                            {quote.subtotal.toLocaleString(
                                'vi-VN'
                            )}{' '}
                            đ
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            VAT
                        </span>

                        <span className="font-semibold">
                            {quote.totalTax.toLocaleString(
                                'vi-VN'
                            )}{' '}
                            đ
                        </span>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">

                        <span className="text-base font-semibold text-gray-900">
                            Tổng cộng
                        </span>

                        <span className="text-2xl font-bold text-gray-900">
                            {quote.grandTotal.toLocaleString(
                                'vi-VN'
                            )}{' '}
                            đ
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}