'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Trash, X, Search, ShoppingCart, MessageSquare
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { QuoteStatus } from '../../constants/quote-status';
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';
import { PaymentMethod } from '../../constants/payment-method';
import { PaymentTern } from '../../constants/payment-term';
import { QuoteDetail } from '../../models/quote-detail-response';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { RfqDetail } from '@/features/sales/RFQ/services/admin-rfq.service';
import InternalPriceService from '@/features/catalog/internal-price/services/internal-price-services';
import { QuoteService } from '../../services/quote.service';
import {
  GeneralInfoCard,
  CustomerInfoCard,
  PaymentInfoCard
} from './quotation-shared';

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

function InternalPricePopover({
  onSelect,
  children,
  disabled,
  priceData
}: {
  onSelect: (price: number) => void;
  children: React.ReactNode;
  disabled?: boolean;
  priceData?: any;
}) {
  const [open, setOpen] = useState(false);

  const tiers = priceData?.priceTiers || [];

  if (disabled || tiers.length === 0 || !React.isValidElement(children)) return <>{children}</>;

  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      if ((children as any).props.onClick) (children as any).props.onClick(e);
      setOpen(true);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>{trigger}</div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-48 p-1 shadow-md border border-gray-200"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {tiers.map((tier: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(tier.priceAmount);
                setOpen(false);
              }}
              className="px-3 py-2 text-left hover:bg-gray-100 text-xs flex justify-between items-center transition-colors"
            >
              <span className="text-gray-500 font-medium">SL ≥ {tier.quantity}:</span>
              <span className="font-bold text-gray-900">
                {tier.priceAmount.toLocaleString('vi-VN')}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface QuotationFormProps {
  id?: string;
  rfqId?: string;
  rfqData?: RfqDetail;
  onBack?: () => void;
}

