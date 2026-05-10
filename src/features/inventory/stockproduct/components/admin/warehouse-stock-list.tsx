'use client';

import React, { useState } from 'react';
import { Warehouse, Search, Loader2, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { InventoryService, InventoryItemListItem } from '../../services/inventory-service';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface StockItem extends InventoryItemListItem {
  productName?: string;
  productCode?: string;
}

export default function WarehouseStockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrevious: false,
    firstCreatedAt: undefined as string | undefined,
    firstId: undefined as string | undefined,
    lastCreatedAt: undefined as string | undefined,
    lastId: undefined as string | undefined,
  });

  const fetchStock = React.useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      const result = await InventoryService.getInventoryList({
        searchTerm,
        pageSize: 10,
        isPrevious,
        firstCreatedAt: pagination.firstCreatedAt,
        firstId: pagination.firstId,
        lastCreatedAt: pagination.lastCreatedAt,
        lastId: pagination.lastId,
      });

      // Fetch product details for each item to get names/codes
      const productIds = Array.from(new Set(result.items.map(i => i.productId)));
      
      // For simplicity in this demo, we'll fetch them individually or use a bulk API if available
      // Here we assume ProductService.getProducts can filter by IDs or we just fetch them.
      // But since we don't have a bulk getByIds API shown yet, we'll just map what we can.
      
      const enrichedItems: StockItem[] = await Promise.all(result.items.map(async (item) => {
        try {
          const product = await ProductService.getDetail(item.productId);
          return { ...item, productName: product.name, productCode: product.code };
        } catch {
          return { ...item, productName: 'Sản phẩm không xác định', productCode: 'N/A' };
        }
      }));

      setStockItems(enrichedItems);
      setPagination({
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
        firstCreatedAt: result.firstCreatedAt,
        firstId: result.firstId,
        lastCreatedAt: result.lastCreatedAt,
        lastId: result.lastId,
      });
    } catch (error) {
      toast.error("Không thể tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pagination.firstCreatedAt, pagination.firstId, pagination.lastCreatedAt, pagination.lastId]);

  React.useEffect(() => {
    fetchStock();
  }, [searchTerm]);

  const stats = [
    { title: 'Tổng mặt hàng', value: stockItems.length.toString(), icon: Warehouse, color: 'text-[#4318FF]' },
    { title: 'Tổng tồn kho', value: stockItems.reduce((acc, curr) => acc + curr.physicalQuantity, 0).toString(), icon: Warehouse, color: 'text-blue-500' },
    { title: 'Sắp hết hàng', value: stockItems.filter(i => i.physicalQuantity < 10).length.toString(), icon: Warehouse, color: 'text-yellow-500' },
    { title: 'Hết hàng', value: stockItems.filter(i => i.physicalQuantity === 0).length.toString(), icon: Warehouse, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold admin-title uppercase">Quản lý tồn kho</h2>
        <Link href="/warehouse/stock-adjustment?action=create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded">
            <ClipboardCheck className="w-4 h-4 mr-2" /> Kiểm kê kho
          </Button>
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

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã HH, tên hàng hóa, SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã HH</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên hàng hóa</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">SKU</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Loại hàng</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Tồn kho</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Vị trí</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                   <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                      <p>Đang tải dữ liệu tồn kho...</p>
                   </div>
                </td>
              </tr>
            ) : stockItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                  Không tìm thấy dữ liệu tồn kho nào
                </td>
              </tr>
            ) : (
              stockItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{item.productCode}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 text-gray-700">{item.productId.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-gray-700">Vật tư</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-gray-900">{item.physicalQuantity}</span>
                       <span className="text-[10px] text-gray-400">Tạm giữ: {item.allocatedQuantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.warehouseName || 'Chưa xác định'} 
                    {item.rackCode && <span className="ml-1 text-xs text-gray-400">({item.rackCode})</span>}
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Hiển thị <span className="font-bold">{stockItems.length}</span> mặt hàng
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStock(true)}
                disabled={!pagination.hasPrevious || loading}
                className="h-8 rounded"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStock(false)}
                disabled={!pagination.hasNext || loading}
                className="h-8 rounded"
              >
                Tiếp <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
