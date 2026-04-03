'use client';

import React, { useState } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, Eye, Check, X, FileText, ShoppingCart, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';

const stats = [
  { title: 'Chờ phân bổ', value: '12', icon: AlertCircle, color: 'text-orange-500' },
  { title: 'Đang xử lý', value: '213', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chuyển đổi', value: '445', icon: CheckCircle, color: 'text-green-500' },
  { title: 'Tổng RFQ', value: '842', icon: TrendingUp, color: 'text-[#4318FF]' },
];

const initialLeads = [
  { id: 'RFQ001', name: 'Công ty TNHH Minh Phát', contact: 'Nguyễn Hùng', source: 'Website', value: '45,000,000', items: 5, status: 'Chờ phân bổ' },
  { id: 'RFQ002', name: 'Doanh nghiệp Thiên Long', contact: 'Trần Linh', source: 'Giới thiệu', value: '120,000,000', items: 3, status: 'Đang xử lý', assignee: 'Sale 1' },
  { id: 'RFQ003', name: 'Cty CP Bình Minh', contact: 'Lê Tuấn', source: 'Zalo', value: '78,000,000', items: 8, status: 'Đang xử lý', assignee: 'Sale 2' },
  { id: 'RFQ004', name: 'HTX Phú Thịnh', contact: 'Phạm Hà', source: 'Facebook', value: '32,000,000', items: 2, status: 'Đang xử lý', assignee: 'Sale 1' },
  { id: 'RFQ005', name: 'Cty TNHH Vĩnh Phúc', contact: 'Hoàng Nam', source: 'Email', value: '95,000,000', items: 6, status: 'Đã chuyển đổi', assignee: 'Sale 3' },
];

const statusStyles: Record<string, string> = {
  'Chờ phân bổ': 'bg-orange-100 text-orange-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
  'Đã chuyển đổi': 'bg-green-100 text-green-600',
  'Chờ phân công thủ công': 'bg-red-100 text-red-600',
};

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState(initialLeads);

  const handleAccept = (id: string) => {
    // Luồng BH-04: Tiếp nhận phân bổ
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: 'Đang xử lý', assignee: 'Cá nhân (Bạn)' } : lead
    ));
  };

  const handleDecline = (id: string) => {
    // Luồng BH-04: Từ chối phân bổ (Chuyển sang người tiếp theo hoặc chờ thủ công)
    setLeads(prev => prev.filter(lead => lead.id !== id));
    console.log(`Đã từ chối RFQ ${id}. Hệ thống sẽ ghi log và chuyển cho nhân viên ưu tiên tiếp theo.`);
  };

  const handleCreateQuotation = (id: string) => {
    // Luồng BH-05: Lập báo giá
    console.log(`Chuyển sang trang Lập báo giá cho RFQ: ${id}`);
    // Giả lập sau khi lập báo giá thành công
  };

  const handleCreateOrder = (id: string) => {
    // Chuyển đổi sang đơn hàng thành công
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: 'Đã chuyển đổi' } : lead
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
                <th className="text-left px-6 py-3 admin-table-th">Liên hệ</th>
                <th className="text-left px-6 py-3 admin-table-th text-center">Sản phẩm</th>
                <th className="text-left px-6 py-3 admin-table-th">Giá trị dự kiến</th>
                <th className="text-left px-6 py-3 admin-table-th">Nhân viên xử lý</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
                <th className="text-left px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{l.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">
                    <div>
                      {l.name}
                      <p className="text-[10px] text-gray-400 font-normal">Nguồn: {l.source}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 ">{l.contact}</td>
                  <td className="px-6 py-3 text-center ">{l.items}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{l.value} đ</td>
                  <td className="px-6 py-3 text-gray-600 font-medium">
                    {l.assignee ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        {l.assignee}
                      </div>
                    ) : (
                      <span className="italic text-gray-400 text-xs">Chưa phân bổ</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      statusStyles[l.status] ?? 'bg-gray-100 text-gray-500'
                    )}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      {l.status === 'Chờ phân bổ' && (
                        <>
                          <Button 
                            onClick={() => handleAccept(l.id)}
                            variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Tiếp nhận
                          </Button>
                          <Button 
                            onClick={() => handleDecline(l.id)}
                            variant="ghost" size="sm" className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Từ chối
                          </Button>
                        </>
                      )}

                      {l.status === 'Đang xử lý' && (
                        <>
                          <Button 
                            onClick={() => handleCreateQuotation(l.id)}
                            variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Báo giá
                          </Button>
                          <Button 
                            onClick={() => handleCreateOrder(l.id)}
                            variant="ghost" size="sm" className="h-8 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-1"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Chốt đơn
                          </Button>
                        </>
                      )}

                      {l.status === 'Đã chuyển đổi' && (
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                        </Button>
                      )}
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
