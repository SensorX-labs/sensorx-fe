'use client';

import React, { useState } from 'react';
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
import { MOCK_SUPPLY_REQUESTS } from '../mocks/supply-request-mocks';
import { SupplyRequestStatus } from '../enums/supply-request-status';
import { MOCK_WAREHOUSES } from '../../warehouse/mocks/warehouse-mocks';

export function SupplyRequestList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const filteredRequests = MOCK_SUPPLY_REQUESTS.filter(req => {
    const matchesSearch = req.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = MOCK_WAREHOUSES.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  const handleEdit = (id: string) => {
    console.log('Edit supply request:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete supply request:', id);
  };

  const handleViewDetails = (id: string) => {
    console.log('View supply request details:', id);
  };

  const totalRequests = MOCK_SUPPLY_REQUESTS.length;
  const pendingRequests = MOCK_SUPPLY_REQUESTS.filter(r => r.status === SupplyRequestStatus.PENDING).length;
  const completedRequests = MOCK_SUPPLY_REQUESTS.filter(r => r.status === SupplyRequestStatus.COMPLETED).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Button className="admin-btn-primary flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Tạo yêu cầu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm rounded bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Tổng yêu cầu</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{totalRequests}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm rounded bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Chờ xử lý</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{pendingRequests}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded bg-yellow-50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Đã xử lý</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{completedRequests}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white rounded overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm yêu cầu cung ứng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value={SupplyRequestStatus.PENDING}>Chờ xử lý</option>
              <option value={SupplyRequestStatus.COMPLETED}>Đã xử lý</option>
            </select>
          </div>
        </div>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Mã Yêu Cầu</th>
                <th className="text-left px-6 py-3 admin-table-th">Kho Nhận</th>
                <th className="text-left px-6 py-3 admin-table-th">Ghi chú</th>
                <th className="text-center px-6 py-3 admin-table-th">Số Loại Hàng</th>
                <th className="text-center px-6 py-3 admin-table-th">Trạng thái</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold admin-text-primary">{req.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {getWarehouseName(req.warehouseId)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                      {req.note || '---'}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {req.items.length}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {req.status === SupplyRequestStatus.COMPLETED ? (
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDetails(req.id!)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleEdit(req.id!)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(req.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
