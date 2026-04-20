'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Building, CreditCard } from 'lucide-react';

export interface QuotationFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string;
  address: string;
}

interface QuotationFormProps {
  formData: QuotationFormData;
  onChange: (data: QuotationFormData) => void;
}

export function QuotationForm({ formData, onChange }: QuotationFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-8 mt-12 border-t border-gray-200 pt-12">
      {/* Thông tin người nhận */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-lg font-bold tracking-wider mb-6 flex items-center gap-2 text-gray-900">
          <User size={20} className="text-brand-green" />
          THÔNG TIN LIÊN HỆ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Họ tên người nhận *</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Số điện thoại *</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại liên lạc"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Email *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin doanh nghiệp & Địa chỉ */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-lg font-bold tracking-wider mb-6 flex items-center gap-2 text-gray-900">
          <Building size={20} className="text-brand-green" />
          THÔNG TIN DOANH NGHIỆP & ĐỊA CHỈ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Tên công ty / Đơn vị *</label>
            <div className="relative">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nhập tên đầy đủ của đơn vị"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Mã số thuế *</label>
            <div className="relative">
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="Mã số thuế doanh nghiệp"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Địa chỉ chi tiết *</label>
            <div className="relative">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange as any}
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none tracking-wider text-sm pl-10 resize-none"
                required
              />
              <MapPin size={16} className="absolute left-3 top-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
