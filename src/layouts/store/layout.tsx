'use client';

import React, { ReactNode } from 'react';
import StoreHeader from './store-header';
import StoreFooter from './store-footer';

interface StoreLayoutProps {
  children: ReactNode;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
};

export default StoreLayout;
