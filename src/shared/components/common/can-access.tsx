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

  // Chuyển đổi roles của user về mảng chuỗi để so sánh dễ hơn
  const userRoles = (Array.isArray(user.roles) ? user.roles : [user.roles]).map(r => String(r).toLowerCase());
  
  // Danh sách các role cần kiểm tra (cũng chuyển về lowercase)
  const targetRoles = roles.map(r => String(r).toLowerCase());

  // DEBUG: Bạn có thể bật dòng này lên để xem role thực tế trong Console F12
  // console.log("User Roles:", userRoles, "Target Roles:", targetRoles);

  // Kiểm tra nếu người dùng có ít nhất một trong các role yêu cầu
  // Hỗ trợ cả kiểm tra theo tên (SaleStaff) hoặc theo số (2)
  const hasRole = roles.length === 0 || targetRoles.some(target => 
    userRoles.includes(target) || 
    // Map thử một số giá trị enum phổ biến nếu cần
    (target === 'salestaff' && userRoles.includes('2')) ||
    (target === 'manager' && userRoles.includes('3')) ||
    (target === 'admin' && userRoles.includes('4'))
  );

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
