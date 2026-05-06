'use client';

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Loader2, Users, Lock, LockOpen, UserPlus, Mail, Key } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '@/features/system/auth/services/auth-service';
import { RolesService } from '@/features/system/auth/services/roles-service';
import { UserResponse } from '@/features/system/auth/models/user-response';
import { RoleItem } from '@/features/system/auth/services/roles-service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/shadcn-ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn-ui/select';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Label } from '@/shared/components/shadcn-ui/label';
import { useUser } from '@/shared/hooks/use-user';

const authService = new AuthService();
const rolesService = new RolesService();

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

function extractArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw;
  const candidate = (raw as Record<string, unknown> | null | undefined)?.value;
  return Array.isArray(candidate) ? (candidate as T[]) : [];
}

export default function UserList() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 1 });

  const fetchUsers = async () => {
    try {
      const result = await authService.getUsers();
      setUsers(extractArray<UserResponse>(result));
    } catch {
      toast.error('Không thể tải danh sách tài khoản');
    }
  };

  const fetchRoles = async () => {
    try {
      const result = await rolesService.getRoles();
      setRoles(extractArray<RoleItem>(result));
    } catch {
      // silently fail – roles dropdown will fallback to local labels
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRoles()]);
      setLoading(false);
    };
    init();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setCreating(true);
    try {
      await authService.createStaffAccount(form);
      toast.success('Tạo tài khoản thành công');
      setDialogOpen(false);
      setForm({ email: '', password: '', role: 1 });
      await fetchUsers();
    } catch {
      toast.error('Tạo tài khoản thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, roleValue: string) => {
    const roleNum = parseInt(roleValue, 10);
    try {
      await rolesService.assignRole(userId, roleNum);
      toast.success('Cập nhật vai trò thành công');
      await fetchUsers();
    } catch {
      toast.error('Cập nhật vai trò thất bại');
    }
  };

  const handleToggleLock = async (userId: string) => {
    try {
      await authService.toggleUserLock(userId);
      toast.success('Cập nhật trạng thái thành công');
      await fetchUsers();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const getRoleNumber = (roleName: string) => {
    const found = roles.find((r) => r.name === roleName);
    return found ? String(found.id) : roleName;
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Users className="w-4 h-4 text-[#4318FF]" />
            <span className="text-sm font-semibold text-[#2B3674]">{users.length} tài khoản</span>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[#4318FF] hover:bg-[#4318FF]/90 text-white"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Tạo tài khoản
          </Button>
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
                <th className="px-6 py-4 text-left font-semibold text-[#2B3674]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2B3674]">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.fullName}</td>
                  <td className="px-6 py-4">
                    {user.role === 'Admin' || user.role === 'Customer' ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${roleColor[user.role]}`}>
                        {roleLabels[user.role] ?? user.role}
                      </span>
                    ) : (
                      <Select
                        value={getRoleNumber(user.role)}
                        onValueChange={(val) => handleRoleChange(user.id, val)}
                      >
                        <SelectTrigger className="h-8 w-40 text-xs border-gray-200">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.length > 0 ? (
                            roles
                              .filter((r) => r.name !== 'Customer' && r.name !== 'Admin')
                              .map((r) => (
                                <SelectItem key={r.id} value={String(r.id)}>
                                  {roleLabels[r.name] ?? r.name}
                                </SelectItem>
                              ))
                          ) : (
                            Object.entries(roleLabels)
                              .filter(([key]) => key !== 'Customer' && key !== 'Admin')
                              .map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleLock(user.id)}
                      title={user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${user.isLocked
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      {user.isLocked ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Không có tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog tạo tài khoản */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2B3674]">Tạo tài khoản nhân viên</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-[#2B3674]">
                <div className="p-1 bg-blue-50 rounded text-blue-600">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border-gray-200 focus:border-[#4318FF] focus:ring-[#4318FF] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-[#2B3674]">
                <div className="p-1 bg-amber-50 rounded text-amber-600">
                  <Key className="w-3.5 h-3.5" />
                </div>
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border-gray-200 focus:border-[#4318FF] focus:ring-[#4318FF] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="col-span-1 flex items-center gap-2 text-sm font-semibold text-[#2B3674] whitespace-nowrap">
                <div className="p-1 bg-purple-50 rounded text-purple-600 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                Phân quyền
              </Label>
              <div className="col-span-3 ml-4">
                <Select
                  value={String(form.role)}
                  onValueChange={(value) => setForm({ ...form, role: Number(value) })}
                >
                  <SelectTrigger className="border-gray-200 focus:ring-[#4318FF] transition-all h-9">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length > 0 ? (
                      roles
                        .filter((r) => r.name !== 'Customer' && r.name !== 'Admin')
                        .map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {roleLabels[r.name] ?? r.name}
                          </SelectItem>
                        ))
                    ) : (
                      Object.entries(roleLabels)
                        .filter(([key]) => key !== 'Customer' && key !== 'Admin')
                        .map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="font-medium text-gray-500 hover:text-gray-700"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-[#4318FF] hover:bg-[#3311CC] text-white px-8 font-bold shadow-lg shadow-[#4318FF]/20 transition-all"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Xác nhận tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
