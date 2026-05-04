'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import InternalPriceService from '../../../services/internal-price-services';
import { InternalPriceDetail } from '../../../models/internal-price-detail';
import { InternalPrice } from '../../../models';
import { InternalPriceDetailPanel } from '.';

interface InternalPriceDetailViewProps {
  internalPriceId: string;
}

/**
 * Maps InternalPriceDetail (API response shape) to InternalPrice (UI component shape).
 * Fields like productName, productCode, status, expiresAt are not returned by the
 * getById API; we fill with sensible fallbacks until the API is extended.
 */
function mapDetailToPrice(detail: InternalPriceDetail): InternalPrice {
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

export function InternalPriceDetailView({ internalPriceId }: InternalPriceDetailViewProps) {
  const router = useRouter();
  const [price, setPrice] = useState<InternalPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <InternalPriceDetailPanel
      price={price}
      onBack={handleBack}
      onRefresh={fetchDetail}
    />
  );
}
