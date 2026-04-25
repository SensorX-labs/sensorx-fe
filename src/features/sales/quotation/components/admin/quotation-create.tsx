'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';
import { PaymentMethod } from '../../constants/payment-method';
import { PaymentTern } from '../../constants/payment-term';
import { ActionType } from '@/shared/constants/action-type';
import { RfqDetail } from '../../../requestforquotation/models/rfq-detail-response';
import { QuoteCreateRequest } from '../../models/quote-create-request';
import { QuoteDetail } from '../../models/quote-detail-response';
import { cn } from '@/shared/utils/cn';
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from 'sonner';

interface QuotationCreateProps {
  id?: string;
  rfqId?: string;
  rfqData?: RfqDetail;
  onBack?: () => void;
}

const statusColor: Record<string, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-600 border-gray-200',
  [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-700 border-blue-200',
  [QuoteStatus.RETURNED]: 'bg-red-50 text-red-700 border-red-200',
  [QuoteStatus.APPROVED]: 'bg-green-50 text-green-700 border-green-200',
  [QuoteStatus.SENT]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [QuoteStatus.EXPIRED]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const statusLabel: Record<string, string> = {
  [QuoteStatus.DRAFT]: 'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.RETURNED]: 'Bị từ chối',
  [QuoteStatus.APPROVED]: 'Đã duyệt',
  [QuoteStatus.SENT]: 'Đã gửi',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.EXPIRED]: 'Hết hạn',
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action') as ActionType | null;

  const [quoteDetail, setQuoteDetail] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const rfqRaw = rfqData || (rfqId ? MOCK_RFQS.find(r => r.id === rfqId) : null);

  const [action, setAction] = useState<ActionType>(actionParam || ActionType.CREATE);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    note: '',
    paymentMethod: PaymentMethod.BANKTRANSFER as string,
    paymentTerm: PaymentTern.FULLPAYMENT as string,
    shippingAddress: '',
    paymentTermDays: 0,
    quoteDate: new Date(),
  });

  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI analysis states
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const response = await QuoteService.getQuoteById(id);
          if (response.isSuccess && response.value) {
            const detail = response.value;
            setQuoteDetail(detail);

            setFormData({
              note: detail.note || '',
              paymentMethod: detail.paymentTerm || PaymentMethod.BANKTRANSFER,
              paymentTerm: detail.paymentTerm || PaymentTern.FULLPAYMENT,
              shippingAddress: detail.shippingAddress || '',
              paymentTermDays: 0,
              quoteDate: new Date(detail.quoteDate),
            });
            setSelectedCustomerId(detail.customerId);
            setItems(detail.items.map((item, idx) => ({
              ...item,
              key: `init-${idx}`,
              manufacturer: item.manufacturer || '',
              taxRate: item.taxRate || 0,
            })));
            if (!actionParam) setAction(ActionType.DETAIL);

            if (detail.status === QuoteStatus.DRAFT || detail.status === QuoteStatus.PENDING) {
              handleAnalyzeQuote(detail.code);
            }
          }
        } catch (error: any) {
          console.error(">>> Lỗi khi fetch chi tiết báo giá:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else if (rfqRaw) {
      const info = getCustomerInfoFromRfq(rfqRaw);
      setFormData(prev => ({
        ...prev,
        shippingAddress: info?.address || '',
      }));
      setSelectedCustomerId((rfqRaw as any).customerId);
      setItems(rfqRaw.items.map((item: any, idx: number) => ({
        productId: item.productId || '',
        productCode: item.productCode || '',
        productName: item.productName || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        manufacturer: item.manufacturer || item.category || '',
        unitPrice: 0,
        taxRate: 0,
        key: `rfq-${idx}`,
      })));
    }
  }, [id, rfqRaw, actionParam]);

  const handleAnalyzeQuote = async (quoteCode: string) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const quoteAnalysisService = new QuoteAnalysisService();
      const response = await quoteAnalysisService.analyzeQuote(quoteCode);
      const data = response.value || response;
      setAnalysisResult(data);
    } catch (error: any) {
      setAnalysisError(error.message || 'Lỗi phân tích báo giá');
    } finally {
      setAnalysisLoading(false);
    }
  };

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

  const currentCustomerInfo = quoteDetail || getCustomerInfoFromRfq(rfqRaw);

  const handleUpdateItem = (index: number, changes: any) => {
    setItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...changes };
      }
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      productId: '',
      productCode: '', productName: '', quantity: 1,
      unit: '', manufacturer: '', unitPrice: 0, taxRate: 0, key: `new-${Date.now()}-${prev.length}`,
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (items.length === 0) return alert("Vui lòng thêm sản phẩm");
    setIsSubmitting(true);
    try {
      const request: QuoteCreateRequest = {
        rfqId: rfqId || rfqRaw?.id || quoteDetail?.rfqId || '',
        customerId: selectedCustomerId || '',
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
      const response = await QuoteService.createQuote(request);
      if (response.isSuccess) {
        router.push('/sales/quotations');
      } else {
        alert("Lỗi: " + (response.message || "Không thể tạo báo giá"));
      }
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const t = Number(item.taxRate) || 0;
      return sum + Math.round((q * p) * (1 + t / 100));
    }, 0);

  if (loading) return <div className="py-20 text-center animate-pulse text-blue-600 font-bold uppercase">Đang tải chi tiết báo giá...</div>;

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
            {quoteDetail && <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Số báo giá: {quoteDetail.code}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action === ActionType.CREATE && (
            <Button onClick={handleSaveDraft} disabled={isSubmitting} className="rounded admin-btn-primary h-10 px-6">
              <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "Lưu báo giá"}
            </Button>
          )}
          {action === ActionType.DETAIL && (
            <Button variant="outline" className="rounded admin-btn-primary h-10 px-6">
              <FileText className="w-4 h-4 mr-2" /> Gửi duyệt
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Analysis Section */}
        {analysisResult && (
          <div className="md:col-span-3 bg-white border border-gray-100 rounded p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Zap size={16} className={cn(analysisResult.status === 'pending' && "animate-pulse")} />
                <span className="font-bold uppercase tracking-wider text-sm">Phân tích từ AI</span>
              </div>
              {analysisResult.status !== 'pending' && (
                <div className={cn(
                  "text-xl font-black uppercase tracking-tighter px-4 py-1.5 rounded-lg border-2",
                  (() => {
                    const status = analysisResult.analysis?.deal_status || analysisResult.deal_status || "";
                    const s = status.toLowerCase();
                    if (s.includes('rủi ro') || s.includes('risk') || s.includes('cảnh báo')) return 'bg-red-50 text-red-600 border-red-200';
                    if (s.includes('tiềm năng') || s.includes('potential') || s.includes('tốt')) return 'bg-green-50 text-green-600 border-green-200';
                    return 'bg-blue-50 text-blue-600 border-blue-200';
                  })()
                )}>
                  {analysisResult.analysis?.deal_status || analysisResult.deal_status || "N/A"}
                </div>
              )}
            </div>

            {analysisResult.status === 'pending' ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <div className="flex items-center gap-3 text-blue-600 font-medium">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <span>{analysisResult.message || "Hệ thống đang tiến hành phân tích báo giá..."}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => quoteDetail && handleAnalyzeQuote(quoteDetail.code)}
                  className="text-xs text-gray-500 hover:text-blue-600"
                >
                  Cập nhật lại
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900 uppercase text-[10px] bg-gray-100 px-1.5 py-0.5 rounded mr-2">Phân tích</span>
                  {analysisResult.analysis?.reasoning}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900 uppercase text-[10px] bg-gray-100 px-1.5 py-0.5 rounded mr-2">Chiến lược</span>
                  {analysisResult.analysis?.strategy}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <ClipboardList size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
            </div>
            <div className="p-6 space-y-5">
              {(action !== ActionType.CREATE || quoteDetail) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Mã báo giá</label>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{quoteDetail?.code || '—'}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Ngày báo giá</label>
                <Popover>
                  <PopoverTrigger asChild disabled={action === ActionType.DETAIL}>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10 border-gray-200 rounded disabled:opacity-100", !formData.quoteDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {formData.quoteDate ? format(formData.quoteDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={formData.quoteDate} onSelect={(date) => date && setFormData({ ...formData, quoteDate: date })} initialFocus />
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
                <Select disabled={action === ActionType.DETAIL} value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                  <SelectTrigger className="h-10 text-sm border-gray-200 rounded disabled:opacity-100"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentMethodLabel).map(([val, label]) => (
                      <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Hạn mức</label>
                <Select disabled={action === ActionType.DETAIL} value={formData.paymentTerm} onValueChange={(v) => setFormData({ ...formData, paymentTerm: v })}>
                  <SelectTrigger className="h-10 text-sm border-gray-200 rounded disabled:opacity-100"><SelectValue /></SelectTrigger>
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
              {action !== ActionType.DETAIL && (
                <Button onClick={handleAddItem} size="sm" variant="outline" className="h-8 text-xs border-gray-300 rounded bg-white">+ Thêm sản phẩm</Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-28 text-center">SL</th>
                    <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-28 text-center">Thuế %</th>
                    <th className="px-6 py-3 w-32 text-right">Thành tiền</th>
                    {action !== ActionType.DETAIL && <th className="px-3 py-3 w-10"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const q = Number(item.quantity) || 0;
                    const p = Number(item.unitPrice) || 0;
                    const t = Number(item.taxRate) || 0;
                    const lineValue = Math.round((q * p) * (1 + t / 100));

                    return (
                      <tr key={item.key || index} className="hover:bg-gray-50/30">
                        <td className="px-6 py-4 min-w-[200px]">
                          <SearchableProductSelect
                            disabled={action === ActionType.DETAIL}
                            defaultValue={item.productCode}
                            defaultLabel={item.productName}
                            onSelect={(prod) => {
                              handleUpdateItem(index, {
                                productId: prod.id,
                                productCode: prod.code,
                                productName: prod.name,
                                unit: prod.unit || item.unit,
                                manufacturer: prod.manufacturer || item.manufacturer
                              });
                            }}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input disabled={action === ActionType.DETAIL} type="number" value={item.quantity} onChange={(e) => handleUpdateItem(index, { quantity: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-center border-gray-200 shadow-none disabled:opacity-100" />
                        </td>
                        <td className="px-4 py-4">
                          <Input disabled={action === ActionType.DETAIL} type="number" value={item.unitPrice} onChange={(e) => handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-right border-gray-200 shadow-none disabled:opacity-100" placeholder="0" />
                        </td>
                        <td className="px-4 py-4">
                          <Input disabled={action === ActionType.DETAIL} type="number" value={item.taxRate} onChange={(e) => handleUpdateItem(index, { taxRate: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-center border-gray-200 shadow-none disabled:opacity-100" />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 border-l border-gray-50">{lineValue.toLocaleString('vi-VN')}</td>
                        {action !== ActionType.DETAIL && (
                          <td className="px-3 py-4 text-center">
                            <Button onClick={() => handleRemoveItem(index)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500"><Trash size={14} /></Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                  <tr>
                    <td colSpan={4} className="px-6 py-5 text-right text-gray-500 uppercase text-[10px]">Tổng cộng (sau thuế):</td>
                    <td className="px-6 py-5 text-right text-blue-600 text-xl">{calculateTotal().toLocaleString('vi-VN')} đ</td>
                    {action !== ActionType.DETAIL && <td></td>}
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
              <Textarea disabled={action === ActionType.DETAIL} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={4} className="w-full text-sm border-gray-100 focus:ring-0 resize-none shadow-none bg-gray-50/20 disabled:opacity-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}