'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Building, CreditCard } from 'lucide-react';

export interface QuotationFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string;
  address: {
    street: string;
    ward: string;
    district: string;
    province: string;
  };
}

interface QuotationFormProps {
  formData: QuotationFormData;
  onChange: (data: QuotationFormData) => void;
}

export function QuotationForm({ formData, onChange }: QuotationFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      onChange({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="space-y-8 mt-12 border-t border-gray-200 pt-12">
      {/* Thông tin người nhận */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-lg font-medium tracking-wider mb-6 flex items-center gap-2">
          <User size={20} className="text-brand-green" />
          Thông tin người nhận
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block meta-label text-gray-600 mb-2">Họ tên người nhận *</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên người nhận"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block meta-label text-gray-600 mb-2">Email *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block meta-label text-gray-600 mb-2">Số điện thoại *</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin doanh nghiệp */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-lg font-medium tracking-wider mb-6 flex items-center gap-2">
          <Building size={20} className="text-brand-green" />
          Thông tin doanh nghiệp
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block meta-label text-gray-600 mb-2">Tên công ty *</label>
            <div className="relative">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nhập tên công ty"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block meta-label text-gray-600 mb-2">Mã số thuế *</label>
            <div className="relative">
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="Mã số thuế"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Địa chỉ */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-lg font-medium tracking-wider mb-6 flex items-center gap-2">
          <MapPin size={20} className="text-brand-green" />
          Địa chỉ nhận báo giá / giao hàng
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block meta-label text-gray-600 mb-2">Địa chỉ chi tiết *</label>
            <div className="relative">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Số nhà, tên đường"
                className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm pl-10"
                required
              />
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block meta-label text-gray-600 mb-2">Phường / Xã *</label>
            <input
              type="text"
              name="address.ward"
              value={formData.address.ward}
              onChange={handleChange}
              placeholder="Nhập phường/xã"
              className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm"
              required
            />
          </div>
          <div>
            <label className="block meta-label text-gray-600 mb-2">Quận / Huyện *</label>
            <input
              type="text"
              name="address.district"
              value={formData.address.district}
              onChange={handleChange}
              placeholder="Nhập quận/huyện"
              className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block meta-label text-gray-600 mb-2">Tỉnh / Thành phố *</label>
            <input
              type="text"
              name="address.province"
              value={formData.address.province}
              onChange={handleChange}
              placeholder="Nhập tỉnh/thành phố"
              className="w-full px-4 py-3 border border-gray-200 focus:border-brand-green focus:outline-none tracking-wider text-sm"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
