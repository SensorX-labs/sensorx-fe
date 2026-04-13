'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Edit2, Eye, Trash2, Plus, FileStack, FileEdit, CheckSquare, CheckCircle, XCircle, Edit, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        (note.code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (note.createdBy?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || note.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, notes]);
  const totalNotes = notes.length;
  const draftNotes = notes.filter(n => n.status === 'draft').length;
  const confirmedNotes = notes.filter(n => n.status === 'confirmed').length;
  const completedNotes = notes.filter(n => n.status === 'completed').length;
  const cancelledNotes = notes.filter(n => n.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link
          href="/warehouse/picking-note/new?action=create"
          className="flex items-center gap-2 admin-btn-primary"
        >
          <FileEdit size={16} />
          Tạo phiếu soạn kho
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{totalNotes}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Tổng phiếu</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <FileStack className="w-4 h-4 text-[var(--brand-green-600)]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{draftNotes}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Phiếu nháp</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <FileEdit className="w-4 h-4 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{confirmedNotes}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Xác nhận</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{completedNotes}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Hoàn thành</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{cancelledNotes}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Đã hủy</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
          {/* Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center p-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã phiếu, người soạn..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="confirmed">Xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left px-6 py-4 tracking-label uppercase">Mã phiếu</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Ngày soạn</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Người soạn</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Số sản phẩm</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Tổng số lượng</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((note) => (
                <tr key={note.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{note.code}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(note.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{note.createdBy}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">{note.items}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">{note.totalQuantity}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[note.status]}`}>
                      {statusLabel[note.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-12 text-center">
            <p className="text-[#A3AED0] font-semibold mb-4">Chưa có phiếu soạn kho nào</p>
            <Link
              href="/warehouse/picking-note/new?action=create"
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
