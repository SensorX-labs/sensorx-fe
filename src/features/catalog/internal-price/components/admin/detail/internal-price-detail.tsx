'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { InternalPrice } from '../../../models';
import { ExtendPriceDialog } from './internal-price-extend-dialog';
import { DeactivatePriceDialog } from './internal-price-deactivate-dialog';
import { DetailHeader } from './internal-price-detail-header';
import { InfoTabContent } from './internal-price-info-tab';
import { PricingTiersTabContent } from './internal-price-pricing-tiers-tab';

interface InternalPriceDetailProps {
  price: InternalPrice;
  onBack: () => void;
  onRefresh?: () => void;
}

export function InternalPriceDetail({ price, onBack, onRefresh }: InternalPriceDetailProps) {
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1200">
      <DetailHeader
        price={price}
        onBack={onBack}
        onExtend={() => setIsExtendOpen(true)}
        onDeactivate={() => setIsDeactivateOpen(true)}
      />

      <Tabs defaultValue="info" className="w-full">
        {/* ... existing tabs content ... */}
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
          onRefresh?.();
        }}
      />

      <DeactivatePriceDialog
        price={price}
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        onSuccess={() => {
          setIsDeactivateOpen(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}
