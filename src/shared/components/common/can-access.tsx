'use client';

import React from 'react';
import { useUser } from '@/shared/hooks/use-user';

interface CanAccessProps {
  roles?: (string | number)[];
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({
  roles = [],
  children,
  fallback = null
}) => {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  if (!user) return <>{fallback}</>;

  const userRole = user.role.toLowerCase();

  // Danh sách các role cần kiểm tra (cũng chuyển về lowercase)
  const targetRoles = roles.map(r => String(r).toLowerCase());

  const hasRole = roles.length === 0 || targetRoles.includes(userRole);

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
