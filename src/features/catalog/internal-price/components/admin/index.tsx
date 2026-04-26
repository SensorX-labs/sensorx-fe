'use client';

import React, { useState } from 'react';

import { InternalPrice } from '../../models';
import { InternalPriceDetail } from './detail/internal-price-detail';
import { InternalPriceList } from './list/internal-price-list';
import { InternalPriceForm } from './form/internal-price-form';

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
    <div className="w-full">
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
          onRefresh={() => {
            // In a real app, we might re-fetch the specific price detail
            // For now, since we're using mocks/local state, we'll just go back to list
            // or we could potentially update the selectedPrice if we had a getById service
            handleBackToList();
          }}
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
