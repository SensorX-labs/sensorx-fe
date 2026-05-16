'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Check, X, FileText, UserCheck, Search, ClipboardList, UserPlus } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { useDebounce } from '../../../../../shared/hooks/use-debounce';
import { useUser } from '@/shared/hooks/use-user';
import { RfqStatus, statusLabels, statusStyles } from '../../constants/rfq-status';
import { useRouter } from 'next/navigation';
import { AdminRFQService, RfqListItem } from '../../services/admin-rfq.service';
import { StaffService } from '@/features/user/staff/services/staff-service';
import { StaffListItem } from '@/features/user/staff/models/staff-list-response';
import { CanAccess } from '@/shared/components/common/can-access';
import { RfqStatsSection } from './rfq-stats';
import { RfqDeclineDialog } from './rfq-decline-dialog';
import { SaleStaffSelectionDialog } from '@/shared/components/admin/selection-modal';

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
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  // Dialog states
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Assign staff states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningRfqId, setAssigningRfqId] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [assignLoading, setAssignLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useUser();

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchData = async () => {
    setLoading(true);
    try {
      const listResponse = await AdminRFQService.getListRFQ({
        pageNumber: 1,
        pageSize: 50,
        searchTerm: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter as RfqStatus
      });

      if (listResponse) {
        setLeads(listResponse.items);
      }

      // Kích hoạt load lại thống kê
      setRefreshKey(prev => prev + 1);
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
    fetchData();
  }, [debouncedSearch, statusFilter]);

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

  const openAssignDialog = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAssigningRfqId(id);
    setIsAssignDialogOpen(true);
  };

  const handleCreateQuotation = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    router.push(`/sales/RFQ/${id}`);
  };

  return (
    <div className="space-y-4">
      <RfqStatsSection
        refreshKey={refreshKey}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

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
                  onClick={() => router.push(`/sales/RFQ/${l.id}`)}
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
                    <div className="flex items-center justify-center gap-2">

                      {/* 1. NẾU RFQ ĐANG Ở TRẠNG THÁI CHỜ XỬ LÝ (PENDING / NEW) */}
                      {/* Lưu ý: Bạn thay RfqStatus.PENDING bằng trạng thái mặc định thực tế của bạn */}
                      {(!l.status || l.status?.toLowerCase() === 'pending') && (
                        <>
                          {/* QUẢN LÝ: Nút phân công (Đã thu gọn UI) */}
                          <CanAccess roles={['Manager']}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer h-8 px-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-sm"
                              onClick={(e) => openAssignDialog(l.id, e)}
                              disabled={assignLoading}
                            >
                              <UserPlus className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                            </Button>
                          </CanAccess>

                          {/* NHÂN VIÊN SALE: Nút tiếp nhận & Từ chối */}
                          <CanAccess roles={['SaleStaff']}>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Tiếp nhận"
                                className="h-8 w-8 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-100"
                                onClick={(e) => handleAccept(l.id, e)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Từ chối"
                                className="h-8 w-8 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 border border-rose-100"
                                onClick={(e) => openDeclineDialog(l.id, e)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CanAccess>
                        </>
                      )}
                      {/* 2. NẾU RFQ ĐÃ TIẾP NHẬN (ACCEPTED) -> CHỈ HIỆN NÚT LẬP BÁO GIÁ */}
                      {l.status?.toLowerCase() === RfqStatus.ACCEPTED.toLowerCase() && (
                        <>
                          <CanAccess roles={['SaleStaff']}>
                            {/* Nút lập báo giá được làm nổi bật hơn thay vì chỉ hiện icon */}
                            <Button
                              variant="outline"
                              size="sm"
                              title="Lập báo giá"
                              className="h-8 text-xs font-medium text-brand-green-600 bg-brand-green-50 border-brand-green-100 hover:bg-brand-green-100 shadow-sm"
                              onClick={(e) => handleCreateQuotation(l.id, e)}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1.5" />
                              Lập báo giá
                            </Button>
                          </CanAccess>
                          <CanAccess roles={['Manager']}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xem chi tiết"
                              className="h-8 w-8 text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/sales/RFQ/${l.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </CanAccess>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RfqDeclineDialog
        isOpen={isDeclineDialogOpen}
        onOpenChange={setIsDeclineDialogOpen}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onConfirm={handleDecline}
      />

      <SaleStaffSelectionDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onSelect={(staff) => {
          if (assigningRfqId) {
            handleAssignStaff(assigningRfqId, staff.id);
            setIsAssignDialogOpen(false);
          }
        }}
      />
    </div>
  );
}
