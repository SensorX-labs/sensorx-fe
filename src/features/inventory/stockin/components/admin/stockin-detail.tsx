'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Package, Warehouse, Calendar,
  DollarSign, MessageSquare, Save, Edit, X, Trash,
  ClipboardList, Search
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/shadcn-ui/select";
import Link from 'next/link';
import { ActionType } from '@/shared/constants/action-type';
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';

interface StockInDetailProps {
  id?: string;
  onBack?: () => void;
}

interface StockInItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

interface StockInData {
  id: string;
  code: string;
  date: string;
  supplier: string;
  warehouse: string;
  status: 'draft' | 'pending' | 'completed';
  items: StockInItem[];
  note: string;
}

const statusColor: Record<string, string> = {
  'draft': 'bg-gray-100 text-gray-600 border-gray-200',
  'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
};

const statusLabel: Record<string, string> = {
  'draft': 'Nháp',
  'pending': 'Chờ xác nhận',
  'completed': 'Hoàn thành',
};

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

export default function StockInDetail({ id }: StockInDetailProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action') as ActionType | null;

  const [action, setAction] = useState<ActionType>(
    actionParam || ActionType.DETAIL
  );
  const [isEditing, setIsEditing] = useState(action === ActionType.CREATE);

  const [stockInData, setStockInData] = useState<StockInData>({
    id: id || 'PN001',
    code: 'PN001',
    date: new Date().toISOString().split('T')[0],
    supplier: 'Cty CP Minh Toàn',
    warehouse: (actionParam || ActionType.DETAIL) === ActionType.CREATE ? '' : 'kho-chinh',
    status: 'draft',
    items: [
      { id: '1', productCode: 'CAM-4K-001', productName: 'Camera an ninh 4K', quantity: 10, unitPrice: 5000000, taxRate: 10 },
    ],
    note: '',
  });

  const [items, setItems] = useState<StockInItem[]>(stockInData.items);
  const [supplier, setSupplier] = useState(stockInData.supplier);
  const [warehouse, setWarehouse] = useState(stockInData.warehouse);
  const [note, setNote] = useState(stockInData.note);

  const handleSave = () => {
    console.log('Lưu phiếu nhập:', { ...stockInData, items, supplier, warehouse, note });
    setAction(ActionType.DETAIL);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    console.log('Xác nhận phiếu nhập:', { ...stockInData, items, supplier, warehouse });
    setAction(ActionType.DETAIL);
  };

  const handleCancel = () => {
    setAction(ActionType.DETAIL);
    setIsEditing(false);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const sub = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + sub + sub * ((item.taxRate || 0) / 100);
    }, 0);

  const addItem = () => {
    const newItem: StockInItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 10,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof StockInItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            {action === ActionType.CREATE
              ? 'Tạo phiếu nhập kho'
              : 'Chi tiết phiếu nhập kho'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="rounded admin-btn-primary border-transparent">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              
              {action === ActionType.CREATE ? (
                <Link href="/inventory/stockin">
                  <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white rounded">
                <Package className="w-4 h-4 mr-2" />
                Xác nhận nhập
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/inventory/stockin">
                <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã phiếu</td>
                  <td className="px-6 py-3">{stockInData.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[stockInData.status]}`}>
                      {statusLabel[stockInData.status]}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Ngày nhập</td>
                  <td className="px-6 py-3">{new Date(stockInData.date).toLocaleDateString('vi-VN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Thông tin nhà cung cấp */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin nhà cung cấp & kho</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Nhà cung cấp</label>
                <Input
                  disabled={!isEditing}
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="text-sm h-9 border-gray-300 rounded"
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Kho nhận</label>
                <Select value={warehouse} onValueChange={setWarehouse} disabled={!isEditing}>
                  <SelectTrigger className="w-full h-9 text-sm border-gray-300 rounded">
                    <SelectValue placeholder="Chọn kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kho-chinh">Kho chính</SelectItem>
                    <SelectItem value="kho-phu">Kho phụ</SelectItem>
                    <SelectItem value="kho-transit">Kho trung chuyển</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Danh sách hàng hóa */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium">Danh sách hàng hóa</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addItem}
                  size="sm"
                  className="rounded admin-btn-primary border-transparent text-xs"
                >
                  + Thêm hàng hóa
                </Button>
              )}
            </div>
            <div className="p-6">
              <table className="w-full overflow-x-auto">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-20 admin-table-th text-center">SL</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-16 admin-table-th text-center">Thuế %</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Thành tiền</th>
                    {isEditing && <th className="px-1 py-3 w-5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const sub = (item.quantity || 0) * (item.unitPrice || 0);
                    const total = sub + sub * ((item.taxRate || 0) / 100);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="min-w-[200px]">
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  updateItem(item.id, 'productCode', prod.code || '');
                                  updateItem(item.id, 'productName', prod.name);
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <div>{item.productName}</div>
                              {item.productCode && <div className="text-xs mt-0.5 text-gray-500">Mã: {item.productCode}</div>}
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.taxRate}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {total.toLocaleString('vi-VN')}
                        </td>
                        {isEditing && (
                          <td className="px-1 py-3 text-center">
                            <Button
                              onClick={() => removeItem(item.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 text-lg">
                  <tr>
                    <td colSpan={isEditing ? 5 : 4} className="px-6 py-4 text-right font-semibold">
                      Tổng cộng:
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[var(--brand-green-600)]">
                      {calculateTotal().toLocaleString('vi-VN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-sm font-medium">Ghi chú</h4>
            </div>
            <div className="p-6">
              <Textarea
                disabled={!isEditing}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-sm border-gray-300 rounded min-h-[100px]"
                placeholder="Nhập ghi chú..."
              />
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <h4 className="text-sm font-medium">Tổng cộng</h4>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 font-semibold text-gray-700">Tổng tiền hàng</td>
                    <td className="py-2 text-right font-bold text-[#2B3674]">
                      {items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-gray-700">Thuế</td>
                    <td className="py-2 text-right font-bold text-[#2B3674]">
                      {items.reduce((sum, item) => {
                        const sub = item.quantity * item.unitPrice;
                        return sum + (sub * item.taxRate / 100);
                      }, 0).toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 font-bold text-[#2B3674]">Tổng cộng</td>
                    <td className="py-3 text-right font-bold text-lg text-[#2B3674]">
                      {calculateTotal().toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
