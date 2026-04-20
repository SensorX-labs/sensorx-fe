'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Eye, Check, X, FileText, ShoppingCart, UserCheck, AlertCircle, Bot, UserPlus, Info, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
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
import RequestForQuotationDetail from './request-for-quotation-detail';
import { RFQServices } from '../../services/rfq-services';

import { RfqListItem } from '../../models/rfq-list-response';

const statusStyles: Record<string, string> = {
  'Draft': 'bg-gray-50 text-gray-500 border-gray-200',
  'Pending': 'bg-gray-50 text-blue-600 border-blue-100',
  'Accepted': 'bg-gray-50 text-indigo-600 border-indigo-100',
  'Rejected': 'bg-gray-50 text-red-500 border-red-100',
  'Converted': 'bg-gray-50 text-green-600 border-green-100',
  // Fallback cho enum uppercase
  [RfqStatus.DRAFT]: 'bg-gray-50 text-gray-500 border-gray-200',
  [RfqStatus.PENDING]: 'bg-gray-50 text-blue-600 border-blue-100',
  [RfqStatus.ACCEPTED]: 'bg-gray-50 text-indigo-600 border-indigo-100',
  [RfqStatus.REJECTED]: 'bg-gray-50 text-red-500 border-red-100',
  [RfqStatus.CONVERTED]: 'bg-gray-50 text-green-600 border-green-100',
};

const statusLabels: Record<string, string> = {
  'Draft': 'Nháp',
  'Pending': 'Chờ tiếp nhận',
  'Accepted': 'Đã tiếp nhận',
  'Rejected': 'Đã từ chối',
  'Converted': 'Đã sinh báo giá',
  // Fallback
  [RfqStatus.DRAFT]: 'Nháp',
  [RfqStatus.PENDING]: 'Chờ tiếp nhận',
  [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
  [RfqStatus.REJECTED]: 'Đã từ chối',
  [RfqStatus.CONVERTED]: 'Đã sinh báo giá',
};

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchRfqs = async () => {
    setLoading(true);
    try {
      const rfqService = new RFQServices();
      const result = await rfqService.getListRFQ({ PageIndex: 1, PageSize: 50 });
      setLeads(result.items);
    } catch (error) {
      console.error(">>> Lỗi khi fetch RFQ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!viewDetailId) {
      fetchRfqs();
    }
  }, [viewDetailId]);

  const stats = useMemo(() => [
    { title: 'Chờ xử lý', value: leads.filter(r => r.status === 'Pending').length.toString(), icon: TrendingUp, color: 'text-yellow-500' },
    { title: 'Đã tiếp nhận', value: leads.filter(r => r.status === 'Accepted').length.toString(), icon: TrendingUp, color: 'text-blue-500' },
    { title: 'Đã sinh báo giá', value: leads.filter(r => r.status === 'Converted').length.toString(), icon: TrendingUp, color: 'text-green-500' },
    { title: 'Tổng yêu cầu', value: leads.length.toString(), icon: TrendingUp, color: 'text-[#4318FF]' },
  ], [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.recipientName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleAccept = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
    return (
      <RequestForQuotationDetail 
        id={viewDetailId} 
        onBack={() => setViewDetailId(null)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0]">{s.title}</p>
              </div>
              <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
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
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
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
            {filteredLeads.map((l) => (
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
                  {l.status !== 'Pending' && l.staffId ? (
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      Nhân viên {l.staffId.slice(0, 4)}
                    </span>
                  ) : <span className="">—</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                    statusStyles[l.status]
                  )}>
                    {statusLabels[l.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {l.status === 'Pending' && (
                      <>
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50"
                          onClick={(e) => handleAccept(l.id, e)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={(e) => openDeclineDialog(l.id, e)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {l.status === 'Accepted' && (
                      <Button 
                        variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => handleCreateQuotation(l.id, e)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}

                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewDetailId(l.id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs tracking-widest uppercase">
                  Không tìm thấy dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Decline Reason Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-xl gap-0 p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-2 text-gray-900 uppercase tracking-widest text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Từ chối tiếp nhận RFQ
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <p className="text-[11px] text-gray-500 leading-relaxed">
                * Lý do từ chối sẽ được ghi lại trong lịch sử hệ thống phục vụ mục đích quản lý.
            </p>
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
