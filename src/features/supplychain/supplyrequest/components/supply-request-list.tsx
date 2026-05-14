'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ClipboardList,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { getSupplyRequests } from '../services/supply-request-service';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';

export function SupplyRequestList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [requests, setRequests] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSupplyRequests({ page: 1, pageSize: 100 }),
      getWarehouses()
    ])
      .then(([reqRes, whRes]) => {
        setRequests(reqRes?.items || []);
        setWarehouses(whRes || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
  const completedRequests = requests.filter(r => r.status?.toLowerCase() === 'completed').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4">
        <Link href="/supplychain/supplyrequest/new">
          <Button className="admin-btn-primary flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Tạo yêu cầu
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{totalRequests}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Tổng yêu cầu</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{pendingRequests}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Chờ xử lý</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{completedRequests}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Đã xử lý</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã hoặc ghi chú..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="completed">Đã xử lý</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã Yêu Cầu</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Kho Nhận</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ghi chú</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Tổng SL Vật Tư</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{req.code || req.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {getWarehouseName(req.warehouseId)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                    {req.note || '---'}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 font-medium">
                    {req.totalRequested || 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {req.status?.toLowerCase() === 'completed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Đã xử lý
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Chờ xử lý
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/supplychain/supplyrequest/${req.id}`}>
                        <button className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy yêu cầu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
