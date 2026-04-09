'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, FileText, User, ShoppingCart,
  DollarSign, MessageSquare, Save, Trash, Edit, X,
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
import { QuoteStatus } from '../../constants/quote-status';
import Link from 'next/link';
import { MOCK_RFQS } from '../../../requestforquotation/mocks/rfq-mocks';
import { MOCK_QUOTES } from '../../mocks/quote-mocks';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';
import { PaymentMethod } from '../../constants/payment-method';
import { PaymentTern } from '../../constants/payment-term';
import { ActionType } from '@/shared/constants/action-type';

interface QuotationCreateProps {
  id?: string;      // quote id hoặc 'new'
  rfqId?: string;
  onBack?: () => void;
}

const statusColor: Record<string, string> = {
  [QuoteStatus.DRAFT]:     'bg-gray-100 text-gray-600 border-gray-200',
  [QuoteStatus.PENDING]:   'bg-blue-50 text-blue-700 border-blue-200',
  [QuoteStatus.RETURNED]:  'bg-red-50 text-red-700 border-red-200',
  [QuoteStatus.APPROVED]:  'bg-green-50 text-green-700 border-green-200',
  [QuoteStatus.SENT]:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  [QuoteStatus.ORDERED]:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  [QuoteStatus.EXPIRED]:   'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const statusLabel: Record<string, string> = {
  [QuoteStatus.DRAFT]:     'Nháp',
  [QuoteStatus.PENDING]:   'Chờ duyệt',
  [QuoteStatus.RETURNED]:  'Bị từ chối',
  [QuoteStatus.APPROVED]:  'Đã duyệt',
  [QuoteStatus.SENT]:      'Đã gửi',
  [QuoteStatus.ORDERED]:   'Đã sinh đơn',
  [QuoteStatus.EXPIRED]:   'Hết hạn',
};

const paymentMethodLabel: Record<string, string> = {
  [PaymentMethod.BANKTRANSFER]: 'Chuyển khoản',
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.ORTHER]: 'Phương thức khác',
};

