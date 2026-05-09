'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { InternalPrice } from '../../models';
import { InternalPriceList } from './list/internal-price-list';
import { InternalPriceForm } from './form/internal-price-form';

export function InternalPriceManagement() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'create'>('list');

  const handleViewDetail = (price: InternalPrice) => {
    router.push(`/catalog/internal-prices/${price.id}`);
  };

  const handleCreate = () => {
    setView('create');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <div className="w-full">
      {view === 'list' && (
        <InternalPriceList
          onViewDetail={handleViewDetail}
          onCreate={handleCreate}
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
