'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Package, MessageSquare, Save, X,
  ClipboardList, Search, Plus, Trash
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { createSupplyRequest } from '../services/supply-request-service';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';

interface RequestItem {
  id: string; // Temp or Product Guid
  productCode: string;
  productName: string;
  requiredQuantity: number;
  isAutofilled?: boolean;
}

interface SupplyRequestData {
  id: string;
  code: string;
  date: string;
  totalRequired: number;
  requestItems: RequestItem[];
  note: string;
  warehouseId?: string;
  pickingNoteId?: string;
}

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<ProductLoadMoreForModal[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  const fetchProducts = React.useCallback(async (term: string) => {
    setLoading(true);
    try {
      const result = await ProductService.getLoadMore({
        searchTerm: term,
        pageSize: 10,
        sortByName: true,
        isDescending: false,
      });
      setProducts(result.items || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchProducts(searchTerm);
    }
  }, [open, searchTerm, fetchProducts]);

  const displayLabel = selectedProduct ? selectedProduct.name : (defaultLabel || defaultValue || "Chọn sản phẩm...");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs h-9 font-normal border-gray-300 rounded shadow-none">
          <div className="flex flex-col items-start overflow-hidden text-left">
            <span className="truncate w-full font-semibold">{displayLabel}</span>
          </div>
          <Search className="h-3 w-3 opacity-50 ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 shadow-xl border-gray-200" align="start">
        <div className="p-2 border-b bg-gray-50/50">
          <Input
            placeholder="Gõ tên hoặc mã sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-xs focus:ring-1 focus:ring-brand-green border-gray-200"
            autoFocus
          />
        </div>
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-6 text-xs text-center text-gray-500">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-xs text-center text-gray-500 italic">Không tìm thấy sản phẩm phù hợp</div>
          ) : (
            products.map(p => (
              <div
                key={p.id}
                className="p-3 hover:bg-brand-green/5 cursor-pointer flex flex-col border-b border-gray-50 last:border-0 transition-colors"
                onClick={() => {
                  setSelectedProduct(p);
                  onSelect(p);
                  setOpen(false);
                }}
              >
                <span className="text-xs font-bold text-gray-900">{p.name}</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                  <span className="text-[10px] text-brand-green font-bold italic">{p.supplierName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const generateCode = (prefix: string) => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const fff = String(now.getMilliseconds()).padStart(3, '0');
  return `${prefix.toUpperCase()}-${yy}${MM}${dd}-${HH}${mm}${ss}${fff}`;
};

export default function SupplyRequestCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pickingNoteId = searchParams.get('pickingNoteId');
  const pickingNoteCode = searchParams.get('pickingNoteCode');
  const warehouseIdParam = searchParams.get('warehouseId');
  const itemsParam = searchParams.get('items');

  const [supplyData, setSupplyData] = useState<SupplyRequestData>({
    id: 'YC_NEW',
    code: generateCode('YC'),
    date: new Date().toISOString().split('T')[0],
    totalRequired: 0,
    requestItems: [],
    note: '',
    warehouseId: '',
  });

  const [note, setNote] = useState('');
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    getWarehouses()
      .then(data => setWarehouses(data || []))
      .catch(err => console.error("Error loading warehouses:", err));
  }, []);

  useEffect(() => {
    let parsedItems: RequestItem[] = [];
    if (itemsParam) {
      try {
        const decoded = decodeURIComponent(itemsParam);
        const rawItems = JSON.parse(decoded);
        if (Array.isArray(rawItems)) {
          parsedItems = rawItems.map((item: any, idx: number) => ({
            id: item.productId || idx.toString(),
            productCode: item.productCode || '',
            productName: item.productName || '',
            requiredQuantity: item.requiredQuantity || 1,
            isAutofilled: true,
          }));
        }
      } catch (e) {
        console.error("Failed to parse items query param:", e);
      }
    }

    setSupplyData(prev => ({
      ...prev,
      warehouseId: warehouseIdParam || '',
      pickingNoteId: pickingNoteId || '',
      requestItems: parsedItems,
    }));

    if (pickingNoteCode) {
      setNote(`Yêu cầu này được tạo tự động từ Phiếu soạn kho #${pickingNoteCode}`);
    }
  }, [pickingNoteId, pickingNoteCode, warehouseIdParam, itemsParam]);

  const handleSave = async () => {
    if (!supplyData.warehouseId) {
      toast.error("Vui lòng chọn kho yêu cầu");
      return;
    }
    if (supplyData.requestItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm cần cung ứng");
      return;
    }

    try {
      await createSupplyRequest({
        code: supplyData.code,
        warehouseId: supplyData.warehouseId,
        note: note,
        items: supplyData.requestItems.map(item => ({
          productId: item.id,
          requestedQuantity: item.requiredQuantity
        })),
        pickingNoteId: supplyData.pickingNoteId || undefined
      });
      toast.success("Tạo yêu cầu cung ứng thành công");
      router.push('/warehouse/supply-requests');
    } catch (error) {
      console.error("Failed to create supply request:", error);
    }
  };

  const handleCancel = () => {
    router.push('/warehouse/supply-requests');
  };

  const addRequestItem = () => {
    const newItem: RequestItem = {
      id: 'temp_' + Date.now().toString(),
      productCode: '',
      productName: '',
      requiredQuantity: 1,
    };
    setSupplyData({
      ...supplyData,
      requestItems: [...supplyData.requestItems, newItem],
    });
  };

  const removeRequestItem = (id: string) => {
    setSupplyData({
      ...supplyData,
      requestItems: supplyData.requestItems.filter(item => item.id !== id),
    });
  };

  const updateRequestItem = (id: string, updates: Partial<RequestItem>) => {
    setSupplyData(prev => ({
      ...prev,
      requestItems: prev.requestItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const totalRequired = supplyData.requestItems.reduce((sum, item) => sum + item.requiredQuantity, 0);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Tạo yêu cầu cung ứng
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} className="rounded admin-btn-primary border-transparent">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
          <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700 hover:bg-gray-50">
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin yêu cầu</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã yêu cầu</td>
                  <td className="px-6 py-3">
                    <Input
                      value={supplyData.code}
                      onChange={(e) => setSupplyData({ ...supplyData, code: e.target.value })}
                      className="text-sm border-gray-300 rounded w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Kho yêu cầu</td>
                  <td className="px-6 py-3">
                    <select
                      disabled={!!supplyData.pickingNoteId}
                      value={supplyData.warehouseId || ''}
                      onChange={(e) => setSupplyData({ ...supplyData, warehouseId: e.target.value })}
                      className="text-xs border border-gray-300 rounded w-full p-2 h-9 outline-none focus:border-brand-green"
                    >
                      <option value="">-- Chọn kho yêu cầu --</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Ngày tạo</td>
                  <td className="px-6 py-3">
                    <Input
                      type="date"
                      value={supplyData.date}
                      onChange={(e) => setSupplyData({ ...supplyData, date: e.target.value })}
                      className="text-sm border-gray-300 rounded w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Tổng SL yêu cầu</td>
                  <td className="px-6 py-3 font-bold text-[#FF6B35]">{totalRequired}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-sm font-medium">Ghi chú</h4>
            </div>
            <div className="p-6">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-sm border-gray-300 rounded min-h-[200px]"
                placeholder="Nhập ghi chú..."
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {/* Danh sách sản phẩm yêu cầu */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium">Sản phẩm cần cung ứng</h4>
              </div>
              <Button
                onClick={addRequestItem}
                size="sm"
                className="admin-btn-primary border-transparent text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Thêm sản phẩm
              </Button>
            </div>
            <div className="p-6">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Sản phẩm</th>
                    <th className="px-3 py-2 text-center w-16">SL</th>
                    <th className="px-2 py-2 w-6" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplyData.requestItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        {item.isAutofilled ? (
                          <div className="border border-gray-200 bg-gray-50 rounded px-3 py-2 h-9 flex items-center text-xs font-semibold text-gray-700">
                            {item.productName} ({item.productCode})
                          </div>
                        ) : (
                          <SearchableProductSelect
                            defaultValue={item.productCode}
                            defaultLabel={item.productName}
                            onSelect={(prod) => {
                              updateRequestItem(item.id, {
                                id: prod.id,
                                productCode: prod.code || '',
                                productName: prod.name
                              });
                            }}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.requiredQuantity}
                          onChange={(e) => updateRequestItem(item.id, { requiredQuantity: parseInt(e.target.value) || 1 })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-none text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <Button
                          onClick={() => removeRequestItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 h-6 w-6 p-0"
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {supplyData.requestItems.length === 0 && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có sản phẩm nào - Nhấn "+ Thêm sản phẩm" để bắt đầu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
