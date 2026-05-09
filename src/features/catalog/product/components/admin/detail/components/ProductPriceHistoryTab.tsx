'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Layers, Zap, History, Clock, Calendar, ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { InternalPrice } from '@/features/catalog/internal-price/models';
import InternalPriceService from '@/features/catalog/internal-price/services/internal-price-services';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

interface ProductPriceHistoryTabProps {
  productId: string;
  currentPriceId?: string;
  unit?: string;
}

export function ProductPriceHistoryTab({ productId, currentPriceId, unit = 'cái' }: ProductPriceHistoryTabProps) {
  const [prices, setPrices] = useState<InternalPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const historyRes = await InternalPriceService.getHistory(productId);
        if (historyRes) {
          setPrices(historyRes.internalPrices);
        }
      } catch (error) {
        console.error(">>> Error fetching price history:", error);
        toast.error("Không thể tải lịch sử giá");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-5">
        <div className="relative flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full">
          <div className="w-8 h-8 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Đang truy xuất dữ liệu</p>
          <p className="text-[11px] font-medium text-slate-400">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    );
  }

  if (!prices || prices.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <div className="w-20 h-20 rounded bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
          <History className="w-8 h-8 text-slate-300" />
        </div>
        <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Trống</h5>
        <p className="text-xs text-slate-400">Sản phẩm này chưa có lịch sử biến động giá</p>
      </div>
    );
  }

  return (
    <div className="relative py-4 pr-4">
      {/* Vertical Baseline - Tính toán vị trí chính giữa icon bằng Flex alignment */}
      <div className="absolute left-[39px] top-12 bottom-12 w-px bg-slate-200"></div>

      <div className="space-y-8">
        {prices.map((price, index) => {
          const isCurrent = price.id === currentPriceId;
          const date = new Date(price.createdAt);

          return (
            <div
              key={price.id}
              className="relative flex items-start gap-6 animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Icon */}
              <div className="relative z-10 flex-shrink-0 w-20 flex justify-center mt-5">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-[3px] border-white transition-all duration-300
                  ${isCurrent ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}
                `}>
                  {isCurrent ? <Zap className="w-4 h-4 fill-white" /> : <Clock className="w-4 h-4" />}
                </div>
              </div>

              {/* Card Content */}
              <div className={`
                flex-1 rounded border transition-all duration-300 overflow-hidden group
                ${isCurrent
                  ? 'bg-white border-emerald-500/30 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-50'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/40'}
              `}>

                {/* Header Strip (optional visual accent) */}
                {isCurrent && <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>}

                <div className="p-6">
                  {/* Top Header: Title & Date */}
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className={`text-base font-bold tracking-tight ${isCurrent ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {isCurrent ? 'Bảng Giá Hiện Hành' : `Phiên Bản #${prices.length - index}`}
                        </h5>
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </span>
                          )}
                          <Link 
                            href={`/catalog/internal-prices/${price.id}`}
                            className="p-1 rounded bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                            title="Chi tiết bảng giá"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {format(date, 'dd MMMM, yyyy', { locale: vi })}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {format(date, 'HH:mm')}
                        </div>
                      </div>
                    </div>

                    {/* Price Highlights */}
                    <div className="flex items-center gap-8 bg-slate-50 rounded p-4 border border-slate-100/50">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Giá Sàn</p>
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-lg font-semibold text-slate-600">
                            {price.floorPrice.toLocaleString('vi-VN')}
                          </span>
                          <span className="text-xs font-medium text-slate-400 underline decoration-slate-300 underline-offset-2">đ</span>
                        </div>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Giá Bán Lẻ</p>
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className={`text-2xl font-bold tracking-tight ${isCurrent ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {price.suggestedPrice.toLocaleString('vi-VN')}
                          </span>
                          <span className={`text-xs font-bold underline underline-offset-2 ${isCurrent ? 'text-emerald-500 decoration-emerald-200' : 'text-slate-400 decoration-slate-300'}`}>đ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tiers / Bậc Giá Sỉ */}
                  {price.priceTiers.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cấu hình bậc giá sỉ</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {price.priceTiers.map((tier, tIdx) => (
                          <div
                            key={tIdx}
                            className={`
                              flex flex-col p-3 rounded border transition-all
                              ${isCurrent ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-200'}
                            `}
                          >
                            <span className="text-[11px] font-semibold text-slate-500 mb-1">
                              Từ {tier.quantity} {unit}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className={`w-3 h-3 ${isCurrent ? 'text-emerald-500' : 'text-slate-400'}`} />
                              <span className={`text-sm font-bold ${isCurrent ? 'text-emerald-700' : 'text-slate-700'}`}>
                                {tier.price.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}