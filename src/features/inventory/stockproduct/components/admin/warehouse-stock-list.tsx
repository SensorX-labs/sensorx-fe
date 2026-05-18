'use client';

import React, { useState } from 'react';
import { Warehouse, Search, Loader2, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { InventoryService, InventoryItemListItem, ConsolidatedInventoryItem } from '../../services/inventory-service';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useUser } from '@/shared/hooks/use-user';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';

interface StockItem extends InventoryItemListItem {
  productName?: string;
  productCode?: string;
  salableQuantity?: number;
  warehouses?: ConsolidatedInventoryItem['warehouses'];
}

const formatWarehouseLocation = (warehouse: ConsolidatedInventoryItem['warehouses'][number]) => {
  const parts = [warehouse.warehouseName, warehouse.brandZone, warehouse.rackCode].filter(Boolean);
  return parts.join(' · ');
};

const normalizeConsolidatedItem = (item: ConsolidatedInventoryItem): StockItem => ({
  id: item.productId,
  productId: item.productId,
  physicalQuantity: item.totalPhysicalQuantity,
  allocatedQuantity: item.totalAllocatedQuantity,
  salableQuantity: item.totalSalableQuantity,
  warehouseName: item.warehouses.map((warehouse) => warehouse.warehouseName).join(', '),
  rackCode: item.warehouses[0]?.rackCode,
  brandZone: item.warehouses[0]?.brandZone,
  createdAt: '',
  warehouses: item.warehouses,
});

export default function WarehouseStockPage() {
  const { user } = useUser();
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
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

  const isWarehouseStaff = user?.role === 'WarehouseStaff';

  React.useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await getWarehouses();
        setWarehouses(res);
      } catch {
        // silently fail
      }
    };
    loadWarehouses();
  }, []);

  React.useEffect(() => {
    if (isWarehouseStaff && user?.warehouseId) {
      setActiveTab(user.warehouseId);
    }
  }, [isWarehouseStaff, user?.warehouseId]);

  const fetchStock = React.useCallback(async (isPrevious: boolean = false) => {
    setLoading(true);
    try {
      let itemsRes: InventoryItemListItem[] = [];
      let consolidatedItemsRes: ConsolidatedInventoryItem[] = [];
      let hasNextFlag = false;
      let hasPrevFlag = false;
      let firstCreatedAtStr: string | undefined;
      let firstIdStr: string | undefined;
      let lastCreatedAtStr: string | undefined;
      let lastIdStr: string | undefined;

      if (activeTab === 'all') {
        const res = await InventoryService.getConsolidatedInventory();
        const rawItems = res?.items || res || [];
        consolidatedItemsRes = Array.isArray(rawItems) ? rawItems : [];
      } else {
        const result = await InventoryService.getInventoryList({
          warehouseId: activeTab,
          searchTerm,
          pageSize: 10,
          isPrevious,
          firstCreatedAt: pagination.firstCreatedAt,
          firstId: pagination.firstId,
          lastCreatedAt: pagination.lastCreatedAt,
          lastId: pagination.lastId,
        });
        itemsRes = result.items || [];
        hasNextFlag = result.hasNext;
        hasPrevFlag = result.hasPrevious;
        firstCreatedAtStr = result.firstCreatedAt;
        firstIdStr = result.firstId;
        lastCreatedAtStr = result.lastCreatedAt;
        lastIdStr = result.lastId;
      }

      let filteredItems: StockItem[] = activeTab === 'all'
        ? consolidatedItemsRes.map(normalizeConsolidatedItem)
        : itemsRes;

      if (activeTab === 'all' && searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter((item) => 
          item.productId.toLowerCase().includes(term) ||
          item.productCode?.toLowerCase().includes(term) ||
          item.productName?.toLowerCase().includes(term) ||
          item.warehouseName?.toLowerCase().includes(term) ||
          item.warehouses?.some((warehouse) =>
            [warehouse.warehouseName, warehouse.brandZone, warehouse.rackCode].some((value) =>
              value?.toLowerCase().includes(term)
            )
          )
        );
      }

      const enrichedItems: StockItem[] = await Promise.all(filteredItems.map(async (item) => {
        if (item.productCode && item.productName && activeTab === 'all') {
          return item;
        }

        try {
          const product = await ProductService.getDetail(item.productId);
          return { ...item, productName: product.name, productCode: product.code };
        } catch {
          return { ...item, productName: 'Sản phẩm không xác định', productCode: 'N/A' };
        }
      }));

      if (activeTab === 'all' && searchTerm) {
        const term = searchTerm.toLowerCase();
        const doubleFiltered = enrichedItems.filter(i => 
          i.productCode?.toLowerCase().includes(term) ||
          i.productName?.toLowerCase().includes(term) ||
          i.productId.toLowerCase().includes(term) ||
          i.warehouseName?.toLowerCase().includes(term) ||
          i.warehouses?.some((warehouse) =>
            [warehouse.warehouseName, warehouse.brandZone, warehouse.rackCode].some((value) =>
              value?.toLowerCase().includes(term)
            )
          )
        );
        setStockItems(doubleFiltered);
      } else {
        setStockItems(enrichedItems);
      }

      setPagination({
        hasNext: hasNextFlag,
        hasPrevious: hasPrevFlag,
        firstCreatedAt: firstCreatedAtStr,
        firstId: firstIdStr,
        lastCreatedAt: lastCreatedAtStr,
        lastId: lastIdStr,
      });
    } catch (error) {
      toast.error("Không thể tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, pagination.firstCreatedAt, pagination.firstId, pagination.lastCreatedAt, pagination.lastId]);

  React.useEffect(() => {
    fetchStock();
  }, [activeTab, searchTerm]);

  const stats = [
    { title: 'Tổng mặt hàng', value: stockItems.length.toString(), icon: Warehouse, color: 'text-[#4318FF]' },
    { title: 'Tổng tồn kho', value: stockItems.reduce((acc, curr) => acc + curr.physicalQuantity, 0).toString(), icon: Warehouse, color: 'text-blue-500' },
    { title: 'Sắp hết hàng', value: stockItems.filter(i => i.physicalQuantity < 10).length.toString(), icon: Warehouse, color: 'text-yellow-500' },
    { title: 'Hết hàng', value: stockItems.filter(i => i.physicalQuantity === 0).length.toString(), icon: Warehouse, color: 'text-red-400' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPagination({ hasNext: false, hasPrevious: false, firstCreatedAt: undefined, firstId: undefined, lastCreatedAt: undefined, lastId: undefined });
  };

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
              <Warehouse className="w-3.5 h-3.5" />
              {w.name}
              {isWarehouseStaff && <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded">Kho của bạn</span>}
            </button>
          );
        })}
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
                <tr key={`${item.id}-${item.warehouseName}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
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
                    {activeTab === 'all' && item.warehouses?.length ? (
                      <div className="flex flex-col gap-1">
                        {item.warehouses.slice(0, 2).map((warehouse, index) => (
                          <span key={`${warehouse.warehouseName}-${index}`} className="font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-xs inline-flex w-fit">
                            {formatWarehouseLocation(warehouse)}
                          </span>
                        ))}
                        {item.warehouses.length > 2 && (
                          <span className="text-xs text-gray-400">+{item.warehouses.length - 2} kho khác</span>
                        )}
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-xs">
                          {item.warehouseName || 'Chưa xác định'}
                        </span>
                        {item.rackCode && <span className="ml-1 text-xs text-gray-400">({item.rackCode})</span>}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {activeTab !== 'all' && (
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
        )}
      </div>
    </div>
  );
}
