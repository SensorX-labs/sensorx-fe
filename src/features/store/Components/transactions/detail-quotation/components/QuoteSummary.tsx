import { Calendar, DollarSign, Package } from 'lucide-react';

export function QuoteSummary({ quote }: any) {
  return (
    <div className="border-b border-[#edf1f4] bg-white p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e6ebf1] bg-[#f8fafc] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6ebf1] bg-white shadow-sm">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Ngày báo giá</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {quote.quoteDate ? new Date(quote.quoteDate).toLocaleDateString('vi-VN') : '---'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6ebf1] bg-[#f8fafc] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6ebf1] bg-white shadow-sm">
              <DollarSign className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng giá trị</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {quote.grandTotal.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6ebf1] bg-[#f8fafc] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6ebf1] bg-white shadow-sm">
              <Package className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hạng mục</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {quote.items.length} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
