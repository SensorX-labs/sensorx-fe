'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

interface LineItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  notes: string;
}

interface PickingNoteFormProps {
  initialData?: {
    id: string;
    code: string;
    date: string;
    warehouse: string;
    items: LineItem[];
  };
  isEditing?: boolean;
}

export const PickingNoteForm: React.FC<PickingNoteFormProps> = ({ initialData, isEditing = false }) => {
  const [items, setItems] = useState<LineItem[]>(initialData?.items || []);
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    warehouse: initialData?.warehouse || '',
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      notes: '',
    };
    setItems([...items, newItem]);
  };

  const removeLineItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, items });
    // TODO: Call API to save
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info Card */}
      <Card className="border-none shadow-sm bg-white rounded">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-[#2B3674]">Thông tin phiếu soạn kho</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#A3AED0] uppercase mb-2">Mã phiếu</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Tự động sinh"
                disabled={isEditing}
                className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#2B3674] bg-[#F4F7FE] rounded disabled:bg-gray-100 disabled:text-[#A3AED0] focus:outline-none focus:border-[#4318FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A3AED0] uppercase mb-2">Ngày soạn</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#2B3674] bg-white rounded focus:outline-none focus:border-[#4318FF]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#A3AED0] uppercase mb-2">Kho hàng *</label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#2B3674] bg-white rounded focus:outline-none focus:border-[#4318FF]"
                required
              >
                <option value="">-- Chọn kho hàng --</option>
                <option value="kho1">Kho 1</option>
                <option value="kho2">Kho 2</option>
                <option value="kho3">Kho 3</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Card */}
      <Card className="border-none shadow-sm bg-white rounded">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <CardTitle className="text-base font-bold text-[#2B3674]">Chi tiết hàng hóa</CardTitle>
          <button
            type="button"
            onClick={addLineItem}
            className="flex items-center gap-2 bg-[#4318FF] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3311CC] transition-colors"
          >
            <Plus size={14} />
            Thêm dòng
          </button>
        </CardHeader>
        <CardContent className="p-0">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã sản phẩm</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên sản phẩm</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số lượng</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ghi chú</th>
                    <th className="text-center px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={item.productCode}
                          onChange={(e) => updateLineItem(item.id, 'productCode', e.target.value)}
                          placeholder="SKU123"
                          className="w-full px-3 py-2 border border-gray-200 text-sm text-[#2B3674] rounded focus:outline-none focus:border-[#4318FF]"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => updateLineItem(item.id, 'productName', e.target.value)}
                          placeholder="Tên sản phẩm"
                          className="w-full px-3 py-2 border border-gray-200 text-sm text-[#2B3674] rounded focus:outline-none focus:border-[#4318FF]"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value))}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-200 text-sm text-[#2B3674] text-right rounded focus:outline-none focus:border-[#4318FF]"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => updateLineItem(item.id, 'notes', e.target.value)}
                          placeholder="Ghi chú"
                          className="w-full px-3 py-2 border border-gray-200 text-sm text-[#2B3674] rounded focus:outline-none focus:border-[#4318FF]"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          className="p-1.5 text-[#A3AED0] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#A3AED0] font-semibold mb-4">Chưa có hàng hóa nào</p>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-block px-4 py-2 bg-[#4318FF] text-white text-xs font-semibold rounded hover:bg-[#3311CC] transition-colors"
              >
                Thêm hàng hóa
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-[#F4F7FE] text-right space-y-1">
              <p className="text-xs font-bold text-[#A3AED0] uppercase">
                Tổng số sản phẩm: <span className="text-[#2B3674]">{items.length}</span>
              </p>
              <p className="text-xs font-bold text-[#A3AED0] uppercase">
                Tổng số lượng: <span className="text-[#2B3674]">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Link
          href="/warehouse/picking-note"
          className="px-6 py-2 border border-gray-200 text-sm font-semibold text-[#2B3674] rounded hover:bg-gray-50 transition-colors"
        >
          Hủy
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-[#4318FF] text-white text-sm font-semibold rounded hover:bg-[#3311CC] transition-colors"
        >
          {isEditing ? 'Cập nhật phiếu' : 'Tạo phiếu'}
        </button>
      </div>
    </form>
  );
};
