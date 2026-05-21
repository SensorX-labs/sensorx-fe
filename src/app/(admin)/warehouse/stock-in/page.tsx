'use client';
import React, { useState, useEffect } from 'react';
import { StockIn } from '@/features/warehouse/models/stock-in-model';
import { getStockIns } from '@/features/warehouse/services/warehouse-service';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

export default function StockInList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStockIns([]);
    getStockIns()
      .then(setStockIns)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredStockIns = stockIns.filter(si => 
    si.code.value?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    si.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit stock in:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete stock in:', id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4">
        <Button className="admin-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm phiếu nhập
        </Button>
      </div>
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phiếu nhập..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã Phiếu</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên Phiếu</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng Thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockIns.length > 0 ? (
              filteredStockIns.map((si) => (
                <tr key={si.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{si.id}</td>
                  <td className="px-6 py-4">{si.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleEdit(si.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(si.id)}
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
                  Không tìm thấy phiếu nhập nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}