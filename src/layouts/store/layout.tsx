'use client';

import React, { ReactNode } from 'react';
import StoreHeader from './store-header';
import StoreFooter from './store-footer';
import { InquiryCartPanel } from '@/features/store/Components/shop/inquiry-cart-panel';
import { PaymentHubProvider } from '@/shared/contexts/PaymentHubContext';

interface StoreLayoutProps {
  children: ReactNode;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  return (
  <PaymentHubProvider>
    <div className="flex flex-col min-h-screen bg-white">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <InquiryCartPanel />
    </div>
  </PaymentHubProvider>
  );
};

export default StoreLayout;
