'use client';

import StoreLayout from '@/layouts/store/layout';
import React, { ReactNode } from 'react';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreRouteGroupLayout({
  children,
}: StoreLayoutProps) {
  return <StoreLayout>{children}</StoreLayout>;
}
