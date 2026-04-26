'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/shadcn-ui/tooltip';
import { Info, Box, Tag, AlertCircle, ShieldCheck, Calendar, BookOpen } from 'lucide-react';
import { InternalPrice } from '../../../models';

interface InfoTabContentProps {
  price: InternalPrice;
}

export function InfoTabContent({ price }: InfoTabContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
      <Card className="md:col-span-3 border-none shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 p-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Sản phẩm chính</label>
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-slate-400" />
              <p className="text-sm font-bold text-slate-900">{price.productName}</p>
            </div>
            <p className="text-xs text-slate-500 ml-7">{price.productId}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Trạng thái</label>
            <div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 text-[10px] font-medium">
                Đang hoạt động
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Giá đề xuất</label>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-bold text-slate-900">{price.suggestedPrice.toLocaleString() + " " + price.suggestedPriceCurrency}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              Giá sàn
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Giá sàn là mức giá thấp nhất được phép bán.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <p className="text-lg font-bold text-rose-600">{price.floorPrice.toLocaleString() + " " + price.floorPriceCurrency}</p>
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">✓ Đã kiểm tra: Giá đề xuất ≥ Giá sàn</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Ngày hết hạn</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-bold text-slate-900">{new Date(price.expiresAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-indigo-900 text-indigo-100 overflow-hidden relative">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.07] pointer-events-none">
          <BookOpen className="w-32 h-32" />
        </div>
        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-lg font-bold tracking-tight text-white">Ghi chú & Quy tắc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm relative z-10">
          <div className="p-3.5 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
            <p className="font-semibold mb-2 flex items-center gap-2 text-indigo-50">
              <AlertCircle className="w-4 h-4 text-indigo-300" />
              Quy tắc áp dụng giá
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1.5 text-xs text-indigo-200/90 leading-relaxed">
              <li>
                <strong className="text-indigo-100 font-medium">Giá đề xuất</strong> luôn phải lớn hơn hoặc bằng <strong className="text-rose-300 font-medium">Giá sàn</strong>.
              </li>
              <li>Hệ thống áp dụng chính sách giá theo <strong>phân tầng số lượng (Tiers)</strong>.</li>
              <li>Khối lượng mua càng lớn, đơn giá áp dụng càng thấp.</li>
            </ul>
          </div>
          <p className="text-indigo-300/80 italic text-[11px] leading-tight">
            * Lưu ý: Các chính sách giá có thể được ghi đè bởi các chương trình khuyến mãi (nếu có) đang trong thời gian hiệu lực.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
