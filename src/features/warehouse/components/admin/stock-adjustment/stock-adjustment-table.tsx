"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Loader2, Search, Eye } from 'lucide-react';
import { StockAdjustmentService, StockAdjustmentListItem } from '@/features/inventory/stockadjustment/services/stock-adjustment-service';
import { toast } from 'sonner';
import Link from 'next/link';

const statusColor: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Approved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Chờ duyệt',
  'Approved': 'Đã duyệt',
  'Rejected': 'Từ chối',
};

const StockAdjustmentTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustments, setAdjustments] = useState<StockAdjustmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cursor, setCursor] = useState<{
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({ hasNext: false, hasPrevious: false });

  const fetchAdjustments = useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      const result = await StockAdjustmentService.getList({
        searchTerm,
        pageSize: 10,
        isPrevious,
        firstCreatedAt: isPrevious ? cursor.firstCreatedAt : undefined,
        firstId: isPrevious ? cursor.firstId : undefined,
        lastCreatedAt: !isPrevious ? cursor.lastCreatedAt : undefined,
        lastId: !isPrevious ? cursor.lastId : undefined,
      });
      
      if (result) {
        setAdjustments(result.items);
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
      console.error("Error fetching stock adjustments:", error);
      toast.error("Không thể tải danh sách phiếu điều chỉnh");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cursor.firstCreatedAt, cursor.firstId, cursor.lastCreatedAt, cursor.lastId]);

  useEffect(() => {
    fetchAdjustments();
  }, [searchTerm]);

  const handleNext = () => {
    if (cursor.hasNext) fetchAdjustments(false);
  };

  const handlePrevious = () => {
    if (cursor.hasPrevious) fetchAdjustments(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link href="/warehouse/stock-adjustment/new">
          <Button className="admin-btn-primary flex items-center gap-2">
            Thêm phiếu điều chỉnh
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}
        
        <div className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã phiếu, lý do..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 uppercase font-semibold">Mã phiếu</th>
              <th className="text-left px-6 py-4 uppercase font-semibold">Lý do</th>
              <th className="text-left px-6 py-4 uppercase font-semibold">Ngày tạo</th>
              <th className="text-center px-6 py-4 uppercase font-semibold">Trạng thái</th>
              <th className="text-center px-6 py-4 uppercase font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.length > 0 ? (
              adjustments.map((sa) => (
                <tr key={sa.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{sa.code}</td>
                  <td className="px-6 py-4 text-gray-700">{sa.reason}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(sa.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[sa.status] || 'bg-gray-100'}`}>
                      {statusLabel[sa.status] || sa.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      asChild
                    >
                      <Link href={`/warehouse/stock-adjustment/${sa.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy phiếu điều chỉnh nào.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{adjustments.length}</span> bản ghi
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
};

export default StockAdjustmentTable;