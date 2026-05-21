'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Package, Calendar,
  MessageSquare, Save, Edit, X, Trash,
  ClipboardList, Search, Plus, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import Link from 'next/link';
import { ActionType } from '@/shared/constants/action-type';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { StockAdjustmentService, StockAdjustmentDetail as StockAdjustmentDetailModel } from '@/features/inventory/stockadjustment/services/stock-adjustment-service';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';

interface AdjustmentItem {
  id: string; // Frontend temp ID
  productId?: string; // Backend Guid
  productCode: string;
  productName: string;
  unit: string;
  adjustedQuantity: number;
  note?: string;
}

const statusColor: Record<string, string> = {
  'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Approved': 'bg-green-50 text-green-700 border-green-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Chờ duyệt',
  'Approved': 'Đã duyệt',
  'Rejected': 'Từ chối',
};

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

const generateAdjustmentCode = () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const random9 = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `PKK-${yy}${mm}${dd}-${random9}`;
};

export default function StockAdjustmentDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const actionParam = searchParams.get('action') as ActionType | null;
  const [action, setAction] = useState<ActionType>(actionParam || (id ? ActionType.DETAIL : ActionType.CREATE));

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: generateAdjustmentCode(),
    reason: 'Kiểm kê định kỳ',
    description: '',
    items: [] as AdjustmentItem[],
    status: 'Pending'
  });

  useEffect(() => {
    if (id && action !== ActionType.CREATE) {
      setLoading(true);
      StockAdjustmentService.getById(id)
        .then(data => {
          if (data) {
            setFormData({
              code: data.code,
              reason: data.reason,
              description: data.description || '',
              status: data.status,
              items: data.items.map(i => ({
                id: Math.random().toString(),
                productId: i.productId,
                productCode: i.productCode,
                productName: i.productName,
                unit: i.unit,
                adjustedQuantity: i.adjustedQuantity,
                note: i.note
              }))
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, action]);

  const addItem = () => {
    const newItem: AdjustmentItem = {
      id: Math.random().toString(),
      productCode: '',
      productName: '',
      unit: 'Cái',
      adjustedQuantity: 0,
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
  };

  const updateItem = (itemId: string, field: keyof AdjustmentItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
    }));
  };

  const handleSave = async () => {
    if (!formData.reason) {
      toast.error("Vui lòng nhập lý do điều chỉnh");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Vui lòng thêm ít nhất một mặt hàng");
      return;
    }

    setLoading(true);
    try {
      if (action === ActionType.CREATE) {
        const payload = {
          code: formData.code,
          reason: formData.reason,
          description: formData.description,
          items: formData.items.map(i => ({
            productId: i.productId,
            productCode: i.productCode,
            productName: i.productName,
            unit: i.unit,
            adjustedQuantity: i.adjustedQuantity,
            note: i.note
          }))
        };
        await StockAdjustmentService.create(payload);
        toast.success("Tạo phiếu kiểm kê thành công");
        router.push("/warehouse/stock-adjustment");
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Lỗi khi lưu phiếu");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;

  return (
    <div className="space-y-6 w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/warehouse/stock-adjustment">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE ? 'Tạo phiếu kiểm kê' : 'Chi tiết phiếu điều chỉnh'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              <Save className="w-4 h-4 mr-2" /> Lưu phiếu
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
               <ClipboardList className="w-4 h-4 text-gray-400" />
               <h4 className="text-sm font-bold uppercase text-gray-600 tracking-wider">Thông tin chung</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Mã phiếu</label>
                <Input 
                  value={formData.code} 
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  disabled={!isEditing}
                  className="rounded border-gray-200 h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Lý do điều chỉnh</label>
                <Input 
                  value={formData.reason} 
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Ví dụ: Kiểm kê định kỳ, Hàng hư hỏng..."
                  className="rounded border-gray-200 h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Trạng thái</label>
                <div className={`px-3 py-1 rounded border text-sm font-bold w-fit ${statusColor[formData.status] || 'bg-gray-100'}`}>
                  {statusLabel[formData.status] || formData.status}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Ghi chú</label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="rounded border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-bold uppercase text-gray-600 tracking-wider">Danh sách hàng hóa điều chỉnh</h4>
               </div>
               {isEditing && (
                 <Button variant="outline" size="sm" onClick={addItem} className="h-8 rounded admin-btn-primary border-transparent">
                   <Plus className="w-4 h-4 mr-1" /> Thêm hàng
                 </Button>
               )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="px-6 py-3">Sản phẩm</th>
                    <th className="px-6 py-3 text-center w-[120px]">SL Điều chỉnh</th>
                    <th className="px-6 py-3">Ghi chú</th>
                    {isEditing && <th className="px-6 py-3 text-center w-[60px]"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <SearchableProductSelect 
                            defaultValue={item.productCode}
                            defaultLabel={item.productName}
                            onSelect={(p) => {
                              updateItem(item.id, 'productId', p.id);
                              updateItem(item.id, 'productCode', p.code);
                              updateItem(item.id, 'productName', p.name);
                              updateItem(item.id, 'unit', p.unitOfQuantityName || 'Cái');
                            }}
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{item.productName}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{item.productCode}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number"
                          value={item.adjustedQuantity}
                          onChange={(e) => updateItem(item.id, 'adjustedQuantity', parseFloat(e.target.value))}
                          disabled={!isEditing}
                          className="h-8 text-center font-bold text-blue-600 rounded border-gray-200"
                        />
                        {item.adjustedQuantity > 0 && <p className="text-[10px] text-green-500 text-center mt-1">+ Tăng kho</p>}
                        {item.adjustedQuantity < 0 && <p className="text-[10px] text-red-500 text-center mt-1">- Giảm kho</p>}
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          value={item.note || ''}
                          onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                          disabled={!isEditing}
                          placeholder="..."
                          className="h-8 rounded border-gray-200 text-xs"
                        />
                      </td>
                      {isEditing && (
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                        Chưa có mặt hàng nào. Nhấn "Thêm hàng" để bắt đầu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
