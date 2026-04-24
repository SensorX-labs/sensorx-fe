'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { 
  ArrowLeft, 
  Calendar, 
  Ban, 
  Copy, 
  History, 
  Info, 
  AlertCircle,
  ShieldCheck,
  Tag,
  Box
} from 'lucide-react';
import { PriceTierTable } from './price-tier-table';
import { ProductAssignment } from './product-assignment';
import { InternalPrice } from '../../models';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/shadcn-ui/tooltip';

interface InternalPriceDetailProps {
  price: InternalPrice;
  onBack: () => void;
}

export function InternalPriceDetail({ price, onBack }: InternalPriceDetailProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#2B3674]">Chi tiết Bảng giá</h2>
              <Badge variant="outline" className="font-mono text-[#4318FF] border-[#E9EDF7] bg-[#F4F7FE]">
                {price.id}
              </Badge>
            </div>
            <p className="text-[#A3AED0] text-sm flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3" />
              Tạo ngày {new Date(price.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Calendar className="w-4 h-4" />
            Gia hạn
          </Button>
          <Button variant="outline" className="gap-2 border-slate-200">
            <Copy className="w-4 h-4" />
            Nhân bản
          </Button>
          <Button variant="destructive" className="gap-2">
            <Ban className="w-4 h-4" />
            Vô hiệu hóa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 mb-6">
          <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            Thông tin chung
          </TabsTrigger>
          <TabsTrigger value="tiers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            Price Tiers
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            Áp dụng cho sản phẩm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-500" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 p-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sản phẩm chính</label>
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-slate-400" />
                    <p className="font-medium text-slate-900">{price.productName}</p>
                  </div>
                  <p className="text-sm text-slate-500 ml-6">{price.productId}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</label>
                  <div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">
                      Đang hoạt động
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Giá đề xuất</label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <p className="text-lg font-bold text-slate-900">{price.suggestedPrice.toLocaleString()} ₫</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    Giá sàn
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="w-3 h-3 text-slate-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Giá sàn là mức giá thấp nhất được phép bán.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <p className="text-lg font-bold text-rose-600">{price.floorPrice.toLocaleString()} ₫</p>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-medium">✓ Đã kiểm tra: Giá đề xuất ≥ Giá sàn</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày hết hạn</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="font-medium text-slate-900">{new Date(price.expiryDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-indigo-900 text-indigo-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <History className="w-24 h-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ghi chú & Quy tắc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                  <p className="font-medium mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Quy tắc Price Tier
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-indigo-200">
                    <li>Giá phải thấp hơn giá đề xuất</li>
                    <li>Giá phải lớn hơn hoặc bằng giá sàn</li>
                    <li>Số lượng tối thiểu là 2</li>
                    <li>Giá giảm dần khi số lượng tăng</li>
                  </ul>
                </div>
                <p className="text-indigo-300 italic text-xs">
                  * Bảng giá này được thiết kế để áp dụng cho các đại lý cấp 1 tại khu vực miền Bắc.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Danh sách phân tầng giá (Price Tiers)</CardTitle>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Dữ liệu read-only. Để thay đổi vui lòng dùng chức năng "Nhân bản".
              </div>
            </CardHeader>
            <CardContent>
              <PriceTierTable tiers={price.priceTiers} />
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                  <h4 className="font-semibold text-slate-700 text-sm mb-2">Phân tích hiệu quả</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Chiết khấu tối đa:</span>
                      <span className="font-bold text-emerald-600">
                        {((1 - Math.min(...price.priceTiers.map(t => t.price)) / price.suggestedPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Lợi nhuận gộp ước tính:</span>
                      <span className="font-bold text-slate-700">~15.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sản phẩm áp dụng bảng giá</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductAssignment />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
