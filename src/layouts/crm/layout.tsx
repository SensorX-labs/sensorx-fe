import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import CrmSidebar from './crm-sidebar';
import CrmHeader from './crm-header';
import CrmFooter from './crm-footer';
import {
  SidebarProvider,
  SidebarInset
} from '@/shared/components/shadcn-ui/sidebar';

interface CrmLayoutProps {
  children: ReactNode;
}

const CrmLayout = async ({ children }: CrmLayoutProps) => {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar_state');
  // Default to true (expanded) if cookie not set, otherwise read saved state
  const defaultOpen = sidebarCookie ? sidebarCookie.value === 'true' : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Sidebar */}
      <CrmSidebar />

      {/* Main content */}
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

export default CrmLayout;