'use client';
import React, { useState, useEffect } from 'react';
import { Warehouse } from '@/features/warehouse/models/warehouse-model';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Search } from 'lucide-react';
import Cookies from 'js-cookie';

export function WarehouseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedWarehouseId(Cookies.get('warehouseId') || null);
    setWarehouses([]);
    getWarehouses()
      .then(setWarehouses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: string) => {
    Cookies.set('warehouseId', id, { expires: 7 });
    setSelectedWarehouseId(id);
    window.location.reload(); // Reload to apply header globally
  };

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    wh.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày tạo</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((wh) => (
                <tr key={wh.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{wh.id}</td>
                  <td className="px-6 py-4">{wh.name}</td>
                  <td className="px-6 py-4">
                    {wh.createdAt
                      ? new Date(wh.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Đang hoạt động
                    </span>
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