'use client';

import React, { useMemo, useState } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, Eye, Check, X, FileText, ShoppingCart, UserCheck, AlertCircle, Bot, UserPlus, Info, Bell, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/shared/components/shadcn-ui/dialog";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";
import { cn } from '@/shared/utils/cn';
import { MOCK_RFQS } from '../../mocks/rfq-mocks';
import { RfqStatus } from '../../constants/rfq-status';

const stats = [
  { title: 'Chờ xử lý', value: MOCK_RFQS.filter(r => r.status === RfqStatus.PENDING).length.toString(), icon: Bell, color: 'text-blue-500' },
  { title: 'Đã tiếp nhận', value: MOCK_RFQS.filter(r => r.status === RfqStatus.ACCEPTED).length.toString(), icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã sinh báo giá', value: MOCK_RFQS.filter(r => r.status === RfqStatus.CONVERTED).length.toString(), icon: CheckCircle, color: 'text-green-500' },
  { title: 'Tổng yêu cầu', value: MOCK_RFQS.length.toString(), icon: TrendingUp, color: 'text-[#4318FF]' },
];

const statusStyles: Record<string, string> = {
  [RfqStatus.DRAFT]: 'bg-gray-100 text-gray-600 border border-gray-200',
  [RfqStatus.PENDING]: 'bg-blue-50 text-blue-600 border border-blue-100',
  [RfqStatus.ACCEPTED]: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  [RfqStatus.REJECTED]: 'bg-red-50 text-red-600 border border-red-100',
  [RfqStatus.CONVERTED]: 'bg-green-50 text-green-600 border border-green-100',
};

const statusLabels: Record<string, string> = {
  [RfqStatus.DRAFT]: 'Nháp',
  [RfqStatus.PENDING]: 'Chờ tiếp nhận',
  [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
  [RfqStatus.REJECTED]: 'Đã từ chối',
  [RfqStatus.CONVERTED]: 'Đã sinh báo giá',
};

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState(MOCK_RFQS);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.customerInfo.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.customerInfo.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleAccept = (id: string) => {
    // Logic: Kiểm tra trạng thái và cập nhật, gửi thông báo tự động cho khách
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: RfqStatus.ACCEPTED, userId: 'Current Salesman' } : lead
    ));
    // Thông báo thành công: "Đã tiếp nhận yêu cầu. Hệ thống đã gửi email thông báo cho khách hàng."
  };

  const handleDecline = () => {
    if (!selectedRfqId) return;

    // Logic: Ghi nhật ký lý do, chuyển cho nhân viên kế tiếp hoặc quản lý
    setLeads(prev => prev.map(lead => 
        lead.id === selectedRfqId 
        ? { 
            ...lead, 
            status: RfqStatus.REJECTED, 
          } 
        : lead
    ));
    
    setIsDeclineDialogOpen(false);
    setSelectedRfqId(null);
    setDeclineReason('');
    // Hệ thống tự động phân bổ cho người tiếp theo hoặc báo cho manager
  };

  const openDeclineDialog = (id: string) => {
    setSelectedRfqId(id);
    setIsDeclineDialogOpen(true);
  };

  const handleCreateQuotation = (id: string) => {
    console.log(`Chuyển sang trang Lập báo giá cho RFQ: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Tìm kiếm theo mã RFQ, tên công ty hoặc khách hàng..." 
                className="pl-10 text-xs border-gray-200 focus:border-blue-300 focus:ring-blue-100 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-xs h-10 border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <SelectValue placeholder="Trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs text-gray-700">Tất cả trạng thái</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-xs text-gray-700">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || statusFilter !== 'all') && (
              <Button 
                variant="ghost" 
                className="text-[10px] uppercase font-bold text-gray-500 hover:text-blue-600 transition-colors"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Xóa lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Mã RFQ</th>
                <th className="text-left px-6 py-3 admin-table-th">Khách hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Nhân viên xử lý</th>
                <th className="text-left px-6 py-3 admin-table-th text-center">Trạng thái</th>
                <th className="text-left px-6 py-3 admin-table-th text-right pr-10">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{l.code}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">
                    <div>
                      {l.customerInfo.companyName}
                      <p className="text-[10px] text-gray-400 font-normal">LH: {l.customerInfo.recipientName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 font-medium">
                    {![RfqStatus.PENDING, RfqStatus.DRAFT].includes(l.status as RfqStatus) && l.userId && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">ID: {l.userId}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      statusStyles[l.status] ?? 'bg-gray-100 text-gray-500'
                    )}>
                      {statusLabels[l.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2 pr-4">
                      {l.status === RfqStatus.PENDING && (
                        <>
                          <Button 
                            onClick={() => handleAccept(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-2 border-green-200"
                            title="Tiếp nhận ngay"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => openDeclineDialog(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-2 border-red-200"
                            title="Từ chối hỗ trợ"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {l.status === RfqStatus.ACCEPTED && (
                        <>
                          <Button 
                            onClick={() => handleCreateQuotation(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-2 border-blue-200"
                            title="Lập báo giá"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-gray-50 border-2 border-gray-200" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic text-xs">
                    Không tìm thấy yêu cầu nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Decline Reason Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 uppercase tracking-wider text-sm font-bold">
              <AlertCircle className="w-5 h-5" />
              Từ chối tiếp nhận RFQ
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed italic">
                * Lưu ý: Lý do từ chối sẽ được ghi vào nhật ký hệ thống. Sau khi bạn từ chối, yêu cầu sẽ tự động được chuyển sang nhân viên ưu tiên kế tiếp để đảm bảo tiến độ phục vụ khách hàng.
            </p>
            <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-widest">Lý do từ chối hỗ trợ khách hàng</label>
                <Textarea 
                    placeholder="Ví dụ: Đang quá tải đơn hàng, không phải chuyên môn mặt hàng này..." 
                    className="text-xs min-h-[100px] border-gray-200 focus:border-red-300 focus:ring-red-100"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDeclineDialogOpen(false)} className="text-[10px] font-bold uppercase tracking-widest border-2 border-gray-200">Hủy bỏ</Button>
            <Button 
                onClick={handleDecline}
                disabled={!declineReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest px-8"
            >
                Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
