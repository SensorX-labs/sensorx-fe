'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Eye, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

interface PickingNote {
  id: string;
  code: string;
  date: string;
  createdBy: string;
  items: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  totalQuantity: number;
}

interface PickingNoteListProps {
  notes: PickingNote[];
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

export const PickingNoteList: React.FC<PickingNoteListProps> = ({ notes }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Phiếu Soạn Kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý các phiếu soạn kho hàng</p>
        </div>
        <Link
          href="/warehouse/picking-note/new"
          className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#3311CC] transition-colors"
        >
          <Plus size={16} />
          Tạo phiếu
        </Link>
      </div>

      {notes.length > 0 ? (
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã phiếu</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngày soạn</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Người soạn</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số sản phẩm</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tổng số lượng</th>
                  <th className="text-center px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
                  <th className="text-center px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                    <td className="px-6 py-3 font-semibold admin-text-primary">{note.code}</td>
                    <td className="px-6 py-3">
                      {new Date(note.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-3 font-semibold">{note.createdBy}</td>
                    <td className="px-6 py-3 text-right font-semibold">{note.items}</td>
                    <td className="px-6 py-3 text-right font-semibold">{note.totalQuantity}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[note.status]}`}>
                        {statusLabel[note.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/warehouse/picking-note/${note.id}`}
                          className="p-1.5 text-[#A3AED0] hover:text-[#4318FF] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </Link>
                        {note.status === 'draft' && (
                          <Link
                            href={`/warehouse/picking-note/${note.id}/edit`}
                            className="p-1.5 text-[#A3AED0] hover:text-[#4318FF] transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </Link>
                        )}
                        {note.status === 'draft' && (
                          <button
                            className="p-1.5 text-[#A3AED0] hover:text-red-500 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-12 text-center">
            <p className="text-[#A3AED0] font-semibold mb-4">Chưa có phiếu soạn kho nào</p>
            <Link
              href="/warehouse/picking-note/new"
              className="inline-block px-6 py-2 bg-[#4318FF] text-white text-sm font-semibold rounded hover:bg-[#3311CC] transition-colors"
            >
              Tạo phiếu soạn kho
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
