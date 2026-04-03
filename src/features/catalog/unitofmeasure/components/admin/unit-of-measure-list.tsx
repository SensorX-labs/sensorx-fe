'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

interface UnitOfMeasure {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
}

const mockUnits: UnitOfMeasure[] = [
  { id: '1', name: 'Cái', code: 'PCS', description: 'Đơn vị đếm từng chiếc một', status: 'active' },
  { id: '2', name: 'Bộ', code: 'SET', description: 'Sử dụng cho các sản phẩm đi kèm theo bộ', status: 'active' },
  { id: '3', name: 'Kilôgam', code: 'KG', description: 'Đơn vị đo khối lượng', status: 'active' },
  { id: '4', name: 'Thùng', code: 'CARTON', description: 'Đơn vị cho hàng đóng gói theo thùng', status: 'active' },
  { id: '5', name: 'Hộp', code: 'BOX', description: 'Sử dụng cho hàng đóng hộp nhỏ', status: 'active' },
];

export default function UnitOfMeasureList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Button className="admin-btn-primary flex items-center gap-2">
          <Scale className="w-4 h-4" />
          Tạo đơn vị tính
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn vị tính..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Units Table */}
      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Tên đơn vị</th>
                <th className="text-left px-6 py-3 admin-table-th">Mã định danh</th>
                <th className="text-left px-6 py-3 admin-table-th">Mô tả</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockUnits.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                  <td className="px-6 py-4">
                     <span className="font-semibold admin-text-primary">{u.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                      {u.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    {u.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
