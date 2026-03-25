'use client';

import React, { ReactNode } from 'react';
import { StoreLayout } from '@/layouts/store';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreRouteGroupLayout({
  children,
}: StoreLayoutProps) {
  return <StoreLayout>{children}</StoreLayout>;
}
