'use client';

import React, { useState } from 'react';

import { InternalPrice } from '../../models';
import { InternalPriceDetail } from './internal-price-detail';
import { InternalPriceList } from './internal-price-list';

export function InternalPriceManagement() {
  const [selectedPrice, setSelectedPrice] = useState<InternalPrice | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const handleViewDetail = (price: InternalPrice) => {
    setSelectedPrice(price);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPrice(null);
  };

  return (
    <div>
      {view === 'list' ? (
        <InternalPriceList onViewDetail={handleViewDetail} />
      ) : (
        selectedPrice && (
          <InternalPriceDetail
            price={selectedPrice}
            onBack={handleBackToList}
          />
        )
      )}
    </div>
  );
}
