'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, FileText, User, ShoppingCart,
  DollarSign, MessageSquare, Save, Trash, Edit, X,
  ClipboardList, Search, Zap, CheckCircle, AlertCircle, XCircle, TrendingUp, MapPin, Calendar as CalendarIcon
} from 'lucide-react';
import { QuoteAnalysisService } from '../../services/quote-analysis-service';
import { QuoteService } from '../../services/quote-service';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { Calendar } from "@/shared/components/shadcn-ui/calendar";
import { QuoteStatus } from '../../constants/quote-status';
import Link from 'next/link';
import { MOCK_RFQS } from '../../../requestforquotation/mocks/rfq-mocks';
import { MOCK_QUOTES } from '../../mocks/quote-mocks';
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';
import { PaymentMethod } from '../../constants/payment-method';
import { PaymentTern } from '../../constants/payment-term';
import { ActionType } from '@/shared/constants/action-type';
import { RfqDetail } from '../../../requestforquotation/models/rfq-detail-response';
import { QuoteCreateRequest } from '../../models/quote-create-request';
import { cn } from '@/shared/utils/cn';
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface QuotationCreateProps {
  id?: string;      // quote id hoặc 'new'
  rfqId?: string;
  rfqData?: RfqDetail;
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

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect, disabled }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void, disabled?: boolean }) {
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
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant="outline" className="w-full justify-between text-sm h-10 font-normal border-gray-200 rounded shadow-none">
          <span className="truncate">{displayLabel}</span>
          {!disabled && <Search className="h-4 w-4 opacity-50 ml-2 shrink-0" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 shadow-lg border-gray-200" align="start">
        <div className="p-2 border-b bg-gray-50">
           <Input 
              placeholder="Gõ tên hoặc mã sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-sm focus:ring-0 border-gray-200 shadow-none"
              autoFocus
           />
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
           {filteredProducts.length === 0 ? (
             <div className="p-8 text-sm text-center text-gray-500">Không tìm thấy sản phẩm phù hợp</div>
           ) : (
             filteredProducts.map(p => (
               <div 
                 key={p.id}
                 className="p-4 hover:bg-gray-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-0"
                 onClick={() => {
                    setSelectedCode(p.code || "");
                    onSelect(p);
                    setOpen(false);
                 }}
               >
                 <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                 <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-gray-500">Mã: {p.code}</span>
                    <span className="text-xs text-blue-600 font-medium">{p.manufacturer}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function QuotationCreate({ id, rfqId, rfqData, onBack }: QuotationCreateProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action') as ActionType | null;

  const existingQuote = id && id !== 'new' ? MOCK_QUOTES.find(q => q.id === id) : null;
  const rfqRaw = rfqData || (rfqId ? MOCK_RFQS.find(r => r.id === rfqId) : null);

  const getCustomerInfoFromRfq = (r: any) => {
    if (!r) return null;
    if (r.customerInfo) return r.customerInfo;
    return {
      companyName: r.companyName,
      recipientName: r.recipientName,
      recipientPhone: r.recipientPhone,
      email: r.email,
      address: r.address,
      taxCode: r.taxCode
    };
  };

  const currentCustomerInfo = getCustomerInfoFromRfq(rfqRaw) || existingQuote?.customerInfo;

  const [action, setAction] = useState<ActionType>(actionParam || (existingQuote ? ActionType.DETAIL : ActionType.CREATE));
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    existingQuote?.customerId || (rfqRaw as any)?.customerId || null
  );
  
  const [formData, setFormData] = useState({
    note: existingQuote?.note || '',
    paymentMethod: existingQuote?.response?.paymentMethod || PaymentMethod.BANKTRANSFER as string,
    paymentTerm: existingQuote?.response?.paymentTerm || PaymentTern.FULLPAYMENT as string,
    shippingAddress: currentCustomerInfo?.address || '',
    paymentTermDays: 0,
    quoteDate: existingQuote?.quoteDate ? new Date(existingQuote.quoteDate) : new Date(),
  });

  const [items, setItems] = useState<any[]>(() => {
    if (existingQuote) {
      return existingQuote.items.map((item, idx) => ({ ...item, key: idx }));
    }
    if (rfqRaw) {
      return rfqRaw.items.map((item: any, idx: number) => ({
        productId: item.productId || '',
        productCode: item.productCode || '',
        productName: item.productName || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        manufacturer: item.manufacturer || item.category || '',
        unitPrice: 0, 
        taxRate: 0, 
        key: idx,
      }));
    }
    return [];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      productId: '',
      productCode: '', productName: '', quantity: 1,
      unit: '', manufacturer: '', unitPrice: 0, taxRate: 0, key: prev.length,
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const request: QuoteCreateRequest = {
        rfqId: rfqId || rfqRaw?.id || '',
        customerId: selectedCustomerId || (rfqRaw as any)?.customerId || '',
        recipientName: currentCustomerInfo?.recipientName || '',
        recipientPhone: currentCustomerInfo?.recipientPhone || '',
        companyName: currentCustomerInfo?.companyName || '',
        email: currentCustomerInfo?.email || '',
        address: currentCustomerInfo?.address || '',
        taxCode: currentCustomerInfo?.taxCode || '',
        note: formData.note,
        quoteDate: formData.quoteDate.toISOString(),
        shippingAddress: formData.shippingAddress,
        paymentTermDays: formData.paymentTermDays,
        items: items.map(i => ({
          productId: i.productId || '',
          productCode: i.productCode || '',
          manufacturer: i.manufacturer || '',
          unit: i.unit || '',
          quantity: i.quantity || 0,
          unitPrice: i.unitPrice || 0,
          taxRate: i.taxRate || 0,
        }))
      };

      const quoteService = new QuoteService();
      await quoteService.createQuote(request);
      alert("Báo giá nháp đã được lưu thành công.");
      if (onBack) onBack();
    } catch (error: any) {
      alert("Lỗi khi lưu báo giá: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const sub = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + sub + sub * ((item.taxRate || 0) / 100);
    }, 0);

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           {onBack && (
              <Button onClick={onBack} variant="ghost" size="icon" className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm">
                 <ArrowLeft className="w-4 h-4" />
              </Button>
           )}
           <div className="flex flex-col">
              <h2 className="text-2xl font-bold admin-title uppercase">
                {action === ActionType.CREATE ? 'Lập báo giá mới' : action === ActionType.UPDATE ? 'Chỉnh sửa báo giá' : 'Chi tiết báo giá'}
              </h2>
              {rfqRaw && <p className="text-xs text-gray-500 mt-1">Từ RFQ: {rfqRaw.code}</p>}
           </div>
        </div>
        <div className="flex items-center gap-2">
          {action === ActionType.CREATE && (
             <Button 
               onClick={handleSaveDraft} 
               disabled={isSubmitting}
               className="rounded admin-btn-primary border-transparent h-10 px-6"
             >
               <Save className="w-4 h-4 mr-2" />
               {isSubmitting ? "Đang lưu..." : "Lưu báo giá"}
             </Button>
          )}
          {action === ActionType.DETAIL && (
             <Button variant="outline" className="rounded admin-btn-primary border-transparent h-10 px-6">
                <FileText className="w-4 h-4 mr-2" />
                Gửi duyệt
             </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 space-y-6">
          {/* Thông tin chung mới bổ sung Ngày báo giá */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <ClipboardList size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
            </div>
            <div className="p-6 space-y-5">
                {action !== ActionType.CREATE && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Mã báo giá</label>
                    <p className="text-sm font-bold text-gray-900 tracking-tight">{existingQuote?.code}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-gray-500">Ngày báo giá</label>
                   <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-10 border-gray-200 rounded",
                            !formData.quoteDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {formData.quoteDate ? format(formData.quoteDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.quoteDate}
                          onSelect={(date) => date && setFormData({ ...formData, quoteDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <User size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                   <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                   <td className="px-6 py-3 font-medium text-gray-900">{currentCustomerInfo?.companyName || '—'}</td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">Người liên hệ</td>
                   <td className="px-6 py-3 font-medium text-gray-900">{currentCustomerInfo?.recipientName || '—'}</td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                   <td className="px-6 py-3 font-medium text-gray-900">{currentCustomerInfo?.recipientPhone || '—'}</td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                   <td className="px-6 py-3 font-medium text-gray-900">{currentCustomerInfo?.email || '—'}</td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                   <td className="px-6 py-3 font-medium text-gray-600 text-xs italic">{currentCustomerInfo?.address || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <DollarSign size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thanh toán</h4>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-gray-500">Phương thức</label>
                   <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                      <SelectTrigger className="h-10 text-sm border-gray-200 rounded">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {Object.entries(paymentMethodLabel).map(([val, label]) => (
                            <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-gray-500">Hạn mức</label>
                   <Select value={formData.paymentTerm} onValueChange={(v) => setFormData({ ...formData, paymentTerm: v })}>
                      <SelectTrigger className="h-10 text-sm border-gray-200 rounded">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {Object.entries(paymentTermLabel).map(([val, label]) => (
                            <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Danh sách sản phẩm</h4>
              </div>
              <Button onClick={handleAddItem} size="sm" variant="outline" className="h-8 text-xs border-gray-300 rounded bg-white">
                + Thêm sản phẩm
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-20 text-center">SL</th>
                    <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-20 text-center">Thuế %</th>
                    <th className="px-6 py-3 w-32 text-right">Thành tiền</th>
                    <th className="px-3 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const sub = (item.quantity || 0) * (item.unitPrice || 0);
                    const total = sub + sub * ((item.taxRate || 0) / 100);
                    return (
                      <tr key={index} className="hover:bg-gray-50/30">
                        <td className="px-6 py-4">
                          <SearchableProductSelect
                            defaultValue={item.productCode}
                            defaultLabel={item.productName}
                            onSelect={(prod) => {
                              const updatedItems = [...items];
                              updatedItems[index] = {
                                ...updatedItems[index],
                                productId: prod.id,
                                productCode: prod.code,
                                productName: prod.name,
                                unit: prod.unit || item.unit,
                                manufacturer: prod.manufacturer || item.manufacturer
                              };
                              setItems(updatedItems);
                            }}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                            className="h-10 text-sm text-center border-gray-200 shadow-none"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                            className="h-10 text-sm text-right border-gray-200 shadow-none"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-4">
                           <Input
                             type="number"
                             value={item.taxRate}
                             onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                             onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                             className="h-10 text-sm text-center border-gray-200 shadow-none"
                           />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 border-l border-gray-50">
                          {total.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-3 py-4 text-center">
                           <Button onClick={() => handleRemoveItem(index)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500">
                              <Trash size={14} />
                           </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                   <tr>
                      <td colSpan={4} className="px-6 py-5 text-right text-gray-500 uppercase text-[10px] tracking-wider">Tổng cộng (sau thuế):</td>
                      <td className="px-6 py-5 text-right text-blue-600 text-xl">{calculateTotal().toLocaleString('vi-VN')} đ</td>
                      <td></td>
                   </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <MessageSquare size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Ghi chú & Điều khoản bổ sung</h4>
            </div>
            <div className="p-6">
               <Textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Nhập ghi chú hoặc các điều khoản bảo hành, vận chuyển, cam kết kỹ thuật..."
                  rows={4}
                  className="w-full text-sm border-gray-100 focus:ring-0 resize-none shadow-none bg-gray-50/20"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}