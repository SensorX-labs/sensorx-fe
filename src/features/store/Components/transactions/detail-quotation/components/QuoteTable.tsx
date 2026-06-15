export function QuoteTable({ quote }: any) {
  return (
    <div className="bg-white px-8 pb-8">
      <div className="mb-5">
        <h3 className="rounded-2xl border border-[#edf1f4] bg-[#fbfcfd] px-4 py-3 text-lg font-semibold text-gray-900">
          Chi tiết sản phẩm
        </h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e6ebf1] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <table className="w-full">
          <thead className="bg-[#f8fafc]">
            <tr className="border-b border-[#edf1f4]">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">Sản phẩm</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">ĐVT</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">SL</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500">Đơn giá</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500">Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {quote.items.map((item: any) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 transition-colors hover:bg-[#f8fafc]"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-gray-900">
                    {item.productName || 'Chưa cập nhật'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">Mã: {item.productCode}</p>
                </td>

                <td className="px-6 py-5 text-center text-sm text-gray-700">{item.unit}</td>

                <td className="px-6 py-5 text-center font-semibold">{item.quantity}</td>

                <td className="px-6 py-5 text-right text-sm text-gray-700">
                  {item.unitPrice.toLocaleString('vi-VN')}
                </td>

                <td className="px-6 py-5 text-right font-semibold text-gray-900">
                  {item.totalLineAmount.toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-[#e6ebf1] bg-[#fbfcfd] p-6 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tạm tính</span>
            <span className="font-semibold">{quote.subtotal.toLocaleString('vi-VN')} ₫</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">VAT</span>
            <span className="font-semibold">{quote.totalTax.toLocaleString('vi-VN')} ₫</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
            <span className="text-2xl font-bold text-gray-900">
              {quote.grandTotal.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
