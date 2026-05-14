'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { PackagePlus, Eye, Edit, Trash2, Search, Warehouse as WarehouseIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { StockInService, StockInListItem } from '../../services/stock-in-service';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useUser } from '@/shared/hooks/use-user';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';

const stats = [
  { title: 'Phiếu nhập tháng này', value: '143', icon: PackagePlus, color: 'text-[#4318FF]' },
  { title: 'Nhà cung cấp', value: '28', icon: PackagePlus, color: 'text-blue-500' },
  { title: 'Tổng giá trị nhập', value: '2.8 tỷ', icon: PackagePlus, color: 'text-green-500' },
  { title: 'Mặt hàng đã nhập', value: '3,241', icon: PackagePlus, color: 'text-purple-500' },
];

const statusColor: Record<string, string> = {
  'Hoàn thành': 'bg-green-100 text-green-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
  'Chờ xác nhận': 'bg-orange-100 text-orange-500',
};

export default function StockInList() {
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stockIns, setStockIns] = useState<StockInListItem[]>([]);
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

  const fetchStockIns = useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      const result = await StockInService.getStockIns({
        warehouseId: activeTab !== 'all' ? activeTab : undefined,
        searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        pageSize: 10,
        isPrevious,
        firstCreatedAt: isPrevious ? cursor.firstCreatedAt : undefined,
        firstId: isPrevious ? cursor.firstId : undefined,
        lastCreatedAt: !isPrevious ? cursor.lastCreatedAt : undefined,
        lastId: !isPrevious ? cursor.lastId : undefined,
      });
      
      if (result) {
        setStockIns(result.items);
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
      console.error("Error fetching stock ins:", error);
      toast.error("Không thể tải danh sách phiếu nhập kho");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, statusFilter, cursor.firstCreatedAt, cursor.firstId, cursor.lastCreatedAt, cursor.lastId]);

  useEffect(() => {
    fetchStockIns();
  }, [activeTab, searchTerm, statusFilter]);

  const handleNext = () => {
    if (cursor.hasNext) fetchStockIns(false);
  };

  const handlePrevious = () => {
    if (cursor.hasPrevious) fetchStockIns(true);
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
        <h2 className="text-2xl font-bold admin-title uppercase">Phiếu nhập kho</h2>
        <Link href="/warehouse/stockin/new?action=create">
          <button className="flex items-center gap-2 admin-btn-primary">
            <PackagePlus className="w-4 h-4" /> Thêm phiếu nhập
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0]">{s.title}</p>
              </div>
              <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
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
              placeholder="Tìm số phiếu, nhà cung cấp..."
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
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Số phiếu</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Nhà cung cấp</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày nhập</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Số mặt hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tổng tiền</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Kho</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stockIns.length > 0 ? (
              stockIns.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{r.code}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">Admin</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">--</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">-- đ</td>
                  <td className="px-6 py-4 text-gray-700">
                    {warehouses.find(w => w.id === activeTab)?.name || 'Kho chính'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                      Hoàn thành
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
                        <Link href={`/warehouse/stockin/${r.id}`}>
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
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy phiếu nhập kho nào.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{stockIns.length}</span> bản ghi
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
