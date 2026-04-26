'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Layers, ShieldAlert, Percent, TrendingDown } from 'lucide-react';
import { PriceTierTable } from '../common/price-tier-table';
import { InternalPrice } from '../../../models';
import { MetricCard } from './internal-price-metric-card';

interface PricingTiersTabContentProps {
  price: InternalPrice;
}

export function PricingTiersTabContent({ price }: PricingTiersTabContentProps) {
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
