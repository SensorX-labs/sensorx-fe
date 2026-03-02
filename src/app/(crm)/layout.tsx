import React from 'react';
import { CrmLayout } from '@/layouts/crm';

export default function LayoutCrm({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CrmLayout>{children}</CrmLayout>;
}