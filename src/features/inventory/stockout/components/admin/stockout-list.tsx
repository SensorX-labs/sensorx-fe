'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PackageMinus, Eye, Search, Warehouse as WarehouseIcon } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { StockOutService, StockOutListItem } from '../../services/stock-out-service';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useUser } from '@/shared/hooks/use-user';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';

export default function StockOutList() {
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockOuts, setStockOuts] = useState<StockOutListItem[]>([]);
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

  const fetchStockOuts = useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      const result = await StockOutService.getList({
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
        setStockOuts(result.items);
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
      console.error("Error fetching stock outs:", error);
      toast.error("Không thể tải danh sách phiếu xuất kho");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, cursor.firstCreatedAt, cursor.firstId, cursor.lastCreatedAt, cursor.lastId]);

  useEffect(() => {
    fetchStockOuts();
  }, [activeTab, searchTerm]);

  const handleNext = () => {
    if (cursor.hasNext) fetchStockOuts(false);
  };

  const handlePrevious = () => {
    if (cursor.hasPrevious) fetchStockOuts(true);
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
        <h2 className="text-2xl font-bold admin-title uppercase">Phiếu xuất kho</h2>
        <Link href="/warehouse/picking-note">
          <button className="flex items-center gap-2 admin-btn-primary">
            <PackageMinus className="w-4 h-4" /> Xuất kho từ phiếu soạn
          </button>
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
              placeholder="Tìm mã phiếu xuất, mô tả..."
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
              <th className="text-left px-6 py-4 tracking-label uppercase">Phiếu soạn</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stockOuts.length > 0 ? (
              stockOuts.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{e.code}</td>
                  <td className="px-6 py-4 text-gray-700">{e.description || 'Không có mô tả'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(e.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{e.pickingNoteId}</td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      asChild
                    >
                      <Link href={`/inventory/stockout/${e.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có phiếu xuất kho nào.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{stockOuts.length}</span> bản ghi
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