export default function QuotationForm({ id, rfqId, rfqData, onBack }: QuotationFormProps) {
  const router = useRouter();
  const isEditMode = id && id !== 'new';

  const [loading, setLoading] = useState(false);
  const [quoteDetail, setQuoteDetail] = useState<QuoteDetail | null>(null);
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

  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const response = await QuoteService.getQuoteById(id!);
          if (response) {
            setQuoteDetail(response);
            setFormData({
              note: response.note || '',
              paymentMethod: (response as any).paymentMethod || PaymentMethod.BANKTRANSFER,
              paymentTerm: response.paymentTerm || PaymentTern.FULLPAYMENT,
              shippingAddress: response.shippingAddress || '',
              paymentTermDays: 0,
              quoteDate: new Date(response.quoteDate),
            });
            setSelectedCustomerId(response.customerId);
            setItems(response.items.map((item, idx) => ({
              ...item,
              key: `init-${idx}`,
              manufacturer: item.manufacturer || '',
              taxRate: item.taxRate || 0,
            })));
          }
        } catch (error) {
          console.error(">>> Lỗi khi fetch chi tiết báo giá:", error);
          toast.error("Không thể tải chi tiết báo giá");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else if (rfqData) {
      const info = getCustomerInfoFromRfq(rfqData);
      setFormData(prev => ({
        ...prev,
        shippingAddress: info?.address || '',
      }));
      setSelectedCustomerId((rfqData as any).customerId);

      const loadSuggestPrices = async () => {
        try {
          const productIds = rfqData.items.map((item: any) => item.productId).filter(Boolean);
          const priceMap: Record<string, any> = {};

          if (productIds.length > 0) {
            const response = await InternalPriceService.getSuggest({ productIds });
            if (response) {
              response.forEach((price: any) => {
                const priceTiers = (price.priceTiers || []).map((t: any) => ({
                  quantity: t.quantity,
                  priceAmount: t.amount ?? t.priceAmount ?? t.price,
                  priceCurrency: t.currency ?? t.priceCurrency
                }));
                priceMap[price.productId] = {
                  ...price,
                  priceTiers
                };
              });
            }
          }

          setItems(rfqData.items.map((item: any, idx: number) => {
            const internalPrice = priceMap[item.productId];
            const unitPrice = internalPrice ? (internalPrice.suggestedPriceAmount ?? internalPrice.suggestedPrice ?? 0) : 0;
            return {
              productId: item.productId || '',
              productCode: item.productCode || '',
              productName: item.productName || '',
              quantity: item.quantity || 0,
              unit: item.unit || '',
              manufacturer: item.manufacturer || item.category || '',
              unitPrice: unitPrice,
              taxRate: 0,
              key: `rfq-${idx}`,
              internalPrice: internalPrice,
            };
          }));
        } catch (error) {
          console.error(">>> Lỗi khi tải gợi ý giá:", error);
          setItems(rfqData.items.map((item: any, idx: number) => ({
            productId: item.productId || '',
            productCode: item.productCode || '',
            productName: item.productName || '',
            quantity: item.quantity || 0,
            unit: item.unit || '',
            manufacturer: item.manufacturer || item.category || '',
            unitPrice: 0,
            taxRate: 0,
            key: `rfq-${idx}`,
            internalPrice: undefined,
          })));
        }
      };

      loadSuggestPrices();
    }
  }, [id, rfqData, isEditMode]);

  const getCustomerInfoFromRfq = (r: any) => {
    if (!r) return null;
    if (r.customerInfo) return r.customerInfo;
    return {
      companyName: r.companyName,
      recipientName: r.recipientName,
      recipientPhone: r.recipientPhone || r.phone,
      email: r.email,
      address: r.address,
      taxCode: r.taxCode
    };
  };

  const currentCustomerInfo = quoteDetail || getCustomerInfoFromRfq(rfqData);

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
    if (items.length === 0) return toast.error("Vui lòng thêm sản phẩm");
    setIsSubmitting(true);
    try {
      const requestPayload = {
        rfqId: rfqId || rfqData?.id || quoteDetail?.rfqId || '',
        quoteDate: formData.quoteDate.toISOString(),
        shippingInfo: {
          recipientName: '',
          recipientPhone: currentCustomerInfo?.recipientPhone || currentCustomerInfo?.phone || '',
          shippingAddress: formData.shippingAddress || '',
        },
        note: formData.note,
        items: items.map(i => ({
          productId: i.productId || '',
          unitPrice: i.unitPrice || 0,
          taxRate: i.taxRate || 0,
        }))
      };
      const response = await QuoteService.createQuote(requestPayload as any);
      if (response) {
        toast.success("Tạo báo giá thành công");
        router.push('/sales/quotations');
      }
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuote = async () => {
    if (!id || items.length === 0) return;
    setIsSubmitting(true);
    try {
      const request = {
        id: id,
        note: formData.note,
        quoteDate: formData.quoteDate.toISOString(),
        paymentMethod: formData.paymentMethod,
        paymentTerm: formData.paymentTerm,
        items: items.map(i => ({
          productId: i.productId,
          productCode: i.productCode,
          manufacturer: i.manufacturer,
          unit: i.unit,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxRate: i.taxRate,
        }))
      };
      const response = await QuoteService.updateQuote(request);
      if (response) {
        toast.success("Cập nhật báo giá thành công");
        router.push(`/sales/quotations/${id}`);
      }
    } catch (error: any) {
      toast.error(error.message);
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

  const handleCancel = () => {
    if (isEditMode) {
      router.push(`/sales/quotations/${id}`);
    } else if (onBack) {
      onBack();
    } else {
      router.push('/sales/quotations');
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-blue-600 font-bold uppercase">Đang tải chi tiết báo giá...</div>;

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleCancel} variant="ghost" size="icon" className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold admin-title uppercase">
              {isEditMode ? 'Chỉnh sửa báo giá' : 'Lập báo giá mới'}
            </h2>
            {rfqData && <p className="text-xs text-gray-500 mt-1">Từ RFQ: {rfqData.code}</p>}
            {quoteDetail && <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Số báo giá: {quoteDetail.code}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <Button onClick={handleSaveDraft} disabled={isSubmitting} className="rounded admin-btn-primary h-10 px-6">
              <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "Lưu báo giá"}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="rounded border-gray-300 h-10 px-6 shadow-sm"
              >
                <X className="w-4 h-4 mr-2" /> Hủy
              </Button>
              <Button
                onClick={handleUpdateQuote}
                disabled={isSubmitting}
                className="rounded admin-btn-primary h-10 px-6"
              >
                <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "Cập nhật thay đổi"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <GeneralInfoCard
            code={quoteDetail?.code}
            quoteDate={formData.quoteDate}
            onDateChange={(date) => setFormData({ ...formData, quoteDate: date })}
          />

          <CustomerInfoCard customerInfo={currentCustomerInfo} />

          <PaymentInfoCard
            paymentMethod={formData.paymentMethod}
            paymentTerm={formData.paymentTerm}
            onPaymentMethodChange={(v) => setFormData({ ...formData, paymentMethod: v })}
            onPaymentTermChange={(v) => setFormData({ ...formData, paymentTerm: v })}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Danh sách sản phẩm</h4>
              </div>
              <Button onClick={handleAddItem} size="sm" variant="outline" className="h-8 text-xs border-gray-300 rounded bg-white">+ Thêm sản phẩm</Button>
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
                    <th className="px-3 py-3 w-10"></th>
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
                          <Input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(index, { quantity: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-center border-gray-200 shadow-none" />
                        </td>
                        <td className="px-4 py-4">
                          <InternalPricePopover
                            priceData={item.internalPrice}
                            onSelect={(price) => handleUpdateItem(index, { unitPrice: price })}
                          >
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                              onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                              className="h-10 text-sm text-right border-gray-200 shadow-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                              placeholder="0"
                            />
                          </InternalPricePopover>
                        </td>
                        <td className="px-4 py-4">
                          <Input type="number" value={item.taxRate} onChange={(e) => handleUpdateItem(index, { taxRate: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-center border-gray-200 shadow-none" />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 border-l border-gray-50">{lineValue.toLocaleString('vi-VN')}</td>
                        <td className="px-3 py-4 text-center">
                          <Button onClick={() => handleRemoveItem(index)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500"><Trash size={14} /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                  <tr>
                    <td colSpan={4} className="px-6 py-5 text-right text-gray-500 uppercase text-[10px]">Tổng cộng (sau thuế):</td>
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
              <Textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={4} className="w-full text-sm border-gray-100 focus:ring-0 resize-none shadow-none bg-gray-50/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
