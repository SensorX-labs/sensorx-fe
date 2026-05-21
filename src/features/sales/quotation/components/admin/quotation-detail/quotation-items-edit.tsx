import React from 'react';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import { InternalPricePopover } from '../quotation-shared/internal-price-popover';

interface QuotationItemsEditProps {
  editItems: any[];
  setEditItems: React.Dispatch<React.SetStateAction<any[]>>;
  editNote: string;
  setEditNote: (val: string) => void;
  calculateTotal: () => number;
}

export function QuotationItemsEdit({
  editItems,
  setEditItems,
  editNote,
  setEditNote,
  calculateTotal
}: QuotationItemsEditProps) {

  const handleUpdateItem = (index: number, changes: any) => {
    setEditItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...changes };
      return updated;
    });
  };

  return (
    <div className="md:col-span-2 space-y-6">
      <div className="border border-blue-200 bg-white rounded overflow-hidden shadow-sm ring-1 ring-blue-100">
        <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2 text-blue-800">
            <ShoppingCart size={16} />
            <h4 className="text-sm font-bold uppercase tracking-wider">Chỉnh sửa sản phẩm</h4>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
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
              {editItems.map((item, index) => {
                const q = Number(item.quantity) || 0;
                const p = Number(item.unitPrice) || 0;
                const t = Number(item.taxRate) || 0;
                const subtotal = q * p;
                const taxAmount = Math.round(subtotal * (t / 100));
                const lineValue = subtotal + taxAmount;

                return (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex flex-col gap-0.5">
                        <div className="font-bold text-gray-900 text-base leading-tight">
                          {item.productCode}
                        </div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide">
                          Mã: {item.productCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                        onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                        className="h-10 text-sm text-center border-gray-200 shadow-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <InternalPricePopover
                        priceData={item.internalPrice}
                        onSelect={(price) => handleUpdateItem(index, { unitPrice: price })}
                      >
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                          onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                          className="h-10 text-sm text-right border-gray-200 shadow-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                        />
                      </InternalPricePopover>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-800">
                      {subtotal.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => handleUpdateItem(index, { taxRate: parseFloat(e.target.value) || 0 })}
                        onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                        className="h-10 text-sm text-center border-gray-200 shadow-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-800">
                      {taxAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 border-l border-gray-50 bg-gray-50/30">
                      {lineValue.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
              <tr>
                <td colSpan={6} className="px-6 py-5 text-right text-gray-500 uppercase text-[10px]">Tổng cộng (sau thuế):</td>
                <td className="px-6 py-5 text-right text-blue-600 text-xl">{calculateTotal().toLocaleString('vi-VN')} đ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="border border-blue-200 bg-white rounded shadow-sm ring-1 ring-blue-100">
        <div className="px-6 py-4 border-b border-blue-100 flex items-center gap-2 bg-blue-50/50">
          <MessageSquare size={16} className="text-blue-800" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-blue-800">Ghi chú & Điều khoản bổ sung</h4>
        </div>
        <div className="p-6">
          <Textarea
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            rows={4}
            className="w-full text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none shadow-none"
            placeholder="Nhập ghi chú cho báo giá..."
          />
        </div>
      </div>
    </div>
  );
}
