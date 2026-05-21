'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Trash, Search, ShoppingCart, MessageSquare
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { RfqDetail } from '@/features/sales/RFQ/services/admin-rfq.service';
import InternalPriceService from '@/features/catalog/internal-price/services/internal-price-services';
import { DraftQuoteCommand, QuoteService } from '../../services/quote.service';
import {
  CustomerInfoCard, SenderInfoCard
} from './quotation-shared';
import { toast } from 'sonner';
import StaffService from '@/features/user/staff/services/staff.service';

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
  rfqData: RfqDetail;
  onBack?: () => void;
}

export default function QuotationForm({ rfqData, onBack }: QuotationFormProps) {
  const router = useRouter();
  const [senderInfo, setSenderInfo] = useState<any>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await StaffService.getProfile();
        if (res) {
          setSenderInfo(res);
        }
      } catch (error) {
        console.error(">>> Lỗi khi tải profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rfqData) {
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
  }, [rfqData]);

  const handleUpdateItem = (index: number, changes: any) => {
    setItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...changes };
      }
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const requestPayload: DraftQuoteCommand = {
        rfqId: rfqData.id,
        note: note,
        items: items.map(i => ({
          productId: i.productId,
          unitPrice: i.unitPrice,
          taxRate: i.taxRate,
        }))
      };
      const response = await QuoteService.createQuote(requestPayload);
      if (response) {
        router.push(`/sales/quotations/${response}`);
      }
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
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
    if (onBack) {
      onBack();
    } else {
      router.push('/sales/quotations');
    }
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleCancel} variant="ghost" size="icon" className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold admin-title uppercase">
              Lập báo giá mới
            </h2>
            {rfqData && <p className="text-xs text-gray-500 mt-1">Từ RFQ: {rfqData.code}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveDraft} disabled={isSubmitting} className="rounded admin-btn-primary h-10 px-6">
            <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "Lưu báo giá"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <CustomerInfoCard customerInfo={{
            id: rfqData.customerId,
            companyName: rfqData.companyName,
            phone: rfqData.phone,
            email: rfqData.email,
            address: rfqData.address,
            taxCode: rfqData.taxCode
          }} />
          <SenderInfoCard senderInfo={senderInfo} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Danh sách sản phẩm</h4>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-28 text-center">Số lượng</th>
                    <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-32 text-right">Tạm tính</th>
                    <th className="px-4 py-3 w-24 text-center">Thuế %</th>
                    <th className="px-4 py-3 w-32 text-right">Tiền thuế</th>
                    <th className="px-6 py-3 w-32 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const q = Number(item.quantity) || 0;
                    const p = Number(item.unitPrice) || 0;
                    const t = Number(item.taxRate) || 0;
                    const subtotal = q * p;
                    const taxAmount = Math.round(subtotal * (t / 100));
                    const lineValue = subtotal + taxAmount;

                    return (
                      <tr key={item.key || index} className="hover:bg-gray-50/30">
                        <td className="px-6 py-4 min-w-[250px]">
                          <div className="flex flex-col gap-0.5">
                            {/* Tên sản phẩm rõ nhất - Font chữ lớn và đậm hơn */}
                            <div className="font-bold text-gray-900 text-base leading-tight">
                              {item.productName}
                            </div>
                            {/* Mã sản phẩm phụ - Font chữ nhỏ, màu nhạt */}
                            <div className="text-xs text-gray-400 font-medium tracking-wide">
                              Mã: {item.productCode}
                            </div>
                          </div>
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
                        <td className="px-4 py-4 text-right font-medium text-gray-800">
                          {subtotal.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-4 py-4">
                          <Input type="number" value={item.taxRate} onChange={(e) => handleUpdateItem(index, { taxRate: parseFloat(e.target.value) || 0 })} onFocus={(e) => setTimeout(() => e.target.select(), 0)} className="h-10 text-sm text-center border-gray-200 shadow-none" />
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-800">
                          {taxAmount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 border-l border-gray-50">{lineValue.toLocaleString('vi-VN')} đ</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                  <tr>
                    <td colSpan={6} className="px-6 py-5 text-right text-gray-500 uppercase text-[10px]">Tổng cộng (sau thuế):</td>
                    <td className="px-6 py-5 text-right text-blue-600 text-xl">{calculateTotal().toLocaleString('vi-VN')} đ</td>
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
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="w-full text-sm border-gray-100 focus:ring-0 resize-none shadow-none bg-gray-50/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
