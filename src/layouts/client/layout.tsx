'use client';

import React, { ReactNode } from 'react';
import ClientHeader from './client-header';
import ClientFooter from './client-footer';

interface ClientLayoutProps {
  children: ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <ClientHeader />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <ClientFooter />
    </div>
  );
};

export default ClientLayout;
