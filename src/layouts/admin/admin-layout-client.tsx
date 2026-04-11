'use client';

import React, {ReactNode} from 'react';
import CrmSidebar from './admin-sidebar';
import CrmHeader from './admin-header';
import CrmFooter from './admin-footer';
import {SidebarProvider, SidebarInset} from '@/shared/components/shadcn-ui/sidebar';

interface AdminLayoutClientProps {
    children: ReactNode;
    defaultOpen: boolean;
}

export const AdminLayoutClient = ({children, defaultOpen} : AdminLayoutClientProps) => {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <CrmSidebar/>

            <SidebarInset className="flex min-h-screen flex-1 min-w-0 flex-col bg-[var(--admin-background)]">
                <CrmHeader/>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children} </main>

                <CrmFooter/>
            </SidebarInset>
        </SidebarProvider>
    );
};
