'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Package, Warehouse, Calendar,
  DollarSign, MessageSquare, Save, Edit, X, Trash,
  ClipboardList, Search, Plus
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
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';

interface SupplyRequestDetailProps {
  id?: string;
}

interface RequestItem {
  id: string;
  productCode: string;
  productName: string;
  requiredQuantity: number;
}

interface PurchasePlanItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface TransferPlanItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit?: string;
  manufacturerName?: string;
  note?: string;
}

interface TransferPlan {
  id: string;
  sourceWarehouse: string;
  items: TransferPlanItem[];
}

interface SupplyRequestData {
  id: string;
  code: string;
  date: string;
  totalRequired: number;
  status: 'draft' | 'pending' | 'approved' | 'completed';
  requestItems: RequestItem[];
  purchasePlan: PurchasePlanItem[];
  transferPlans: TransferPlan[];
  note: string;
}

const statusColor: Record<string, string> = {
  'draft': 'bg-gray-100 text-gray-600 border-gray-200',
  'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'approved': 'bg-blue-50 text-blue-700 border-blue-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
};

const statusLabel: Record<string, string> = {
  'draft': 'Nháp',
  'pending': 'Chờ duyệt',
  'approved': 'Đã duyệt',
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

export default function SupplyRequestDetail({ id }: SupplyRequestDetailProps) {
  const searchParams = useSearchParams();
  const editParam = searchParams.get('action') === 'edit';

  const [isEditing, setIsEditing] = useState(editParam || false);

  const [supplyData, setSupplyData] = useState<SupplyRequestData>({
    id: id || 'YC001',
    code: 'YC001',
    date: new Date().toISOString().split('T')[0],
    totalRequired: 25,
    status: 'pending',
    requestItems: [
      { id: '1', productCode: 'CAM-4K-001', productName: 'Camera an ninh 4K', requiredQuantity: 10 },
      { id: '2', productCode: 'MIC-DIN-002', productName: 'Micro quay đơn chiều', requiredQuantity: 15 },
    ],
    purchasePlan: [],
    transferPlans: [],
    note: '',
  });

  const [purchasePlan, setPurchasePlan] = useState<PurchasePlanItem[]>(supplyData.purchasePlan);
  const [transferPlans, setTransferPlans] = useState<TransferPlan[]>(supplyData.transferPlans);
  const [note, setNote] = useState(supplyData.note);

  const handleSave = () => {
    console.log('Lưu yêu cầu cung ứng:', { ...supplyData, purchasePlan, transferPlans, note });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    console.log('Xác nhận yêu cầu cung ứng:', { ...supplyData, purchasePlan, transferPlans });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const addPurchaseItem = () => {
    const newItem: PurchasePlanItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
    };
    setPurchasePlan([...purchasePlan, newItem]);
  };

  const removePurchaseItem = (id: string) => {
    setPurchasePlan(purchasePlan.filter(item => item.id !== id));
  };

  const updatePurchaseItem = (id: string, field: keyof PurchasePlanItem, value: any) => {
    setPurchasePlan(purchasePlan.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addTransferPlan = () => {
    const newPlan: TransferPlan = {
      id: Date.now().toString(),
      sourceWarehouse: '',
      items: [],
    };
    setTransferPlans([...transferPlans, newPlan]);
  };

  const removeTransferPlan = (id: string) => {
    setTransferPlans(transferPlans.filter(plan => plan.id !== id));
  };

  const addTransferItem = (planId: string) => {
    const newItem: TransferPlanItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
    };
    setTransferPlans(transferPlans.map(plan => 
      plan.id === planId ? { ...plan, items: [...plan.items, newItem] } : plan
    ));
  };

  const removeTransferItem = (planId: string, itemId: string) => {
    setTransferPlans(transferPlans.map(plan => 
      plan.id === planId 
        ? { ...plan, items: plan.items.filter(item => item.id !== itemId) } 
        : plan
    ));
  };

  const updateTransferItem = (planId: string, itemId: string, field: keyof TransferPlanItem, value: any) => {
    setTransferPlans(transferPlans.map(plan => 
      plan.id === planId 
        ? {
          ...plan,
          items: plan.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        }
        : plan
    ));
  };

  const updateTransferWarehouse = (planId: string, warehouse: string) => {
    setTransferPlans(transferPlans.map(plan => 
      plan.id === planId ? { ...plan, sourceWarehouse: warehouse } : plan
    ));
  };

  const purchaseTotal = purchasePlan.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Chi tiết yêu cầu cung ứng
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="rounded admin-btn-primary border-transparent">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700 hover:bg-gray-50">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white rounded">
                <Package className="w-4 h-4 mr-2" />
                Xác nhận
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/supplychain/supplyrequest">
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
              <h4 className="text-sm font-medium">Thông tin yêu cầu</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã yêu cầu</td>
                  <td className="px-6 py-3">{supplyData.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[supplyData.status]}`}>
                      {statusLabel[supplyData.status]}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Ngày tạo</td>
                  <td className="px-6 py-3">{new Date(supplyData.date).toLocaleDateString('vi-VN')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Tổng SL yêu cầu</td>
                  <td className="px-6 py-3 font-bold text-[#FF6B35]">{supplyData.totalRequired}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Danh sách sản phẩm yêu cầu */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Package className="w-4 h-4" />
              <h4 className="text-sm font-medium">Sản phẩm cần cung ứng</h4>
            </div>
            <div className="p-6">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Sản phẩm</th>
                    <th className="px-3 py-2 text-center w-16">SL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplyData.requestItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-semibold text-gray-900">{item.productName}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Mã: {item.productCode}</div>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold">{item.requiredQuantity}</td>
                    </tr>
                  ))}
                </tbody>
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
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Phương án mua hàng */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <h4 className="text-sm font-medium">Phương án mua hàng</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addPurchaseItem}
                  size="sm"
                  className="admin-btn-primary border-transparent text-xs"
                >
                  + Thêm sản phẩm
                </Button>
              )}
            </div>
            <div className="p-6">
              <table className="w-full overflow-x-auto">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-20 admin-table-th text-center">SL mua</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Tổng tiền</th>
                    {isEditing && <th className="px-1 py-3 w-5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchasePlan.map((item) => {
                    const total = (item.quantity || 0) * (item.unitPrice || 0);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="min-w-[200px]">
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  updatePurchaseItem(item.id, 'productCode', prod.code || '');
                                  updatePurchaseItem(item.id, 'productName', prod.name);
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
                              onChange={(e) => updatePurchaseItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
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
                              onChange={(e) => updatePurchaseItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {total.toLocaleString('vi-VN')}đ
                        </td>
                        {isEditing && (
                          <td className="px-1 py-3 text-center">
                            <Button
                              onClick={() => removePurchaseItem(item.id)}
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
                    <td colSpan={isEditing ? 3 : 3} className="px-6 py-4 text-right font-semibold">
                      Tổng giá trị mua:
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-[var(--brand-green-600)]">
                      {purchaseTotal.toLocaleString('vi-VN')}đ
                    </td>
                    {isEditing && <td />}
                  </tr>
                </tfoot>
              </table>
              {purchasePlan.length === 0 && !isEditing && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có phương án mua hàng nào
                </div>
              )}
            </div>
          </div>

          {/* Phương án điều chuyển */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" />
                <h4 className="text-sm font-medium">Phương án điều chuyển</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addTransferPlan}
                  size="sm"
                  className="rounded admin-btn-primary border-transparent text-xs"
                >
                  + Thêm lệnh điều chuyển
                </Button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {transferPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Kho xuất (Kho nguồn)</label>
                      <Select value={plan.sourceWarehouse} onValueChange={(value) => updateTransferWarehouse(plan.id, value)} disabled={!isEditing}>
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
                    {isEditing && (
                      <Button
                        onClick={() => removeTransferPlan(plan.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 h-8 w-8 ml-2 mt-6"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Transfer items table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-semibold text-gray-700">Sản phẩm cần chuyển</h5>
                      {isEditing && (
                        <Button
                          onClick={() => addTransferItem(plan.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Thêm sản phẩm
                        </Button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-white border-b border-gray-200 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 text-left">Sản phẩm</th>
                            <th className="px-3 py-2 text-left">ĐV</th>
                            <th className="px-3 py-2 text-center w-14">SL</th>
                            <th className="px-3 py-2 text-left">Nhà SX</th>
                            <th className="px-3 py-2 text-left">Ghi chú</th>
                            {isEditing && <th className="px-2 py-2 w-6" />}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {plan.items.map((item) => (
                            <tr key={item.id} className="hover:bg-white">
                              <td className="px-3 py-2">
                                {isEditing ? (
                                  <div>
                                    <SearchableProductSelect
                                      defaultValue={item.productCode}
                                      defaultLabel={item.productName}
                                      onSelect={(prod) => {
                                        updateTransferItem(plan.id, item.id, 'productCode', prod.code || '');
                                        updateTransferItem(plan.id, item.id, 'productName', prod.name);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-900">{item.productName || '---'}</div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-gray-700">{item.unit || '---'}</span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-blue-500"
                                  />
                                ) : (
                                  <span className="font-semibold">{item.quantity}</span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={item.manufacturerName || ''}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, 'manufacturerName', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                    placeholder="Nhà SX"
                                  />
                                ) : (
                                  <span className="text-gray-600">{item.manufacturerName || '---'}</span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={item.note || ''}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, 'note', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                    placeholder="Ghi chú"
                                  />
                                ) : (
                                  <span className="text-gray-600 text-xs">{item.note || '---'}</span>
                                )}
                              </td>
                              {isEditing && (
                                <td className="px-2 py-2 text-center">
                                  <Button
                                    onClick={() => removeTransferItem(plan.id, item.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50 h-5 w-5 p-0"
                                  >
                                    <Trash className="w-2.5 h-2.5" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {plan.items.length === 0 && (
                      <div className="py-4 text-center text-gray-500 text-sm">
                        Chưa có sản phẩm nào {isEditing ? '- Nhấn "+ Thêm sản phẩm" để bắt đầu' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {transferPlans.length === 0 && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có lệnh điều chuyển nào {isEditing ? '- Nhấn "+ Thêm lệnh điều chuyển" để bắt đầu' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
