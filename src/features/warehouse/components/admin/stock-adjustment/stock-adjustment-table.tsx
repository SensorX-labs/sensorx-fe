"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Loader2, Search, Eye, Warehouse as WarehouseIcon } from 'lucide-react';
import { StockAdjustmentService, StockAdjustmentListItem } from '@/features/inventory/stockadjustment/services/stock-adjustment-service';
import { toast } from 'sonner';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/shared/hooks/use-user';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';

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
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustments, setAdjustments] = useState<StockAdjustmentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [cursor, setCursor] = useState<{
    firstCreatedAt?: string;
    firstId?: string;
    lastCreatedAt?: string;
    lastId?: string;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({ hasNext: false, hasPrevious: false });

  // Tải danh sách các kho bãi để làm tabs
  useEffect(() => {
    const loadW = async () => {
      try {
        const res = await getWarehouses();
        const loadedWarehouses = res || [];
        setWarehouses(loadedWarehouses);

        if (isWarehouseStaff && user?.warehouseId) {
          setActiveTab(user.warehouseId);
        } else if (loadedWarehouses.length > 0) {
          // Ưu tiên chọn tab theo cookie hiện tại nếu có, nếu không thì tab đầu tiên
          const savedId = Cookies.get("warehouseId");
          if (savedId && loadedWarehouses.some(w => w.id === savedId)) {
            setActiveTab(savedId);
          } else {
            setActiveTab(loadedWarehouses[0].id!);
          }
        }
      } catch (err) {
        console.error("Failed to load warehouses for tabs", err);
      }
    };
    loadW();
  }, [isWarehouseStaff, user?.warehouseId]);

  const fetchAdjustments = useCallback(async (isPrevious: boolean = false) => {
    if (!activeTab) return;
    setLoading(true);
    try {
      const result = await StockAdjustmentService.getList({
        warehouseId: activeTab,
        searchTerm,
        pageSize: 10,
        isPrevious,
        firstCreatedAt: isPrevious ? cursor.firstCreatedAt : undefined,
        firstId: isPrevious ? cursor.firstId : undefined,
        lastCreatedAt: !isPrevious ? cursor.lastCreatedAt : undefined,
        lastId: !isPrevious ? cursor.lastId : undefined,
      });
      
      if (result) {
        setAdjustments(result.items || []);
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
      toast.error("Không thể tải danh sách phiếu điều chỉnh kho");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, cursor.firstCreatedAt, cursor.firstId, cursor.lastCreatedAt, cursor.lastId]);

  useEffect(() => {
    if (activeTab) {
      fetchAdjustments();
    }
  }, [activeTab, searchTerm]);

  const handleNext = () => {
    if (cursor.hasNext) fetchAdjustments(false);
  };

  const handlePrevious = () => {
    if (cursor.hasPrevious) fetchAdjustments(true);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Khi đổi tab, lưu lại cookie để đồng bộ ngữ cảnh làm việc và làm mới phân trang
    Cookies.set("warehouseId", tabId, { expires: 7, path: '/' });
    setCursor({ hasNext: false, hasPrevious: false, firstCreatedAt: undefined, firstId: undefined, lastCreatedAt: undefined, lastId: undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold admin-title uppercase">Phiếu Kiểm Kê / Điều Chỉnh Kho</h2>
        <Link href="/warehouse/stock-adjustment/new">
          <Button className="flex items-center gap-2 bg-[#1f533a] hover:bg-[#1f533a]/90 text-white rounded">
            Thêm phiếu điều chỉnh
          </Button>
        </Link>
      </div>

      {/* Tabs navigation cao cấp hiển thị danh sách kho */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
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
                  ? 'border-[#1f533a] text-[#1f533a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <WarehouseIcon className="w-3.5 h-3.5" />
              {w.name}
              {isWarehouseStaff && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded font-semibold">
                  Kho của bạn
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bộ lọc và Bảng danh sách */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1f533a]" />
          </div>
        )}
        
        <div className="p-4 border-b border-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã phiếu, lý do..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 uppercase font-semibold text-xs text-gray-600 tracking-wider">Mã phiếu</th>
              <th className="text-left px-6 py-4 uppercase font-semibold text-xs text-gray-600 tracking-wider">Lý do</th>
              <th className="text-left px-6 py-4 uppercase font-semibold text-xs text-gray-600 tracking-wider">Ngày tạo</th>
              <th className="text-center px-6 py-4 uppercase font-semibold text-xs text-gray-600 tracking-wider">Trạng thái</th>
              <th className="text-center px-6 py-4 uppercase font-semibold text-xs text-gray-600 tracking-wider">Hành động</th>
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                    Không tìm thấy phiếu điều chỉnh nào trong kho này.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {activeTab && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-xs text-gray-500">
              Hiển thị <span className="font-bold text-gray-700">{adjustments.length}</span> bản ghi
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!cursor.hasPrevious || loading}
                className="rounded h-8 text-xs font-medium"
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!cursor.hasNext || loading}
                className="rounded h-8 text-xs font-medium"
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAdjustmentTable;