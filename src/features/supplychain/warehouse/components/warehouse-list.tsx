'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_WAREHOUSES } from '../mocks/warehouse-mocks';

export function WarehouseList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredWarehouses = MOCK_WAREHOUSES.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit warehouse:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete warehouse:', id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4">
        <Button className="admin-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm kho mới
        </Button>
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kho bãi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã Kho</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên Kho</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((wh) => (
                <tr key={wh.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{wh.id}</td>
                  <td className="px-6 py-4">{wh.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Đang hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleEdit(wh.id!)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(wh.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy kho bãi nào phù hợp.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
