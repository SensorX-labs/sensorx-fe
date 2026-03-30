import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { CrmLayoutClient } from './crm-layout-client';

interface CrmLayoutProps {
  children: ReactNode;
}

const CrmLayout = async ({ children }: CrmLayoutProps) => {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar_state');
  // Default to true (expanded) if cookie not set, otherwise read saved state
  const defaultOpen = sidebarCookie ? sidebarCookie.value === 'true' : true;

  return (
    <CrmLayoutClient defaultOpen={defaultOpen}>
      {children}
    </CrmLayoutClient>
  );
};

export default CrmLayout;