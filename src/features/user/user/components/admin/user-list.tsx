'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Loader2,
  Lock,
  LockOpen,
  Mail,
  Search,
  Shield,
  ShieldAlert,
  UserPlus,
  Warehouse as WarehouseIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AuthService,
  UserPageListQuery,
  UserStatsResponse,
} from '@/features/system/auth/services/auth-service';
import { RolesService } from '@/features/system/auth/services/roles-service';
import { UserResponse } from '@/features/system/auth/models/user-response';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse as WarehouseModel } from '@/features/warehouse/models/warehouse-model';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { AdminContentCard, AdminPageContainer } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Label } from '@/shared/components/shadcn-ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn-ui/select';

const authService = new AuthService();
const rolesService = new RolesService();

const DEFAULT_FILTERS = {
  email: '',
  fullName: '',
  warehouseId: 'all',
  createdFrom: '',
  createdTo: '',
};

type UserFilterState = typeof DEFAULT_FILTERS;
type UserFilterKey = keyof UserFilterState;
type UserStatFilter = 'ALL' | 'ACTIVE' | 'LOCKED' | 'WAREHOUSE' | 'SALE' | 'MANAGER';

const roleLabels: Record<string, string> = {
  Customer: 'Khách hàng',
  WarehouseStaff: 'Nhân viên kho',
  SaleStaff: 'Nhân viên bán hàng',
  Manager: 'Quản lý',
  Admin: 'Quản trị viên',
};

const roleColor: Record<string, string> = {
  Customer: 'bg-slate-100 text-slate-600',
  WarehouseStaff: 'bg-blue-50 text-blue-600',
  SaleStaff: 'bg-emerald-50 text-emerald-600',
  Manager: 'bg-amber-50 text-amber-600',
  Admin: 'bg-red-50 text-red-600',
};

function extractArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw;
  const candidate = (raw as Record<string, unknown> | null | undefined)?.value;
  return Array.isArray(candidate) ? (candidate as T[]) : [];
}

function getRoleText(role: string) {
  return roleLabels[role] ?? role;
}

function getStatQuery(statFilter: UserStatFilter) {
  switch (statFilter) {
    case 'ACTIVE':
      return { isLocked: false };
    case 'LOCKED':
      return { isLocked: true };
    case 'WAREHOUSE':
      return { role: 'WarehouseStaff' };
    case 'SALE':
      return { role: 'SaleStaff' };
    case 'MANAGER':
      return { role: 'Manager' };
    default:
      return {};
  }
}

function buildUserQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  filters: UserFilterState,
  statFilter: UserStatFilter
): UserPageListQuery {
  const statQuery = getStatQuery(statFilter);

  return {
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    email: filters.email.trim() || undefined,
    fullName: filters.fullName.trim() || undefined,
    warehouseId: filters.warehouseId !== 'all' ? filters.warehouseId : undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
    role: statQuery.role,
    isLocked: statQuery.isLocked,
  };
}

function UserStats({
  stats,
  statFilter,
  onFilter,
}: {
  stats: UserStatsResponse | null;
  statFilter: UserStatFilter;
  onFilter: (value: UserStatFilter) => void;
}) {
  const items = useMemo(
    () => [
      {
        key: 'all',
        label: 'Tổng tài khoản',
        value: stats?.totalCount ?? 0,
        colorTheme: 'dark' as const,
        isActive: statFilter === 'ALL',
        onClick: () => onFilter('ALL'),
      },
      {
        key: 'active',
        label: 'Đang hoạt động',
        value: stats?.activeCount ?? 0,
        colorTheme: 'green' as const,
        isActive: statFilter === 'ACTIVE',
        onClick: () => onFilter('ACTIVE'),
      },
      {
        key: 'locked',
        label: 'Đã khóa',
        value: stats?.lockedCount ?? 0,
        colorTheme: 'red' as const,
        isActive: statFilter === 'LOCKED',
        onClick: () => onFilter('LOCKED'),
      },
      {
        key: 'warehouse',
        label: 'Nhân viên kho',
        value: stats?.warehouseStaffCount ?? 0,
        colorTheme: 'blue' as const,
        isActive: statFilter === 'WAREHOUSE',
        onClick: () => onFilter('WAREHOUSE'),
      },
      {
        key: 'sale',
        label: 'Nhân viên bán hàng',
        value: stats?.saleStaffCount ?? 0,
        colorTheme: 'emerald' as const,
        isActive: statFilter === 'SALE',
        onClick: () => onFilter('SALE'),
      },
      {
        key: 'manager',
        label: 'Quản lý',
        value: stats?.managerCount ?? 0,
        colorTheme: 'yellow' as const,
        isActive: statFilter === 'MANAGER',
        onClick: () => onFilter('MANAGER'),
      },
    ],
    [stats, statFilter, onFilter]
  );

  return <StatGroup items={items} variant="pill" />;
}

