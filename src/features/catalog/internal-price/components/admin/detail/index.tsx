'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { Button } from '@/shared/components/shadcn-ui/button';
import InternalPriceService from '../../../services/internal-price-services';
import { InternalPriceDetail as InternalPriceDetailModel } from '../../../models/internal-price-detail';
import { InternalPrice } from '../../../models';
import { ExtendPriceDialog } from './internal-price-extend-dialog';
import { DeactivatePriceDialog } from './internal-price-deactivate-dialog';
import { DetailHeader } from './internal-price-detail-header';
import { InfoTabContent } from './internal-price-info-tab';
import { PricingTiersTabContent } from './internal-price-pricing-tiers-tab';

interface InternalPriceDetailProps {
  internalPriceId: string;
}

export function InternalPriceDetail({ internalPriceId }: InternalPriceDetailProps) {
  const router = useRouter();
  const [price, setPrice] = useState<InternalPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await InternalPriceService.getById(internalPriceId);
      setPrice(mapDetailToPrice(detail));
    } catch (err: any) {
      setError(err?.message ?? 'Không thể tải chi tiết bảng giá.');
    } finally {
      setIsLoading(false);
    }
  }, [internalPriceId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = () => {
    router.push('/catalog/internal-prices');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Đang tải chi tiết bảng giá...</p>
      </div>
    );
  }

  if (error || !price) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
        <p className="text-sm font-medium text-slate-600">{error ?? 'Không tìm thấy bảng giá.'}</p>
        <Button variant="outline" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1200">
      <DetailHeader
        price={price}
        onBack={handleBack}
        onExtend={() => setIsExtendOpen(true)}
        onDeactivate={() => setIsDeactivateOpen(true)}
      />

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

      <ExtendPriceDialog
        price={price}
        open={isExtendOpen}
        onOpenChange={setIsExtendOpen}
        onSuccess={() => {
          setIsExtendOpen(false);
          fetchDetail();
        }}
      />

      <DeactivatePriceDialog
        price={price}
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        onSuccess={() => {
          setIsDeactivateOpen(false);
          fetchDetail();
        }}
      />
    </div>
  );
}

function mapDetailToPrice(detail: InternalPriceDetailModel): InternalPrice {
  return {
    id: detail.id ?? '',
    productId: detail.productId,
    productName: detail.productName ?? detail.productId,
    productCode: detail.productCode ?? '',
    suggestedPrice: detail.suggestedPriceAmount,
    suggestedPriceCurrency: detail.suggestedPriceCurrency,
    floorPrice: detail.floorPriceAmount,
    floorPriceCurrency: detail.floorPriceCurrency,
    status: detail.status ?? 'Active',
    createdAt: detail.createdAt,
    expiresAt: detail.expiresAt ?? '',
    priceTiers: detail.priceTiers ?? [],
  };
}