'use client';

import React from 'react';
import { Zap, Layers, ChevronRight, Info, Ban, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { InternalPriceDto } from '../../../../models/product-page-detail';

interface ProductPriceSummaryCardProps {
  price?: InternalPriceDto | null;
  unit?: string;
}

export function ProductPriceSummaryCard({ price, unit = 'cái' }: ProductPriceSummaryCardProps) {
  if (!price) return null;

  return (
    <div className="relative group mb-8">
      {/* Background glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

      <div className="relative bg-white rounded border border-emerald-100/50 shadow-sm overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 px-6 py-4 flex items-center justify-between border-b border-emerald-100/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Giá đang áp dụng</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cập nhật lúc {new Date(price.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Đang hoạt động
            </div>
            <Link 
              href={`/catalog/internal-prices/${price.id}`}
              className="p-2 rounded bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm group/link"
              title="Xem chi tiết bảng giá"
            >
              <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Suggested Price Section */}
            <div className="relative p-6 rounded-lg bg-slate-50/50 border border-slate-100 hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded bg-emerald-100 text-emerald-600">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá bán lẻ đề xuất</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {price.suggestedPriceAmount.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase">
                  {price.suggestedPriceCurrency === 'VND' ? 'đ' : price.suggestedPriceCurrency}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                <Info className="w-3 h-3" />
                Giá tối ưu cho thị trường
              </div>
            </div>

            {/* Floor Price Section */}
            <div className="relative p-6 rounded-lg bg-rose-50/10 border border-rose-100/50 hover:border-rose-200 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded bg-rose-100 text-rose-600">
                  <Ban className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá sàn tối thiểu</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {price.floorPriceAmount.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase">
                  {price.floorPriceCurrency === 'VND' ? 'đ' : price.floorPriceCurrency}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md w-fit">
                <Info className="w-3 h-3" />
                Không bán dưới mức này
              </div>
            </div>
          </div>

          {/* Wholesale Tiers */}
          {price.priceTiers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Bảng giá sỉ bậc thang</h5>
                </div>
                <span className="text-[10px] font-bold text-slate-400 italic">Đơn vị: {unit}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {price.priceTiers.map((tier, idx) => (
                  <div key={idx} className="group/tier flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 group-hover/tier:bg-emerald-500 group-hover/tier:text-white group-hover/tier:border-emerald-500 transition-all">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Số lượng ≥</p>
                        <p className="text-sm font-bold text-slate-700">{tier.quantity} {unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Đơn giá sỉ</p>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-base font-bold text-emerald-600">
                          {tier.amount.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">đ</span>
                      </div>
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
}
