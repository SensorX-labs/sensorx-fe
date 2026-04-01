import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AdminLayoutClient } from './admin-layout-client';

interface CrmLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: CrmLayoutProps) => {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar_state');
  const defaultOpen = sidebarCookie ? sidebarCookie.value === 'true' : true;

  return (
    <AdminLayoutClient defaultOpen={defaultOpen}>
      {children}
    </AdminLayoutClient>
  );
};

export default AdminLayout;