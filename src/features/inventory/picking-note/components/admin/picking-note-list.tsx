'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Edit2, Eye, Trash2, Plus, FileStack, FileEdit, CheckSquare, CheckCircle, XCircle, Edit, Search, Warehouse as WarehouseIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { PickingNoteService, PickingNoteListItem } from '../../services/picking-note-service';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useUser } from '@/shared/hooks/use-user';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';

const statusColor: Record<string, string> = {
  'Pending': 'bg-gray-100 text-gray-600',
  'Picking': 'bg-blue-100 text-blue-600',
  'Completed': 'bg-green-100 text-green-600',
  'Canceled': 'bg-red-100 text-red-600',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Chờ xử lý',
  'Picking': 'Đang soạn hàng',
  'Completed': 'Hoàn thành',
  'Canceled': 'Đã hủy',
};

export function PickingNoteList() {
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<PickingNoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cursor, setCursor] = useState<{
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({ hasNext: false, hasPrevious: false });

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await getWarehouses();
        setWarehouses(res || []);
      } catch {
        // silently fail
      }
    };
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (isWarehouseStaff && user?.warehouseId) {
      setActiveTab(user.warehouseId);
    } else {
      const savedId = Cookies.get("warehouseId");
      if (savedId) {
        setActiveTab(savedId);
      }
    }
  }, [isWarehouseStaff, user?.warehouseId]);

  const fetchNotes = useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      const result = await PickingNoteService.getList({
        warehouseId: activeTab !== 'all' ? activeTab : undefined,
        searchTerm,
        pageSize: 10,
        isPrevious,
        firstCreatedAt: isPrevious ? cursor.firstCreatedAt : undefined,
        firstId: isPrevious ? cursor.firstId : undefined,
        lastCreatedAt: !isPrevious ? cursor.lastCreatedAt : undefined,
        lastId: !isPrevious ? cursor.lastId : undefined,
      });
      
      if (result) {
        setNotes(result.items);
        setCursor({
          firstCreatedAt: result.firstCreatedAt,
          firstId: result.firstId,
          lastCreatedAt: result.lastCreatedAt,
          lastId: result.lastId,
          hasNext: result.hasNext,
          hasPrevious: result.hasPrevious,
        });
      }
    } catch (error) {
      console.error("Error fetching picking notes:", error);
      toast.error("Không thể tải danh sách phiếu soạn kho");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, cursor.firstCreatedAt, cursor.firstId, cursor.lastCreatedAt, cursor.lastId]);

  useEffect(() => {
    fetchNotes();
  }, [activeTab, searchTerm]);

  const handleNext = () => {
    if (cursor.hasNext) fetchNotes(false);
  };

  const handlePrevious = () => {
    if (cursor.hasPrevious) fetchNotes(true);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      Cookies.set("warehouseId", tabId, { expires: 7, path: '/' });
    }
    setCursor({ hasNext: false, hasPrevious: false, firstCreatedAt: undefined, firstId: undefined, lastCreatedAt: undefined, lastId: undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold admin-title uppercase">Phiếu soạn kho</h2>
        <Link
          href="/warehouse/picking-note/new?action=create"
          className="flex items-center gap-2 admin-btn-primary"
        >
          <FileEdit size={16} />
          Tạo phiếu soạn kho
        </Link>
      </div>

      {/* Tabs navigation cao cấp */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {!isWarehouseStaff && (
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-[#4318FF] text-[#4318FF]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tất cả (Tổng hợp)
          </button>
        )}

        {warehouses.map((w) => {
          if (isWarehouseStaff && user?.warehouseId !== w.id) {
            return null;
          }
          return (
            <button
              key={w.id}
              onClick={() => handleTabChange(w.id!)}
              className={`px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === w.id
                  ? 'border-[#4318FF] text-[#4318FF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <WarehouseIcon className="w-3.5 h-3.5" />
              {w.name}
              {isWarehouseStaff && <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded">Kho của bạn</span>}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã phiếu, mô tả..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã phiếu</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Mô tả</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày tạo</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? (
              notes.map((note) => (
                <tr key={note.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{note.code}</td>
                  <td className="px-6 py-4 text-gray-700">{note.description || 'Không có mô tả'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[note.status] || 'bg-gray-100'}`}>
                      {statusLabel[note.status] || note.status}
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
                        <Link href={`/warehouse/picking-note/${note.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy phiếu soạn kho nào.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{notes.length}</span> bản ghi
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!cursor.hasPrevious || loading}
              className="rounded"
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!cursor.hasNext || loading}
              className="rounded"
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
