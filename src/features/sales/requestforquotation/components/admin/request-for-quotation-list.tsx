'use client';

import React, { useState } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, Eye, Check, X, FileText, ShoppingCart, UserCheck, AlertCircle, Bot, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { cn } from '@/shared/utils/cn';
import { MOCK_RFQS } from '../../mocks/rfq-mocks';
import { RfqStatus } from '../../constants/rfq-status';

const stats = [
  { title: 'Chờ phân bổ', value: MOCK_RFQS.filter(r => r.status === RfqStatus.PENDING).length.toString(), icon: AlertCircle, color: 'text-orange-500' },
  { title: 'Đang xử lý', value: MOCK_RFQS.filter(r => [RfqStatus.ACCEPTED, RfqStatus.NEGOTIATING, RfqStatus.RESPONDED].includes(r.status)).length.toString(), icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chuyển đổi', value: MOCK_RFQS.filter(r => r.status === RfqStatus.CONVERTED).length.toString(), icon: CheckCircle, color: 'text-green-500' },
  { title: 'Tổng RFQ', value: MOCK_RFQS.length.toString(), icon: TrendingUp, color: 'text-[#4318FF]' },
];

const statusStyles: Record<string, string> = {
  [RfqStatus.DRAFT]: 'bg-gray-100 text-gray-600',
  [RfqStatus.PENDING]: 'bg-orange-100 text-orange-600',
  [RfqStatus.ACCEPTED]: 'bg-blue-100 text-blue-600',
  [RfqStatus.REJECTED]: 'bg-red-100 text-red-600',
  [RfqStatus.NEGOTIATING]: 'bg-yellow-100 text-yellow-600',
  [RfqStatus.RESPONDED]: 'bg-cyan-100 text-cyan-600',
  [RfqStatus.CONVERTED]: 'bg-green-100 text-green-600',
};

const statusLabels: Record<string, string> = {
  [RfqStatus.DRAFT]: 'Nháp',
  [RfqStatus.PENDING]: 'Chờ phân bổ',
  [RfqStatus.ACCEPTED]: 'Đã tiếp nhận',
  [RfqStatus.REJECTED]: 'Đã từ chối',
  [RfqStatus.NEGOTIATING]: 'Thương lượng',
  [RfqStatus.RESPONDED]: 'Đã phản hồi',
  [RfqStatus.CONVERTED]: 'Đã chuyển đổi',
};

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState(MOCK_RFQS);

  const handleAccept = (id: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: RfqStatus.ACCEPTED } : lead
    ));
  };

  const handleDecline = (id: string) => {
    setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, status: RfqStatus.REJECTED } : lead
    ));
  };

  const handleCreateQuotation = (id: string) => {
    console.log(`Chuyển sang trang Lập báo giá cho RFQ: ${id}`);
  };

  const handleCreateOrder = (id: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: RfqStatus.CONVERTED } : lead
    ));
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
              {leads.map((l) => (
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
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Phân bổ nhân viên"
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                <Bot className="w-4 h-4 text-blue-500" />
                                <span>Phân bổ bằng AI</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-purple-500" />
                                <span>Chỉ định thủ công</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button 
                            onClick={() => handleAccept(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Tiếp nhận"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDecline(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Từ chối"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {[RfqStatus.ACCEPTED, RfqStatus.NEGOTIATING].includes(l.status) && (
                        <>
                          <Button 
                            onClick={() => handleCreateQuotation(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Báo giá"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleCreateOrder(l.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            title="Chốt đơn"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
