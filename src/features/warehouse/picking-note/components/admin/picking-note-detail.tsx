'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

interface LineItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  notes: string;
}

interface PickingNoteDetailProps {
  note: {
    id: string;
    code: string;
    date: string;
    createdBy: string;
    warehouse: string;
    status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
    items: LineItem[];
    createdAt: string;
    updatedAt: string;
  };
}

const statusColor: Record<string, string> = {
  'draft': 'bg-gray-100 text-gray-600',
  'confirmed': 'bg-blue-100 text-blue-600',
  'completed': 'bg-green-100 text-green-600',
  'cancelled': 'bg-red-100 text-red-600',
};

const statusLabel: Record<string, string> = {
  'draft': 'Nháp',
  'confirmed': 'Xác nhận',
  'completed': 'Hoàn thành',
  'cancelled': 'Đã hủy',
};

export const PickingNoteDetail: React.FC<PickingNoteDetailProps> = ({ note }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/warehouse/picking-note" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft size={20} className="text-[#2B3674]" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#2B3674]">Phiếu {note.code}</h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${statusColor[note.status]}`}>
              {statusLabel[note.status]}
            </span>
          </div>
        </div>

        {note.status === 'draft' && (
          <div className="flex items-center gap-2">
            <Link
              href={`/warehouse/picking-note/${note.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold text-[#2B3674] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={16} />
              Chỉnh sửa
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Header Info */}
      <Card className="border-none shadow-sm bg-white rounded-lg">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-[#2B3674]">Thông tin phiếu soạn kho</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Mã phiếu</p>
              <p className="text-sm font-semibold text-[#2B3674]">{note.code}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Ngày soạn</p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {new Date(note.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Kho hàng</p>
              <p className="text-sm font-semibold text-[#2B3674]">{note.warehouse}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Người soạn</p>
              <p className="text-sm font-semibold text-[#2B3674]">{note.createdBy}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Ngày tạo</p>
              <p className="text-sm text-[#A3AED0]">
                {new Date(note.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#A3AED0] uppercase mb-2">Cập nhật lần cuối</p>
              <p className="text-sm text-[#A3AED0]">
                {new Date(note.updatedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="border-none shadow-sm bg-white rounded-lg">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-[#2B3674]">Chi tiết hàng hóa</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {note.items.length > 0 ? (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">
                      Mã sản phẩm
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">
                      Tên sản phẩm
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">
                      Số lượng
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {note.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                      <td className="px-6 py-3 font-semibold text-[#4318FF]">{item.productCode}</td>
                      <td className="px-6 py-3 font-semibold text-[#2B3674]">{item.productName}</td>
                      <td className="px-6 py-3 text-right font-semibold text-[#2B3674]">{item.quantity}</td>
                      <td className="px-6 py-3 text-[#A3AED0]">{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 py-4 border-t border-gray-100 bg-[#F4F7FE] text-right space-y-1">
                <p className="text-xs font-bold text-[#A3AED0] uppercase">
                  Tổng số sản phẩm: <span className="text-[#2B3674]">{note.items.length}</span>
                </p>
                <p className="text-xs font-bold text-[#A3AED0] uppercase">
                  Tổng số lượng: <span className="text-[#2B3674]">{note.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#A3AED0] font-semibold">Chưa có hàng hóa</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};