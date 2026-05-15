'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Eye, Check, X, FileText, UserCheck, AlertCircle, Search, ClipboardList, Clock, CheckCircle2, XCircle, FilePlus2, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/shadcn-ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { useDebounce } from '../../../../../shared/hooks/use-debounce';
import { useUser } from '@/shared/hooks/use-user';
import { RfqStatus } from '../../constants/rfq-status';
import RequestForQuotationDetail from './request-for-quotation-detail';
import { AdminRFQService, RfqListItem, RfqStats } from '../../services/admin-rfq.service';
import { StaffService } from '@/features/user/staff/services/staff-service';
import { StaffListItem } from '@/features/user/staff/models/staff-list-response';
import { CanAccess } from '@/shared/components/common/can-access';
import { StatCard } from '@/shared/components/admin/stat-card/stat-card';

const statusStyles: Record<string, string> = {
  [RfqStatus.DRAFT]: 'bg-gray-50 text-gray-500 border-gray-200',
  [RfqStatus.PENDING]: 'bg-gray-50 text-blue-600 border-blue-100',
  [RfqStatus.ACCEPTED]: 'bg-gray-50 text-indigo-600 border-indigo-100',
  [RfqStatus.REJECTED]: 'bg-gray-50 text-red-500 border-red-100',
  [RfqStatus.CONVERTED]: 'bg-gray-50 text-green-600 border-green-100',
};