function UserTable({
  users,
  loading,
  warehouses,
  roles,
  onRoleSelectChange,
  onToggleLock,
}: {
  users: UserResponse[];
  loading: boolean;
  warehouses: WarehouseModel[];
  roles: Array<{ id: number; name: string }>;
  onRoleSelectChange: (userId: string, roleValue: string) => void;
  onToggleLock: (userId: string) => void;
}) {
  const warehouseMap = new Map(
    warehouses
      .filter(warehouse => warehouse.id)
      .map(warehouse => [warehouse.id as string, warehouse.name])
  );

  const getRoleNumber = (roleName: string) => {
    const found = roles.find(role => role.name === roleName);
    return found ? String(found.id) : roleName;
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[1100px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tài khoản
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Họ tên
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Vai trò
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Kho bãi
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tạo lúc
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                Không tìm thấy tài khoản nào
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id} className="hover:bg-emerald-50/30">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{user.email}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {user.fullName || 'Chưa cập nhật'}
                </td>

                <td className="px-6 py-4">
                  {user.role === 'Admin' || user.role === 'Customer' ? (
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleColor[user.role] ?? 'bg-slate-100 text-slate-600'}`}>
                      {getRoleText(user.role)}
                    </span>
                  ) : (
                    <Select
                      value={getRoleNumber(user.role)}
                      onValueChange={value => onRoleSelectChange(user.id, value)}
                    >
                      <SelectTrigger className="h-9 w-44 rounded-md border-slate-200 bg-white text-xs">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter(role => role.name !== 'Customer' && role.name !== 'Admin')
                          .map(role => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {getRoleText(role.name)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>

                <td className="px-6 py-4">
                  {user.isLocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Đã khóa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Shield className="h-3.5 w-3.5" />
                      Hoạt động
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-slate-500">
                  {user.warehouseId ? warehouseMap.get(user.warehouseId) ?? user.warehouseId : '--'}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleLock(user.id)}
                    title={user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${user.isLocked
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                  >
                    {user.isLocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function UserList() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([]);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statFilter, setStatFilter] = useState<UserStatFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 1,
    warehouseId: '',
  });
  const [assignRoleDialog, setAssignRoleDialog] = useState<{
    isOpen: boolean;
    userId: string;
    targetRole: number;
  } | null>(null);
  const [selectedAssignWarehouseId, setSelectedAssignWarehouseId] = useState('');

  const pageSize = 10;

  const filterFields = useMemo<Array<FilterFieldConfig & { id: UserFilterKey }>>(
    () => [
      {
        id: 'email',
        label: 'Email',
        type: 'search',
        placeholder: 'Nhập email tài khoản',
        className: 'md:col-span-2 xl:col-span-2',
      },
      {
        id: 'fullName',
        label: 'Họ tên',
        type: 'search',
        placeholder: 'Nhập họ tên người dùng',
        className: 'md:col-span-2 xl:col-span-2',
      },
      {
        id: 'warehouseId',
        label: 'Kho bãi',
        type: 'select',
        options: [
          { label: 'Tất cả kho bãi', value: 'all' },
          ...warehouses
            .filter(warehouse => warehouse.id)
            .map(warehouse => ({
              label: warehouse.name,
              value: warehouse.id as string,
            })),
        ],
      },
      {
        id: 'createdFrom',
        label: 'Từ ngày',
        type: 'date',
      },
      {
        id: 'createdTo',
        label: 'Đến ngày',
        type: 'date',
      },
    ],
    [warehouses]
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    const loadSupportingData = async () => {
      try {
        const [rolesResult, warehousesResult] = await Promise.all([
          rolesService.getRoles(),
          getWarehouses(),
        ]);

        setRoles(extractArray<{ id: number; name: string }>(rolesResult));
        setWarehouses(warehousesResult);
      } catch (error) {
        console.error('Failed to load account supporting data', error);
      }
    };

    void loadSupportingData();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);

      try {
        const response = await authService.getPagedUsers(
          buildUserQuery(currentPage, pageSize, searchTerm, filters, statFilter)
        );

        setUsers(response.items ?? []);
        setTotalItems(response.totalCount ?? 0);
      } catch (error) {
        console.error('Failed to load users', error);
        setUsers([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [currentPage, searchTerm, filters, statFilter, refreshKey]);

  useEffect(() => {
    authService
      .getUserStats()
      .then(setStats)
      .catch(error => console.error('Failed to load user stats', error));
  }, [refreshKey]);

  const activeFilterChips = useMemo(
    () =>
      filterFields
        .map(field => {
          const value = filters[field.id];
          if (!value || value === 'all') {
            return null;
          }

          if (field.type === 'select') {
            const option = field.options.find(item => item.value === value);
            return {
              id: field.id,
              label: `${field.label}: ${option?.label ?? value}`,
            };
          }

          if (field.type === 'date') {
            return {
              id: field.id,
              label: `${field.label}: ${new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')}`,
            };
          }

          return {
            id: field.id,
            label: `${field.label}: ${value}`,
          };
        })
        .filter(Boolean) as Array<{ id: UserFilterKey; label: string }>,
    [filterFields, filters]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (fieldId: UserFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleClearAppliedFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDraftFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (fieldId: UserFilterKey) => {
    setFilters(current => ({
      ...current,
      [fieldId]: fieldId === 'warehouseId' ? 'all' : '',
    }));
    setDraftFilters(current => ({
      ...current,
      [fieldId]: fieldId === 'warehouseId' ? 'all' : '',
    }));
    setCurrentPage(1);
  };

  const onRoleSelectChange = (userId: string, roleValue: string) => {
    const roleNum = Number.parseInt(roleValue, 10);
    const isWarehouseRole =
      roleNum === 1 || roles.find(role => role.id === roleNum)?.name === 'WarehouseStaff';

    if (isWarehouseRole) {
      setAssignRoleDialog({ isOpen: true, userId, targetRole: roleNum });
      setSelectedAssignWarehouseId('');
      return;
    }

    void handleRoleChange(userId, roleNum);
  };

  const handleRoleChange = async (
    userId: string,
    roleNum: number,
    warehouseId?: string
  ) => {
    try {
      await rolesService.assignRole(userId, roleNum, warehouseId);
      setRefreshKey(current => current + 1);
      setAssignRoleDialog(null);
    } catch {
      toast.error('Cập nhật vai trò thất bại');
    }
  };

  const handleToggleLock = async (userId: string) => {
    try {
      await authService.toggleUserLock(userId);
      setRefreshKey(current => current + 1);
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const isWarehouseRole =
      form.role === 1 || roles.find(role => role.id === form.role)?.name === 'WarehouseStaff';

    if (isWarehouseRole && !form.warehouseId) {
      toast.error('Vui lòng chọn kho bãi cho nhân viên kho');
      return;
    }

    setCreating(true);

    try {
      await authService.createStaffAccount({
        email: form.email,
        password: form.password,
        role: form.role,
        warehouseId: isWarehouseRole ? form.warehouseId : undefined,
      });

      setDialogOpen(false);
      setForm({ email: '', password: '', role: 1, warehouseId: '' });
      setRefreshKey(current => current + 1);
    } catch {
      toast.error('Tạo tài khoản thất bại');
    } finally {
      setCreating(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AdminPageContainer>
      <UserStats
        stats={stats}
        statFilter={statFilter}
        onFilter={value => {
          setStatFilter(value);
          setCurrentPage(1);
        }}
      />

      <AdminContentCard className="overflow-hidden">
        <div className="space-y-4 border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm nhanh theo email hoặc họ tên..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <div className="flex items-center gap-3 xl:shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-[140px] justify-center rounded-md border-slate-200 bg-white px-4"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
              </Button>

              <Button
                onClick={() => setDialogOpen(true)}
                className="h-11 rounded-md bg-emerald-600 px-4 text-white hover:bg-emerald-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Tạo tài khoản
              </Button>
            </div>
          </div>

          {activeFilterChips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilterChips.map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleRemoveFilter(chip.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span>{chip.label}</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <UserTable
          users={users}
          loading={loading}
          warehouses={warehouses}
          roles={roles}
          onRoleSelectChange={onRoleSelectChange}
          onToggleLock={handleToggleLock}
        />

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(960px,calc(100vw-2rem))] max-w-none sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Bộ lọc tài khoản</DialogTitle>
            <DialogDescription className="sr-only">
              Bộ lọc danh sách tài khoản theo email, họ tên, kho bãi và ngày tạo.
            </DialogDescription>
          </DialogHeader>

          <FilterPanel
            title="Bộ lọc"
            fields={filterFields}
            values={draftFilters}
            onChange={(fieldId, value) =>
              handleDraftFilterChange(fieldId as UserFilterKey, value)
            }
            onReset={handleResetFilters}
            hideHeader
            gridClassName="md:grid-cols-2 xl:grid-cols-3"
            className="border-0 bg-transparent p-0 shadow-none"
          />

          <DialogFooter className="gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFilterOpen(false)}>
              Đóng
            </Button>
            <Button type="button" variant="outline" onClick={handleResetFilters}>
              Xóa bộ lọc
            </Button>
            <Button
              type="button"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={handleApplyFilters}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản nhân viên</DialogTitle>
            <DialogDescription className="sr-only">
              Form tạo mới tài khoản nhân viên và gán vai trò.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@company.com"
                value={form.email}
                onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                className="rounded-md border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
                className="rounded-md border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phân quyền</Label>
              <Select
                value={String(form.role)}
                onValueChange={value =>
                  setForm(current => ({ ...current, role: Number(value) }))
                }
              >
                <SelectTrigger className="h-10 rounded-md border-slate-200">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles
                    .filter(role => role.name !== 'Customer' && role.name !== 'Admin')
                    .map(role => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {getRoleText(role.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {(form.role === 1 || roles.find(role => role.id === form.role)?.name === 'WarehouseStaff') && (
              <div className="space-y-2">
                <Label>Kho bãi</Label>
                <Select
                  value={form.warehouseId}
                  onValueChange={value =>
                    setForm(current => ({ ...current, warehouseId: value }))
                  }
                >
                  <SelectTrigger className="h-10 rounded-md border-slate-200">
                    <SelectValue placeholder="Chọn kho được phân công" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id!}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Xác nhận tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!assignRoleDialog?.isOpen}
        onOpenChange={open => {
          if (!open) {
            setAssignRoleDialog(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉ định kho trực thuộc</DialogTitle>
            <DialogDescription className="sr-only">
              Chọn kho bãi cho tài khoản được gán vai trò nhân viên kho.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <p className="text-xs text-slate-500">
              Vai trò Nhân viên kho bắt buộc phải được chỉ định một kho cụ thể.
            </p>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <WarehouseIcon className="h-4 w-4 text-emerald-600" />
                Chọn kho bãi
              </Label>
              <Select
                value={selectedAssignWarehouseId}
                onValueChange={setSelectedAssignWarehouseId}
              >
                <SelectTrigger className="h-10 rounded-md border-slate-200">
                  <SelectValue placeholder="Chọn kho được phân công" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id!}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setAssignRoleDialog(null)}>
              Hủy bỏ
            </Button>
            <Button
              type="button"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => {
                if (!selectedAssignWarehouseId) {
                  toast.error('Vui lòng chọn kho bãi');
                  return;
                }

                if (assignRoleDialog) {
                  void handleRoleChange(
                    assignRoleDialog.userId,
                    assignRoleDialog.targetRole,
                    selectedAssignWarehouseId
                  );
                }
              }}
            >
              Xác nhận gán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}
