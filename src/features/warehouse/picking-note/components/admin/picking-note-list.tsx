'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Eye, Trash2, Plus, FileStack, FileEdit, CheckSquare, CheckCircle, XCircle, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

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
  const totalNotes = notes.length;
  const draftNotes = notes.filter(n => n.status === 'draft').length;
  const confirmedNotes = notes.filter(n => n.status === 'confirmed').length;
  const completedNotes = notes.filter(n => n.status === 'completed').length;
  const cancelledNotes = notes.filter(n => n.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link
          href="/warehouse/picking-note/new"
          className="flex items-center gap-2 admin-btn-primary"
        >
          <Plus size={16} />
          Tạo phiếu
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-green-50)] text-[var(--brand-green-600)] flex items-center justify-center">
              <FileStack className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium admin-muted uppercase tracking-wider">Tổng phiếu</p>
              <p className="text-xl font-bold admin-title">{totalNotes}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium admin-muted uppercase tracking-wider">Phiếu nháp</p>
              <p className="text-xl font-bold admin-title">{draftNotes}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium admin-muted uppercase tracking-wider">Xác nhận</p>
              <p className="text-xl font-bold admin-title">{confirmedNotes}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium admin-muted uppercase tracking-wider">Hoàn thành</p>
              <p className="text-xl font-bold admin-title">{completedNotes}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium admin-muted uppercase tracking-wider">Đã hủy</p>
              <p className="text-xl font-bold admin-title">{cancelledNotes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {notes.length > 0 ? (
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 admin-table-th">Mã phiếu</th>
                  <th className="text-left px-6 py-3 admin-table-th">Ngày soạn</th>
                  <th className="text-left px-6 py-3 admin-table-th">Người soạn</th>
                  <th className="text-right px-6 py-3 admin-table-th">Số sản phẩm</th>
                  <th className="text-right px-6 py-3 admin-table-th">Tổng số lượng</th>
                  <th className="text-center px-6 py-3 admin-table-th">Trạng thái</th>
                  <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
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
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          asChild
                        >
                          <Link href={`/warehouse/picking-note/${note.id}?action=detail`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        {note.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                            asChild
                          >
                            <Link href={`/warehouse/picking-note/${note.id}?action=update`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        {note.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
              className="inline-block admin-btn-primary"
            >
              Tạo phiếu soạn kho
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
