'use client';

import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import CrmHeader from './admin-header';
import CrmFooter from './admin-footer';
import { SidebarProvider, SidebarInset } from '@/shared/components/shadcn-ui/sidebar';
import { AdminPageContainer } from './admin-page-container';

const CrmSidebar = dynamic(() => import('./admin-sidebar'), { ssr: false });

interface AdminLayoutClientProps {
    children: ReactNode;
    defaultOpen: boolean;
}

export const AdminLayoutClient = ({ children, defaultOpen }: AdminLayoutClientProps) => {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <CrmSidebar />

            <SidebarInset className="flex min-h-screen flex-1 min-w-0 flex-col bg-[var(--admin-background)]">
                <CrmHeader />

                <AdminPageContainer className="flex-1 md:p-6 lg:p-8">
                    {children}
                </AdminPageContainer>

                <CrmFooter />
            </SidebarInset>
        </SidebarProvider>
    );
};