const paymentTermLabel: Record<string, string> = {
  [PaymentTern.FULLPAYMENT]: '100% Trả trước',
  [PaymentTern.DEPOSIT]: '30% Cọc',
};

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCode, setSelectedCode] = React.useState(defaultValue || "");

  // Đồng bộ lại state khi prop defaultValue thay đổi
  React.useEffect(() => {
    setSelectedCode(defaultValue || "");
  }, [defaultValue]);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = mockProducts.find(p => p.code === selectedCode);
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
                    setSelectedCode(p.code);
                    onSelect(p);
                    setOpen(false);
                 }}
               >
                 <span className="text-xs font-bold text-gray-900">{p.name}</span>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                    <span className="text-[10px] text-brand-green font-bold italic">{p.manufacture}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function QuotationCreate({ id, rfqId }: QuotationCreateProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action') as ActionType | null;

  // Tìm dữ liệu báo giá nếu id != 'new'
  const existingQuote = id !== 'new' ? MOCK_QUOTES.find(q => q.id === id) : null;
  const rfq = rfqId ? MOCK_RFQS.find(r => r.id === rfqId) : null;

  const quoteCustomer = existingQuote ? { 
    id: existingQuote.customerId, 
    ...existingQuote.customerInfo 
  } : null;

  const allCustomers = [
    ...(quoteCustomer ? [quoteCustomer] : []),
    ...MOCK_RFQS.map(r => ({ id: r.customerId, ...r.customerInfo }))
  ].filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  // Khai báo state dựa trên dữ liệu hiện có hoặc rfq
  const [action, setAction] = useState<ActionType>(actionParam || ActionType.DETAIL);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    existingQuote?.customerId || rfq?.customerId || null
  );
  
  const [formData, setFormData] = useState({
    note: existingQuote?.note || '',
    paymentMethod: existingQuote?.response?.paymentMethod || PaymentMethod.BANKTRANSFER as string,
    paymentTerm: existingQuote?.response?.paymentTerm || PaymentTern.FULLPAYMENT as string,
  });

  const [items, setItems] = useState(
    existingQuote?.items.map((item, idx) => ({ ...item, key: idx })) ||
    rfq?.items.map((item, idx) => ({
      ...item, unitPrice: 0, taxRate: 10, key: idx,
    })) || []
  );

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;
  const selectedCustomer = allCustomers.find(c => c.id === selectedCustomerId);
  const customerInfo = selectedCustomer || existingQuote?.customerInfo || rfq?.customerInfo;

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      productCode: '', productName: '', quantity: 1,
      unit: '', unitPrice: 0, taxRate: 10, key: prev.length,
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Lưu nháp:', { customerInfo, ...formData, items });
    setAction(ActionType.DETAIL);
  };

  const handleSubmit = () => {
    console.log('Gửi duyệt:', { customerInfo, ...formData, items });
    setAction(ActionType.DETAIL);
  };

  const handleCancel = () => {
    setAction(ActionType.DETAIL);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const sub = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + sub + sub * ((item.taxRate || 0) / 100);
    }, 0);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE
              ? 'Tạo báo giá mới'
              : action === ActionType.UPDATE
              ? 'Chỉnh sửa báo giá'
              : 'Chi tiết báo giá'}
          </h2>
          {rfq && <p className="text-xs text-gray-500 mt-1">Từ yêu cầu: {rfq.code}</p>}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleSave} className="rounded admin-btn-primary border-transparent">
                <Save className="w-4 h-4 mr-2" />
                Lưu nháp
              </Button>
              
              {action === ActionType.CREATE ? (
                <Link href="/sales/quotations">
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
                <FileText className="w-4 h-4 mr-2" />
                Gửi duyệt
              </Button>
              <Button variant="outline" onClick={() => setAction(ActionType.UPDATE)} className="rounded text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/sales/quotations">
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
              <ClipboardList className="w-4 h-4 " />
              <h4 className="text-sm font-medium">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã báo giá</td>
                  <td className="px-6 py-3">{existingQuote?.code || '—'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[existingQuote?.status || QuoteStatus.DRAFT]}`}>
                      {statusLabel[existingQuote?.status || QuoteStatus.DRAFT]}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày tạo</td>
                  <td className="px-6 py-3">
                    {existingQuote?.quoteDate ? new Date(existingQuote.quoteDate).toLocaleDateString('vi-VN') : '—'}
                  </td>
                </tr>
                {existingQuote?.parentId && (
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Bản gốc</td>
                    <td className="px-6 py-3 text-blue-600 hover:underline cursor-pointer">
                      {existingQuote.parentId}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-4 h-4 " />
              <h4 className="text-sm font-medium">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <Select
                        value={selectedCustomerId || ''}
                        onValueChange={setSelectedCustomerId}
                        disabled={!!rfq}
                      >
                        <SelectTrigger className="w-[280px] text-sm h-10 border-gray-300 rounded focus:ring-1 focus:ring-[var(--brand-green-500)]">
                          <SelectValue placeholder="Chọn khách hàng..." className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCustomers.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-sm">
                              {c.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>{customerInfo?.companyName || '—'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người liên hệ</td>
                  <td className="px-6 py-3">
                    {customerInfo?.recipientName || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                  <td className="px-6 py-3">
                    {customerInfo?.recipientPhone || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3">
                    {customerInfo?.email || '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 " />
              <h4 className="text-sm font-medium">Điều khoản thanh toán</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Phương thức</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
                      >
                        <SelectTrigger className="text-xs h-8 border-gray-300 rounded focus:ring-1 focus:ring-[var(--brand-green-500)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(paymentMethodLabel).map(([val, label]) => (
                            <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>
                        {paymentMethodLabel[formData.paymentMethod]}
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Hạn thanh toán</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <Select
                        value={formData.paymentTerm}
                        onValueChange={(v) => setFormData({ ...formData, paymentTerm: v })}
                      >
                        <SelectTrigger className="text-xs h-8 border-gray-300 rounded focus:ring-1 focus:ring-[var(--brand-green-500)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(paymentTermLabel).map(([val, label]) => (
                            <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>
                        {paymentTermLabel[formData.paymentTerm]}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">

          {/* Bảng sản phẩm */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 " />
                <h4 className="text-base font-medium">Danh mục sản phẩm</h4>
              </div>
              {isEditing && (
                <Button onClick={handleAddItem} size="sm" className="rounded admin-btn-primary border-transparent text-xs">
                  + Thêm sản phẩm
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left">Sản phẩm</th>
                    <th className="px-6 py-3 w-24 admin-table-th text-center">SL</th>
                    <th className="px-6 py-3 w-32 admin-table-th text-right">Đơn giá</th>
                    <th className="px-6 py-3 w-20 admin-table-th text-center">Thuế %</th>
                    <th className="px-6 py-3 w-32 admin-table-th text-right">Cộng</th>
                    {isEditing && <th className="px-3 py-3 w-10" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const sub = (item.quantity || 0) * (item.unitPrice || 0);
                    const total = sub + sub * ((item.taxRate || 0) / 100);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="min-w-[200px]">
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  const updatedItems = [...items];
                                  updatedItems[index] = {
                                    ...updatedItems[index],
                                    productCode: prod.code,
                                    productName: prod.name,
                                    unit: prod.unit?.name || item.unit
                                  };
                                  setItems(updatedItems);
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <div>{item.productName}</div>
                              <div className="text-xs mt-0.5">Mã: {item.productCode}</div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.quantity} {item.unit}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                              min="0" max="100"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.taxRate}%</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {total.toLocaleString('vi-VN')}
                        </td>
                        {isEditing && (
                          <td className="px-3 py-3 text-center">
                            <Button
                              onClick={() => handleRemoveItem(index)}
                              size="sm" variant="ghost"
                              className="text-red-500 hover:bg-red-50 h-7 w-7 p-0"
                            >
                              <Trash className="w-3.5 h-3.5" />
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
              <MessageSquare className="w-4 h-4 " />
              <h4 className="text-base font-medium">Ghi chú & Điều khoản</h4>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Nhập ghi chú, điều khoản vận chuyển, bảo hành, v.v..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)] resize-none"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {formData.note || <span className=" italic">Không có ghi chú.</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}