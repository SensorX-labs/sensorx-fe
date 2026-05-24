'use client';

import React, { useState } from 'react';
import {
  ArrowLeft, Check, X, FileText, User,
  ShoppingCart, ClipboardList,
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from 'sonner';
import QuotationForm from '../../../quotation/components/admin/quotation-form';
import Link from 'next/link';
import { AdminRFQService, RfqDetail } from '../../services/admin-rfq.service';
import { RfqStatus, statusLabels, statusStyles } from '../../constants/rfq-status';

import { SaleStaffSelectionDialog } from '@/shared/components/admin/selection-modal';
import { CanAccess } from '@/shared/components/common/can-access';
import { RfqDeclineDialog } from './rfq-decline-dialog';

interface RequestForQuotationDetailProps {
  id: string;
  onBack: () => void;
}

export default function RequestForQuotationDetail({ id, onBack }: RequestForQuotationDetailProps) {
  const [rfq, setRfq] = React.useState<RfqDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isCreatingQuotation, setIsCreatingQuotation] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  // Assign staff states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningRfqId, setAssigningRfqId] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);

  // Decline states
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await AdminRFQService.getDetailRFQ(id);
      if (response) {
        setRfq(response);
      }
    } catch (error) {
      console.error(">>> Lỗi khi fetch detail RFQ:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [id]);

  const handleAcceptDetail = async () => {
    try {
      await AdminRFQService.acceptRFQ(id);
      toast.success("Đã tiếp nhận yêu cầu thành công");
      loadData();
    } catch (error: any) {
      console.error(">>> Lỗi khi tiếp nhận RFQ:", error);
      toast.error("Đã xảy ra lỗi khi tiếp nhận yêu cầu");
    }
  };

  const handleRejectRFQ = async () => {
    if (!declineReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await AdminRFQService.rejectRFQ(id, declineReason);
      toast.success("Đã từ chối xử lý RFQ thành công");
      setIsDeclineDialogOpen(false);
      setDeclineReason('');
      loadData();
    } catch (error: any) {
      console.error(">>> Lỗi khi từ chối RFQ:", error);
      toast.error("Đã xảy ra lỗi khi thao tác");
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
      loadData();
    } catch (error: any) {
      console.error(">>> Lỗi khi chỉ định nhân viên:", error);
      toast.error("Đã xảy ra lỗi khi chỉ định nhân viên");
    } finally {
      setAssignLoading(false);
    }
  };

  const handlePrepareQuotation = () => {
    setIsCreatingQuotation(true);
  };

  if (loading) return <div className="p-6 text-blue-600 animate-pulse">Đang tải dữ liệu...</div>;
  if (!rfq) return <div className="p-6 text-gray-600">Không tìm thấy yêu cầu báo giá</div>;

  if (isCreatingQuotation && rfq) {
    return (
      <QuotationForm
        rfqData={rfq}
        onBack={() => setIsCreatingQuotation(false)}
      />
    );
  }

  return (
    <div className="space-y-6 w-full">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold admin-title uppercase">
              Chi tiết yêu cầu báo giá
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CanAccess roles={["SaleStaff"]}>
            {rfq.status === 'Pending' && (
              <>
                <Button
                  onClick={handleAcceptDetail}
                  variant="outline"
                  className="rounded admin-btn-primary border-transparent"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Tiếp nhận
                </Button>
                <Button
                  onClick={() => setIsDeclineDialogOpen(true)}
                  variant="outline"
                  className="rounded text-red-600 hover:bg-red-50 border-red-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Từ chối
                </Button>
              </>
            )}
            {rfq.status === RfqStatus.ACCEPTED && (
              <Button
                onClick={handlePrepareQuotation}
                variant="outline"
                className="h-9 px-4 text-sm font-medium text-brand-green-600 bg-brand-green-50 border-brand-green-100 hover:bg-brand-green-100 rounded shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Lập báo giá
              </Button>
            )}
          </CanAccess>
          <Link href="/sales/RFQ">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <CanAccess roles={['Manager']}>
        <div className="flex space-x-6 border-b border-gray-200 mt-2">
          <button
            className={`py-2.5 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin yêu cầu
          </button>
          <button
            className={`py-2.5 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('history')}
          >
            Lịch sử phân bổ AI
          </button>
        </div>
      </CanAccess>

      {/* Tabbable Content */}
      {/* We use a wrapper to handle Staff view (which doesn't have CanAccess for Manager, so it always sees 'info') */}
      <div className={activeTab === 'history' ? 'hidden' : 'block'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-1 space-y-6">

            {/* Thông tin chung */}
            <div className="border border-gray-200 bg-white rounded">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã yêu cầu</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{rfq.code}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusStyles[rfq.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {statusLabels[rfq.status] || rfq.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Ngày tạo</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {new Date(rfq.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Nhân viên xử lý</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {rfq.staffName ? (
                        <span>{rfq.staffName}</span>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <CanAccess roles={['Manager']}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-none w-max"
                              onClick={() => {
                                setAssigningRfqId(id);
                                setIsAssignDialogOpen(true);
                              }}
                              disabled={assignLoading}
                            >
                              Chỉ định nhân viên
                            </Button>
                          </CanAccess>
                          <CanAccess roles={['SaleStaff']}>
                            <span className="text-gray-400 italic text-xs">Chưa gán nhân viên</span>
                          </CanAccess>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Thông tin khách hàng */}
            <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-900">Thông tin khách hàng</h4>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Tên công ty</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{rfq.companyName || 'Chưa cập nhật'}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Mã số thuế</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{rfq.taxCode || 'Chưa cập nhật'}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Số điện thoại</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{rfq.phone || 'Chưa cập nhật'}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Email chính</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{rfq.email}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ ĐKKD</td>
                    <td className="px-6 py-3 font-medium text-gray-900 text-xs leading-relaxed">{rfq.address || 'Chưa cập nhật'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">

            {/* Danh sách hàng hóa */}
            <div className="border border-gray-200 bg-white rounded">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <h4 className="text-base font-medium text-gray-900">Danh mục hàng hóa yêu cầu</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <tr>
                      <th className="px-6 py-3 font-medium text-left w-12">STT</th>
                      <th className="px-6 py-3 font-medium text-left">Sản phẩm yêu cầu</th>
                      <th className="px-6 py-3 font-medium text-center w-36">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rfq.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3 text-gray-400 text-xs">{index + 1}</td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Mã: {item.productCode}</div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm text-gray-900 font-medium">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ghi chú
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Ghi chú</h4>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 italic">Không có ghi chú.</p>
            </div>
          </div> */}
          </div>
        </div>
      </div>

      {activeTab === 'history' && (
        <CanAccess roles={['Manager']}>
          <div className="space-y-6">
            {!rfq.allocationLogs || rfq.allocationLogs.length === 0 ? (
              <div className="bg-white p-8 text-center text-gray-500 border border-gray-200 rounded">
                Không có lịch sử phân bổ nào.
              </div>
            ) : (
              rfq.allocationLogs.sort((a, b) => b.round - a.round).map((log, index) => {
                let snapshots: any[] = [];
                try {
                  snapshots = JSON.parse(log.snapshotJson);
                } catch { }

                return (
                  <div key={index} className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                      <div className="font-semibold text-gray-900">
                        Vòng phân bổ {log.round}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.assignedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-3 font-medium">Xếp hạng</th>
                            <th className="px-6 py-3 font-medium">Nhân viên</th>
                            <th className="px-6 py-3 font-medium text-right">Kỹ năng (Skill)</th>
                            <th className="px-6 py-3 font-medium text-right">Khối lượng (Workload)</th>
                            <th className="px-6 py-3 font-medium text-right">Giờ rảnh (Idle Hours)</th>
                            <th className="px-6 py-3 font-medium text-right text-indigo-600">Tổng điểm (Final)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {snapshots.map((s: any, sIdx: number) => {
                            const isWinner = sIdx === 0;
                            // Kiểm tra xem ông winner này có từ chối không
                            const rejectedLog = isWinner && rfq.rejectedLogs
                              ? rfq.rejectedLogs.find(r => r.staffId === s.StaffId)
                              : null;

                            return (
                              <React.Fragment key={sIdx}>
                                <tr className={isWinner ? "bg-indigo-50/20" : ""}>
                                  <td className="px-6 py-3 font-medium text-gray-500">
                                    #{sIdx + 1}
                                  </td>
                                  <td className="px-6 py-3 font-medium text-gray-900">
                                    {s.StaffName || `Nhân viên ${s.StaffId.slice(0, 4)}`}
                                    {isWinner && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                                        Winner
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-3 text-right font-mono text-xs text-gray-600">{s.AggregatedSkillScore?.toFixed(4)}</td>
                                  <td className="px-6 py-3 text-right font-mono text-xs text-gray-600">{s.CurrentWorkload?.toFixed(4)}</td>
                                  <td className="px-6 py-3 text-right font-mono text-xs text-gray-600">{s.IdleHours?.toFixed(4)}</td>
                                  <td className="px-6 py-3 text-right font-mono font-bold text-indigo-600">{s.FinalScore?.toFixed(4)}</td>
                                </tr>
                                {rejectedLog && (
                                  <tr className="bg-red-50/50">
                                    <td colSpan={6} className="px-6 py-2.5 text-xs text-red-600">
                                      <div className="flex items-start gap-2">
                                        <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span>
                                          <strong>Đã từ chối xử lý</strong> vào lúc {new Date(rejectedLog.rejectedAt).toLocaleString('vi-VN')}
                                          {rejectedLog.reason && (
                                            <span className="block mt-0.5 text-red-500">
                                              Lý do: <i>{rejectedLog.reason}</i>
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CanAccess>
      )}

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

      <RfqDeclineDialog
        isOpen={isDeclineDialogOpen}
        onOpenChange={setIsDeclineDialogOpen}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onConfirm={handleRejectRFQ}
      />
    </div>
  );
}