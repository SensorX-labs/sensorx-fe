'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';

interface RequestItem {
  id: string;
  productCode: string;
  productName: string;
  requiredQuantity: number;
}

interface SupplyRequestData {
  id: string;
  code: string;
  date: string;
  totalRequired: number;
  requestItems: RequestItem[];
  note: string;
}

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCode, setSelectedCode] = React.useState(defaultValue || "");

  React.useEffect(() => {
    setSelectedCode(defaultValue || "");
  }, [defaultValue]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedProduct = MOCK_PRODUCTS.find(p => p.code === selectedCode);
  const displayLabel = selectedProduct ? selectedProduct.name : (defaultLabel || defaultValue || "Chọn sản phẩm...");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs h-9 font-normal border-gray-300 rounded shadow-none">
          <div className="flex flex-col items-start overflow-hidden">
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
           {filteredProducts.length === 0 ? (
             <div className="p-6 text-xs text-center text-gray-500 italic">Không tìm thấy sản phẩm phù hợp</div>
           ) : (
             filteredProducts.map(p => (
               <div 
                 key={p.id}
                 className="p-3 hover:bg-brand-green/5 cursor-pointer flex flex-col border-b border-gray-50 last:border-0 transition-colors"
                 onClick={() => {
                    setSelectedCode(p.code || "");
                    onSelect(p);
                    setOpen(false);
                 }}
               >
                 <span className="text-xs font-bold text-gray-900">{p.name}</span>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                    <span className="text-[10px] text-brand-green font-bold italic">{p.manufacturer}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function SupplyRequestCreate() {
  const router = useRouter();

  const [supplyData, setSupplyData] = useState<SupplyRequestData>({
    id: 'YC_NEW',
    code: 'YC_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    totalRequired: 0,
    requestItems: [],
    note: '',
  });

  const [note, setNote] = useState('');

  const handleSave = () => {
    const totalRequired = supplyData.requestItems.reduce((sum, item) => sum + item.requiredQuantity, 0);
    console.log('Lưu yêu cầu cung ứng:', { ...supplyData, totalRequired, note });
    // Redirect to list after save
    router.push('/supplychain/supplyrequest');
  };

  const handleCancel = () => {
    router.push('/supplychain/supplyrequest');
  };

  const addRequestItem = () => {
    const newItem: RequestItem = {
      id: Date.now().toString(),
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

  const updateRequestItem = (id: string, field: keyof RequestItem, value: any) => {
    setSupplyData({
      ...supplyData,
      requestItems: supplyData.requestItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
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
                        <SearchableProductSelect
                          defaultValue={item.productCode}
                          defaultLabel={item.productName}
                          onSelect={(prod) => {
                            updateRequestItem(item.id, 'productCode', prod.code || '');
                            updateRequestItem(item.id, 'productName', prod.name);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.requiredQuantity}
                          onChange={(e) => updateRequestItem(item.id, 'requiredQuantity', parseInt(e.target.value) || 1)}
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
