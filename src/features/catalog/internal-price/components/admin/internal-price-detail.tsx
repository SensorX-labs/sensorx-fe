'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import {
  ArrowLeft,
  Calendar,
  Ban,
  Copy,
  AlertCircle,
  ShieldCheck,
  Tag,
  Box,
  BookOpen,
  Layers,
  Lock,
  Percent,
  TrendingUp,
  Info,
  Package,
  ArrowDownUp,
  Wallet,
  ShieldAlert,
  TrendingDown
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/shadcn-ui/tooltip';
import { PriceTierTable } from './price-tier-table';
import { InternalPrice } from '../../models';

interface InternalPriceDetailProps {
  price: InternalPrice;
  onBack: () => void;
}

export function InternalPriceDetail({ price, onBack }: InternalPriceDetailProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1200">
      <DetailHeader price={price} onBack={onBack} />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 mb-6">
          <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            Thông tin chung
          </TabsTrigger>
          <TabsTrigger value="tiers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            Bảng giá
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <InfoTabContent price={price} />
        </TabsContent>

        <TabsContent value="tiers" className="animate-in fade-in-50 duration-500">
          <PricingTiersTabContent price={price} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Sub-components ---

function DetailHeader({ price, onBack }: InternalPriceDetailProps) {
  return (
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
  );
}

function InfoTabContent({ price }: { price: InternalPrice }) {
  return (
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
              <p className="text-lg font-bold text-slate-900">{price.suggestedPrice.toLocaleString() + " " + price.suggestedPriceCurrency}</p>
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
              <p className="text-lg font-bold text-rose-600">{price.floorPrice.toLocaleString() + " " + price.floorPriceCurrency}</p>
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">✓ Đã kiểm tra: Giá đề xuất ≥ Giá sàn</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày hết hạn</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="font-medium text-slate-900">{new Date(price.expiresAt).toLocaleDateString('vi-VN')}</p>
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

export function PricingTiersTabContent({ price }: { price: InternalPrice }) {
  const hasTiers = price.priceTiers && price.priceTiers.length > 0;

  // 1. Chiết khấu kịch sàn
  const floorDiscountPercent = (((price.suggestedPrice - price.floorPrice) / price.suggestedPrice) * 100);

  // 2. Max Chiết khấu theo Bảng phân tầng
  const minTierPrice = hasTiers ? Math.min(...price.priceTiers.map(t => t.price)) : price.suggestedPrice;
  const maxTierDiscountPercent = hasTiers
    ? (((price.suggestedPrice - minTierPrice) / price.suggestedPrice) * 100)
    : 0;

  // 3. Biên độ chiết khấu đề xuất cho mỗi lần thương lượng
  const suggestedStepPercent = (floorDiscountPercent / (price.priceTiers.length + 2)).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">

      {/* Khối Thống kê Phân tích */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Layers}
          label="Tổng số phân tầng"
          value={price.priceTiers?.length || 0}
          unit="bậc"
          colorClass="bg-blue-50 text-blue-600"
          tooltip="Số lượng các mốc đơn giá được cấu hình sẵn dựa trên số lượng mua của khách hàng."
        />

        <MetricCard
          icon={ShieldAlert}
          label="Chiết khấu kịch sàn"
          value={floorDiscountPercent.toFixed(1)}
          unit="%"
          colorClass="bg-rose-50 text-rose-600"
          tooltip={`Biên độ tối đa từ Giá đề xuất xuống Giá sàn. Nếu Sales chốt deal vượt quá mốc ${floorDiscountPercent.toFixed(1)}% này sẽ cần Quản lý phê duyệt.`}
        />

        <MetricCard
          icon={Percent}
          label="Chiết khấu bảng giá"
          value={maxTierDiscountPercent.toFixed(1)}
          unit="%"
          colorClass="bg-emerald-50 text-emerald-600"
          tooltip="Mức chiết khấu cao nhất khách hàng có thể tự động đạt được nếu mua chạm mốc số lượng lớn nhất trong bảng phân tầng."
        />

        <MetricCard
          icon={TrendingDown}
          label="Bước giảm thương lượng"
          value={`~${suggestedStepPercent}`}
          unit="% / lần"
          colorClass="bg-indigo-50 text-indigo-600"
          tooltip="Biên độ chiết khấu đề xuất cho mỗi vòng đàm phán. Hệ thống gợi ý cắt giảm từ từ để Sales không bị chạm Giá sàn quá nhanh."
        />
      </div>

      {/* Khối Bảng dữ liệu */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-white border-none pt-6 pb-0 px-6">
          <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
            Chi tiết bảng giá theo số lượng
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Bảng phân bổ đơn giá áp dụng theo từng mốc số lượng mua của khách hàng.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pt-4">
            <PriceTierTable tiers={price.priceTiers} />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
function MetricCard({ icon: Icon, label, value, unit, colorClass, tooltip }: any) {
  const content = (
    <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-4 w-full h-full">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black ${colorClass.split(' ')[1]}`}>{value}</span>
          <span className={`text-sm font-bold ${colorClass.split(' ')[1]}`}>{unit}</span>
        </div>
      </div>
    </div>
  );

  if (!tooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help h-full">{content}</div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-white border-slate-800">
          <p className="text-xs font-medium">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
