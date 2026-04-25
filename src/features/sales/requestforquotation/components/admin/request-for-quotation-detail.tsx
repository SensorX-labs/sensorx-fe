'use client';

import React, { useState } from 'react';
import {
  ArrowLeft, Check, X, FileText, User, Building2,
  Mail, Phone, MapPin, Calendar, ShoppingCart,
  AlertCircle, ClipboardList, MessageSquare
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn-ui/popover';
import { Search, ChevronsUpDown, Check as CheckIcon } from 'lucide-react';
import { Input } from '@/shared/components/shadcn-ui/input';
import { RfqStatus } from '../../constants/rfq-status';
import { useUser } from '@/shared/hooks/use-user';
import { toast } from 'sonner';
import QuotationCreate from '../../../quotation/components/admin/quotation-create';
import Link from 'next/link';
import { RfqDetail } from '../../models/rfq-detail-response';
import { RFQServices } from '../../services/rfq-services';
import { StaffService } from '@/features/user/staff/services/staff-service';
import { StaffListItem } from '@/features/user/staff/models/staff-list-response';
import { cn } from '@/shared/utils/cn';

interface RequestForQuotationDetailProps {
  id: string;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  'Draft': 'bg-gray-50 text-gray-500 border-gray-200',
  'Pending': 'bg-blue-50 text-blue-700 border-blue-200',
  'Accepted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
  'Converted': 'bg-green-50 text-green-700 border-green-200',
  // Fallback
  [RfqStatus.DRAFT]: 'bg-gray-50 text-gray-500 border-gray-200',
  [RfqStatus.PENDING]: 'bg-blue-50 text-blue-700 border-blue-200',
  [RfqStatus.ACCEPTED]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [RfqStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-200',
  [RfqStatus.CONVERTED]: 'bg-green-50 text-green-700 border-green-200',
};

const statusLabel: Record<string, string> = {
  'Draft': 'Nháp',
  'Pending': 'Đang chờ',
  'Accepted': 'Đã tiếp nhận',
  'Rejected': 'Đã từ chối',
  'Converted': 'Đã chốt đơn',
  // Fallback
  [RfqStatus.DRAFT]: 'Nháp',
  [RfqStatus.PENDING]: 'Đang chờ',
  [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
  [RfqStatus.REJECTED]: 'Đã từ chối',
  [RfqStatus.CONVERTED]: 'Đã chốt đơn',
};

export default function RequestForQuotationDetail({ id, onBack }: RequestForQuotationDetailProps) {
  const [rfq, setRfq] = React.useState<RfqDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isCreatingQuotation, setIsCreatingQuotation] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState<any | null>(null);
  const { user } = useUser();

  React.useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const rfqService = new RFQServices();
        const data = await rfqService.getDetailRFQ(id);
        setRfq(data);

        if (data.staffId) {
          try {
            const staffService = new StaffService();
            const staffData = await staffService.getStaffById(data.staffId) as any;
            setAssignedStaff(staffData);
          } catch (err) {
            console.error(">>> Lỗi khi fetch thông tin nhân viên:", err);
          }
        }
      } catch (error) {
        console.error(">>> Lỗi khi fetch detail RFQ:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id]);

  const handleAcceptDetail = async () => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    try {
      const staffService = new StaffService();
      const rfqService = new RFQServices();
      
      const staffData = await staffService.getStaffByAccountId(user.id) as any;
      if (!staffData || !staffData.staffId) {
        toast.error("Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên");
        return;
      }

      const success = await rfqService.assignStaff(id, staffData.staffId);
      if (success) {
        toast.success("Tiếp nhận yêu cầu thành công");
        // Reload dữ liệu
        const updatedRfq = await rfqService.getDetailRFQ(id);
        setRfq(updatedRfq);
        setAssignedStaff(staffData);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tiếp nhận yêu cầu");
    }
  };


  if (loading) return <div className="p-6 text-blue-600 animate-pulse">Đang tải dữ liệu...</div>;
  if (!rfq) return <div className="p-6 text-gray-600">Không tìm thấy yêu cầu báo giá</div>;

  if (isCreatingQuotation && rfq) {
    return (
      <QuotationCreate
        rfqId={id}
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
              <Button variant="outline" className="rounded text-red-600 hover:bg-red-50 border-red-200">
                <X className="w-4 h-4 mr-2" />
                Từ chối
              </Button>
            </>
          )}
          {rfq.status === 'Accepted' && (
            <Button
              onClick={() => setIsCreatingQuotation(true)}
              variant="outline"
              className="rounded admin-btn-primary border-transparent"
            >
              <FileText className="w-4 h-4 mr-2" />
              Lập báo giá
            </Button>
          )}
          <Link href="/sales/requestforquotation">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

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
                    <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusColor[rfq.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {statusLabel[rfq.status] || rfq.status}
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
                    {assignedStaff ? (
                      <span>{assignedStaff.staffName}</span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Chưa gán nhân viên</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Thông tin khách hàng */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {rfq.companyName}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người liên hệ</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{rfq.recipientName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Mã số thuế</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{rfq.taxCode}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {rfq.recipientPhone}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {rfq.email}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-start gap-2">
                    {rfq.address}
                  </td>
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

          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Ghi chú</h4>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 italic">Không có ghi chú.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}