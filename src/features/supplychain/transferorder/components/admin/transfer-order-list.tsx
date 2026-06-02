'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowRightLeft,
  Eye,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { getTransferOrders } from '../../services/transfer-order-service';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';

export function TransferOrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const orderData = await getTransferOrders(1, 100);
      setOrders(orderData.items || []);
      
      const warehouseData = await getWarehouses();
      setWarehouses(warehouseData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'PROCESSING' && (order.status?.toUpperCase() === 'PROCESSING' || order.status?.toUpperCase() === 'DELIVERING')) || 
      (statusFilter === 'COMPLETED' && order.status?.toUpperCase() === 'COMPLETED');
    return matchesSearch && matchesStatus;
  });

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  const handleDelete = (id: string) => {
    console.log('Delete transfer order:', id);
  };

  const totalOrders = orders.length;
  const processingOrders = orders.filter(o => o.status?.toUpperCase() === 'PROCESSING' || o.status?.toUpperCase() === 'DELIVERING').length;
  const completedOrders = orders.filter(o => o.status?.toUpperCase() === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Link href="/warehouse/transfer-orders/new?action=create">
          <Button className="admin-btn-primary flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Tạo lệnh điều chuyển
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{loading ? '...' : totalOrders}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Tổng phiếu</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{loading ? '...' : processingOrders}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Đang xử lý</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded">
          <CardContent className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{loading ? '...' : completedOrders}</p>
              <p className="text-xs font-semibold text-[#A3AED0]">Đã xử lý</p>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-green-600" />
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
              placeholder="Tìm kiếm lệnh điều chuyển..."
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
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Đã xử lý</option>
            </select>
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 admin-table-th">Mã Phiếu</th>
                  <th className="text-left px-6 py-3 admin-table-th">Kho Xuất</th>
                  <th className="text-left px-6 py-3 admin-table-th">Kho Nhập</th>
                  <th className="text-left px-6 py-3 admin-table-th">Ghi chú</th>
                  <th className="text-center px-6 py-3 admin-table-th">Trạng thái</th>
                  <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold admin-text-primary">{order.code}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {getWarehouseName(order.sourceWarehouseId)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {getWarehouseName(order.destinationWarehouseId)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                        {order.note || '---'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.status?.toUpperCase() === 'COMPLETED' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                             Đã xử lý
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                             Đang xử lý
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/warehouse/transfer-orders/${order.id}`}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/warehouse/transfer-orders/${order.id}?action=edit`}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(order.id!)}
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
                      Không tìm thấy lệnh điều chuyển nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
