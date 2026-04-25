'use client';

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '@/features/system/auth/services/auth-service';
import { UserResponse } from '@/features/system/auth/models/user-response';

const authService = new AuthService();

const roleLabels: Record<string, string> = {
  Customer: 'Khách hàng',
  WarehouseStaff: 'Nhân viên kho',
  SaleStaff: 'Nhân viên bán hàng',
  Manager: 'Quản lý',
  Admin: 'Quản trị viên',
};

const roleColor: Record<string, string> = {
  Customer: 'bg-gray-100 text-gray-600',
  WarehouseStaff: 'bg-blue-100 text-blue-600',
  SaleStaff: 'bg-green-100 text-green-600',
  Manager: 'bg-purple-100 text-purple-600',
  Admin: 'bg-red-100 text-red-600',
};

export default function UserList() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authService.getUsers();
        setUsers(data);
      } catch {
        toast.error('Không thể tải danh sách tài khoản');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B3674]">Quản lý tài khoản</h1>
          <p className="text-sm text-[#A3AED0] mt-1">Danh sách tất cả tài khoản trong hệ thống</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Users className="w-4 h-4 text-[#4318FF]" />
          <span className="text-sm font-semibold text-[#2B3674]">{users.length} tài khoản</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Họ tên</th>
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Vai trò</th>
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Trạng thái</th>
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2B3674]">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.fullName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        roleColor[user.role] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isLocked ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Đã khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Không có tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
