'use client';

import React from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn-ui/sheet';
import { PriceTierTable } from '../common/price-tier-table';
import { InternalPrice } from '../../../models';

interface QuickViewDrawerProps {
  price: InternalPrice | null;
  onClose: () => void;
  onViewDetail: (price: InternalPrice) => void;
}

export function QuickViewDrawer({ price, onClose, onViewDetail }: QuickViewDrawerProps) {
  if (!price) return null;

  return (
    <Sheet open={!!price} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md border-l-emerald-100 overflow-y-auto p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header with Background Pattern */}
          <div className="relative p-6 bg-slate-50 border-b border-slate-100 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BadgeDollarSign className="w-24 h-24" />
            </div>

            <SheetHeader className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <div className="p-1 bg-emerald-100 rounded">
                  <BadgeDollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quick View</span>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                {price.productName}
              </SheetTitle>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">
                  ID: {price.id}
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                  {price.productCode}
                </span>
              </div>
            </SheetHeader>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* Price Matrix Section */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                Bảng giá cơ sở
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded border border-slate-100 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Giá đề xuất</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-black text-slate-900">{price.suggestedPrice.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">₫</span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded border border-slate-100 shadow-sm">
                  <p className="text-[9px] font-bold text-rose-400 uppercase mb-1">Giá sàn</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-black text-rose-700">{price.floorPrice.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-rose-400 uppercase">₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiers Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                  Phân tầng (Tiers)
                </h4>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                  {price.priceTiers.length} Tiers
                </span>
              </div>
              <div className="scale-95 origin-top-left w-[105.26%]">
                <PriceTierTable tiers={price.priceTiers} compact={true} />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white border-t border-slate-100 mt-auto flex gap-3">
            <Button className="flex-[1.5] h-10 rounded text-xs font-bold admin-btn-primary shadow-lg shadow-emerald-500/20" onClick={() => onViewDetail(price)}>
              Xem chi tiết
            </Button>
            <Button variant="outline" className="flex-1 h-10 rounded text-xs font-bold border-slate-200 text-slate-600 shadow-sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BadgeDollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
