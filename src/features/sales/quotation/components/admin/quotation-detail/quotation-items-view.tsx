import React from 'react';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { GetDetailQuoteByIdResponse } from '../../../models/quote-detail-response';

interface QuotationItemsViewProps {
  quoteDetail: GetDetailQuoteByIdResponse;
}

export function QuotationItemsView({ quoteDetail }: QuotationItemsViewProps) {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="border border-gray-200 bg-white rounded overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">Danh sách sản phẩm</h4>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 w-28 text-center">Số lượng</th>
                <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                <th className="px-4 py-3 w-32 text-right">Tạm tính</th>
                <th className="px-4 py-3 w-24 text-center">Thuế %</th>
                <th className="px-4 py-3 w-32 text-right">Tiền thuế</th>
                <th className="px-6 py-3 w-32 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quoteDetail.items.map((item, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50/30">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex flex-col gap-0.5">
                        <div className="font-bold text-gray-900 text-base leading-tight">
                          {item.productName || 'Chưa cập nhật'}
                        </div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide">
                          Mã: {item.productCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-gray-800">
                      {item.quantity} {item.unit || 'cái'}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-800">
                      {item.unitPrice.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-800">
                      {item.lineAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-gray-800">
                      {item.taxRate}%
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-800">
                      {item.taxAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 border-l border-gray-50">
                      {item.totalLineAmount.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50/30 border-t border-gray-100">
              <tr>
                <td colSpan={7} className="p-0">
                  <div className="p-6">
                    <div className="ml-auto w-full md:w-80 space-y-3">
                      <div className="flex justify-between text-xs uppercase tracking-wider">
                        <span>Tạm tính:</span>
                        <span>{(quoteDetail.subtotal || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between text-xs uppercase tracking-wider">
                        <span>Thuế GTGT:</span>
                        <span>{(quoteDetail.totalTax || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-blue-600">
                        <span>TỔNG CỘNG:</span>
                        <span>{(quoteDetail.grandTotal || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="border border-gray-200 bg-white rounded shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <MessageSquare size={16} className="text-gray-400" />
          <h4 className="text-sm font-medium text-gray-900">Ghi chú & Điều khoản bổ sung</h4>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {quoteDetail.note || <span className="text-gray-400 italic">Không có ghi chú bổ sung</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
