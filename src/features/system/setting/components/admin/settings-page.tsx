'use client';

import React from 'react';
import { Settings, Building2, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const settingGroups = [
  {
    title: 'Thông tin công ty',
    icon: Building2,
    fields: [
      { label: 'Tên công ty', value: 'Công ty TNHH Axetic', type: 'text' },
      { label: 'Mã số thuế', value: '0123456789', type: 'text' },
      { label: 'Địa chỉ', value: '123 Nguyễn Huệ, Q.1, TP.HCM', type: 'text' },
      { label: 'Email liên hệ', value: 'contact@axetic.vn', type: 'email' },
      { label: 'Số điện thoại', value: '028 1234 5678', type: 'text' },
    ],
  },
  {
    title: 'Thông báo',
    icon: Bell,
    fields: [
      { label: 'Email thông báo đơn hàng mới', value: 'Bật', type: 'toggle' },
      { label: 'Email thông báo hàng sắp hết', value: 'Bật', type: 'toggle' },
      { label: 'SMS thông báo đơn hàng', value: 'Tắt', type: 'toggle' },
      { label: 'Thông báo trình duyệt', value: 'Bật', type: 'toggle' },
    ],
  },
  {
    title: 'Bảo mật',
    icon: Shield,
    fields: [
      { label: 'Xác thực 2 bước', value: 'Đã bật', type: 'toggle' },
      { label: 'Thời gian hết phiên (phút)', value: '60', type: 'text' },
      { label: 'Cho phép đăng nhập từ nhiều thiết bị', value: 'Có', type: 'toggle' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Cài đặt hệ thống</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý cấu hình và thông tin hệ thống</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <Settings className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingGroups.map((group) => (
          <Card key={group.title} className="border-none shadow-sm bg-white rounded-lg">
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-[#2B3674] flex items-center gap-2">
                <group.icon className="w-5 h-5 text-[#4318FF]" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {group.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-[#2B3674] min-w-0 flex-1">
                    {field.label}
                  </label>
                  {field.type === 'toggle' ? (
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${field.value === 'Bật' || field.value === 'Đã bật' || field.value === 'Có' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {field.value}
                    </span>
                  ) : (
                    <span className="text-sm text-[#A3AED0] text-right truncate max-w-[200px]">
                      {field.value}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
