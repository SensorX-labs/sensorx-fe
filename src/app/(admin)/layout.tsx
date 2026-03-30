import React from 'react';
import { AdminLayout } from '@/layouts/admin';

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}