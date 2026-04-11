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
  
  const filteredRequests = MOCK_SUPPLY_REQUESTS.filter(req => 
    req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Button className="admin-btn-primary flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Tạo yêu cầu
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm yêu cầu cấp hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
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
