'use client';

import React, { useState } from 'react';

import { InternalPrice } from '../../models';
import { InternalPriceDetail } from './internal-price-detail';
import { InternalPriceList } from './internal-price-list';
import { InternalPriceForm } from './internal-price-form';

export function InternalPriceManagement() {
  const [selectedPrice, setSelectedPrice] = useState<InternalPrice | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');

  const handleViewDetail = (price: InternalPrice) => {
    setSelectedPrice(price);
    setView('detail');
  };

  const handleCreate = () => {
    setSelectedPrice(null);
    setView('create');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPrice(null);
  };

  return (
    <div className="w-full max-h-[calc(100vh-300px)]">
      {view === 'list' && (
        <InternalPriceList
          onViewDetail={handleViewDetail}
          onCreate={handleCreate}
        />
      )}

      {view === 'detail' && selectedPrice && (
        <InternalPriceDetail
          price={selectedPrice}
          onBack={handleBackToList}
        />
      )}

      {view === 'create' && (
        <InternalPriceForm
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}
