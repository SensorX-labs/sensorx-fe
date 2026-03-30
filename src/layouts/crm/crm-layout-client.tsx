'use client';

import React, { ReactNode } from 'react';
import CrmSidebar from './crm-sidebar';
import CrmHeader from './crm-header';
import CrmFooter from './crm-footer';
import {
  SidebarProvider,
  SidebarInset,
} from '@/shared/components/shadcn-ui/sidebar';

interface CrmLayoutClientProps {
  children: ReactNode;
  defaultOpen: boolean;
}

export const CrmLayoutClient = ({ children, defaultOpen }: CrmLayoutClientProps) => {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CrmSidebar />

      <SidebarInset className="flex min-h-screen flex-1 min-w-0 flex-col bg-[#F4F7FE]">
        <CrmHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        <CrmFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};
