'use client';

import React from 'react';
import { useUser } from '@/shared/hooks/use-user';

interface CanAccessProps {
  roles?: string[];
  permissions?: string[]; // Để dành cho tương lai nếu dùng permission-based
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

  // Chuyển đổi roles của user về mảng để xử lý thống nhất
  const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
  
  // Kiểm tra nếu người dùng có ít nhất một trong các role yêu cầu
  const hasRole = roles.length === 0 || roles.some(role => 
    userRoles.some(userRole => userRole.toLowerCase() === role.toLowerCase())
  );

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