const statusLabels: Record<string, string> = {
  [RfqStatus.DRAFT]: 'Nháp',
  [RfqStatus.PENDING]: 'Chờ tiếp nhận',
  [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
  [RfqStatus.REJECTED]: 'Đã từ chối',
  [RfqStatus.CONVERTED]: 'Đã sinh báo giá',
};

const getStatusStyle = (status: string) => {
  const key = Object.values(RfqStatus).find(s => s.toLowerCase() === status?.toLowerCase());
  return key ? statusStyles[key] : 'bg-gray-50 text-gray-400 border-gray-100';
};

const getStatusLabel = (status: string) => {
  const key = Object.values(RfqStatus).find(s => s.toLowerCase() === status?.toLowerCase());
  return key ? statusLabels[key] : status;
};

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState<RfqListItem[]>([]);
  const [statsData, setStatsData] = useState<RfqStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Assign staff states
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [assignLoading, setAssignLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useUser();

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    console.log(">>> Current User Roles:", user?.role);
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsResponse = await AdminRFQService.getStats();
      const listResponse = await AdminRFQService.getListRFQ({
        pageNumber: 1,
        pageSize: 50,
        searchTerm: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter as RfqStatus
      });

      if (listResponse) {
        setLeads(listResponse.items);
      }
      if (statsResponse) {
        setStatsData(statsResponse);
      }
    } catch (error: any) {
      console.error(">>> Lỗi khi fetch dữ liệu:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await StaffService.getPagedStaffs({ pageNumber: 1, pageSize: 100 });
      if (response) {
        setStaffList(response.items);
        const map: Record<string, string> = {};
        response.items.forEach(staff => {
          map[staff.id] = staff.name;
        });
        setStaffMap(map);
      }
    } catch (error) {
      console.error(">>> Lỗi khi fetch danh sách nhân viên:", error);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    if (!viewDetailId) {
      fetchData();
    }
  }, [viewDetailId, debouncedSearch, statusFilter]);

  const handleAccept = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    try {
      const staffResponse = await StaffService.getStaffByAccountId(user.id);
      const staffId = (staffResponse as any).staffId || (staffResponse as any).value?.staffId;

      if (!staffId) {
        toast.error("Không tìm thấy thông tin nhân viên (Staff ID)");
        return;
      }

      await AdminRFQService.assignStaff(id, staffId);
      toast.success("Đã tiếp nhận yêu cầu thành công");
      fetchData();
    } catch (error: any) {
      console.error(">>> Lỗi khi tiếp nhận RFQ:", error);
      toast.error("Đã xảy ra lỗi khi tiếp nhận yêu cầu");
    }
  };

  const handleDecline = async () => {
    if (!selectedRfqId) return;

    try {
      await AdminRFQService.rejectRFQ(selectedRfqId);
      fetchData();
      setIsDeclineDialogOpen(false);
      setSelectedRfqId(null);
      setDeclineReason('');
      toast.success("Đã từ chối yêu cầu");
    } catch (error) {
      console.error(">>> Lỗi khi từ chối RFQ:", error);
    }
  };

  const handleAssignStaff = async (rfqId: string, staffId: string) => {
    if (!rfqId || !staffId) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }

    setAssignLoading(true);
    try {
      await AdminRFQService.assignStaff(rfqId, staffId);
      toast.success("Đã chỉ định nhân viên thành công");
      fetchData();
    } catch (error: any) {
      console.error(">>> Lỗi khi chỉ định nhân viên:", error);
      toast.error("Đã xảy ra lỗi khi chỉ định nhân viên");
    } finally {
      setAssignLoading(false);
    }
  };

  const openDeclineDialog = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRfqId(id);
    setIsDeclineDialogOpen(true);
  };

  const handleCreateQuotation = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setViewDetailId(id);
  };

  if (viewDetailId) {
    return <RequestForQuotationDetail id={viewDetailId} onBack={() => setViewDetailId(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Thống kê sử dụng StatCard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Tổng yêu cầu"
          value={statsData?.total || 0}
          icon={ClipboardList}
          color="bg-blue-50 text-blue-600"
          borderColor="border-blue-100"
          isActive={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        <StatCard
          label="Chờ tiếp nhận"
          value={statsData?.pending || 0}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          borderColor="border-amber-100"
          isActive={statusFilter === RfqStatus.PENDING}
          onClick={() => setStatusFilter(statusFilter === RfqStatus.PENDING ? 'all' : RfqStatus.PENDING)}
        />
        <StatCard
          label="Đã tiếp nhận"
          value={statsData?.accepted || 0}
          icon={CheckCircle2}
          color="bg-indigo-50 text-indigo-600"
          borderColor="border-indigo-100"
          isActive={statusFilter === RfqStatus.ACCEPTED}
          onClick={() => setStatusFilter(statusFilter === RfqStatus.ACCEPTED ? 'all' : RfqStatus.ACCEPTED)}
        />
        <StatCard
          label="Đã sinh báo giá"
          value={statsData?.converted || 0}
          icon={FilePlus2}
          color="bg-emerald-50 text-emerald-600"
          borderColor="border-emerald-100"
          isActive={statusFilter === RfqStatus.CONVERTED}
          onClick={() => setStatusFilter(statusFilter === RfqStatus.CONVERTED ? 'all' : RfqStatus.CONVERTED)}
        />
        <StatCard
          label="Đã từ chối"
          value={statsData?.rejected || 0}
          icon={XCircle}
          color="bg-rose-50 text-rose-600"
          borderColor="border-rose-100"
          isActive={statusFilter === RfqStatus.REJECTED}
          onClick={() => setStatusFilter(statusFilter === RfqStatus.REJECTED ? 'all' : RfqStatus.REJECTED)}
        />
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Tìm mã RFQ, công ty, khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(RfqStatus).map(([key, value]) => (
                <option key={value} value={value}>{statusLabels[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã RFQ</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Khách hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Người xử lý</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 font-medium italic">Đang tải dữ liệu...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 font-medium italic">Không tìm thấy yêu cầu nào</td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  onClick={() => setViewDetailId(l.id)}
                >
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{l.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{l.companyName}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{l.recipientName}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs text-left">
                    {l.staffId ? (
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        {staffMap[l.staffId] || `Nhân viên ${l.staffId.slice(0, 4)}`}
                      </span>
                    ) : <span className="">—</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                      getStatusStyle(l.status)
                    )}>
                      {getStatusLabel(l.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <>
                        <CanAccess roles={['Manager']}>
                          <div className="min-w-[200px]">
                            <Select 
                              value={l.staffId || ""} 
                              onValueChange={(value) => handleAssignStaff(l.id, value)}
                              disabled={assignLoading}
                            >
                              <SelectTrigger className="h-9 text-xs font-semibold border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/70 hover:border-indigo-300 transition-all shadow-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <UserPlus className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                  <SelectValue placeholder="CHỈ ĐỊNH NHÂN VIÊN..." />
                                </div>
                              </SelectTrigger>
                              <SelectContent className="min-w-[220px]">
                                {staffList.map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id} className="text-xs py-2.5">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold text-gray-900">{staff.name}</span>
                                      <span className="text-[10px] text-gray-500 uppercase tracking-tight">{staff.code} • {staff.department || 'Phòng kinh doanh'}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CanAccess>
                        <CanAccess roles={['SaleStaff']}>
                          <Button
                            variant="ghost" size="icon" title="Tiếp nhận" className="h-8 w-8 text-green-600 hover:bg-green-50"
                            onClick={(e) => handleAccept(l.id, e)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </CanAccess>
                        <CanAccess roles={['SaleStaff']}>
                          <Button
                            variant="ghost" size="icon" title="Từ chối" className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={(e) => openDeclineDialog(l.id, e)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </CanAccess>
                      </>

                      {l.status?.toLowerCase() === RfqStatus.ACCEPTED.toLowerCase() && (
                        <CanAccess roles={['SaleStaff']}>
                          <Button
                            variant="ghost" size="icon" title="Lập báo giá" className="h-8 w-8 text-blue-600 hover:bg-blue-50 border border-blue-100 shadow-sm"
                            onClick={(e) => handleCreateQuotation(l.id, e)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </CanAccess>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Từ chối */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-xl gap-0 p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-2 text-gray-900 uppercase tracking-widest text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Từ chối tiếp nhận RFQ
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="tracking-label uppercase block">Lý do từ chối</label>
              <Textarea
                placeholder="Nhập lý do tại đây..."
                className="text-xs min-h-[100px] border-gray-200 focus:border-gray-300 focus:ring-0 shadow-none resize-none px-3 py-2"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsDeclineDialogOpen(false)} className="text-[10px] font-bold uppercase tracking-widest border border-gray-200 bg-white h-9 px-4">Hủy</Button>
            <Button
              onClick={handleDecline}
              className="text-[10px] font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-none h-9 px-4"
              disabled={!declineReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
