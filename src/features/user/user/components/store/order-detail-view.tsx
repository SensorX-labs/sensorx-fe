'use client';

import React from 'react';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  ChevronLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  FileText,
  Phone,
  Mail,
  User,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';

// Get real products from mock data
const p1 = mockProducts.find(p => p.id === 'prod-001')!;
const p2 = mockProducts.find(p => p.id === 'prod-002')!;

// Mock Order Detail data
const orderDetail = {
  id: 'ORD-001',
  date: '15/12/2024 - 14:30',
  status: 'completed',
  paymentMethod: 'Chuyển khoản ngân hàng',
  shippingMethod: 'Giao hàng tiêu chuẩn (Giao Hàng Nhanh)',
  subtotal: (p1.priceList?.tiers[0].defaultPrice || 0) * 2 + (p2.priceList?.tiers[0].defaultPrice || 0),
  shippingFee: 150000,
  get total() { return this.subtotal + this.shippingFee; },
  billingInfo: {
    name: 'Nguyễn Văn A',
    phone: '0912 345 678',
    email: 'nguyenvanа@email.com',
    company: 'Công Ty TNHH SensorX',
    address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh'
  },
  items: [
    {
      id: p1.id,
      name: p1.name,
      sku: p1.code,
      price: p1.priceList?.tiers[0].defaultPrice || 0,
      qty: 2,
      image: p1.images?.[0]?.imageUrl || 'https://placehold.co/80x80/f3f4f6/374151?text=Product'
    },
    {
      id: p2.id,
      name: p2.name,
      sku: p2.code,
      price: p2.priceList?.tiers[0].defaultPrice || 0,
      qty: 1,
      image: p2.images?.[0]?.imageUrl || 'https://placehold.co/80x80/f3f4f6/374151?text=Product'
    }
  ]
};

const statusConfig: any = {
  pending: {
    label: 'Đang xử lý',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  completed: {
    label: 'Đã giao hàng',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  }
};

export function OrderDetailView({ onBack }: { onBack: () => void }) {
  const config = statusConfig[orderDetail.status];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Buttons */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 tracking-label text-gray-400 hover:text-gray-900 transition-colors uppercase"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-2 border border-[#2D5A27] btn-tracking text-[10px] uppercase text-[#2D5A27] transition-all hover:bg-[#2D5A27] hover:text-white">
             <Download className="w-3.5 h-3.5" />
             Tải hóa đơn
           </button>
           <button className="flex items-center gap-2 px-6 py-2 bg-[#1A1C23] btn-tracking text-[10px] uppercase text-white hover:bg-black transition-all">
             <FileText className="w-3.5 h-3.5" />
             Hỗ trợ/Khiếu nại
           </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Order Header Info */}
          <div className="p-8 bg-white border border-gray-100">
             <div className="flex items-start justify-between mb-8">
               <div className="space-y-1">
                 <h2 className="tracking-title-xl !mb-0">{orderDetail.id}</h2>
                 <p className="meta-label uppercase tracking-widest">Ngày đặt: {orderDetail.date}</p>
               </div>
               <div className={cn(
                  "px-4 py-1.5 border btn-tracking text-[10px] uppercase flex items-center gap-2",
                  config.className
               )}>
                 <config.icon className="w-3.5 h-3.5" />
                 {config.label}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 tracking-label uppercase text-gray-400">
                     <Truck className="w-3.5 h-3.5" />
                     Vận chuyển
                  </div>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{orderDetail.shippingMethod}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 tracking-label uppercase text-gray-400">
                     <CreditCard className="w-3.5 h-3.5" />
                     Thanh toán
                  </div>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{orderDetail.paymentMethod}</p>
                </div>
             </div>
          </div>

          {/* Product Items */}
          <div className="bg-white border border-gray-100">
             <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="tracking-label uppercase text-gray-900 flex items-center gap-2 !text-xs !font-black">
                   <Package className="w-4 h-4" />
                   Sản phẩm đặt hàng ({orderDetail.items.length})
                </h3>
             </div>
             <table className="w-full">
               <tbody>
                  {orderDetail.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/30 transition-colors">
                      <td className="p-6 w-[100px]">
                        <div className="w-20 h-20 bg-gray-100 p-2 border border-gray-100">
                           <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale" />
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="meta-label uppercase tracking-widest !text-[10px] mb-1">{item.sku}</p>
                        <p className="text-sm font-bold text-gray-900 tracking-tight mb-2">{item.name}</p>
                        <div className="flex items-center gap-4">
                           <span className="qty-label uppercase">SL: <span className="text-gray-900">{item.qty}</span></span>
                           <span className="qty-label text-[var(--brand-green)] uppercase">Sẵn hàng</span>
                        </div>
                      </td>
                      <td className="p-6 text-right align-top">
                        <p className="meta-label uppercase tracking-widest !text-[10px] mb-1">Đơn giá</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Price Summary */}
           <div className="p-8 bg-[#1A1C23] text-white space-y-6">
              <h3 className="tracking-label !text-white opacity-50 uppercase !text-[10px]">Tóm tắt chi phí</h3>
              <div className="space-y-4">
                 <div className="flex justify-between meta-label !text-gray-400 uppercase">
                   <span>Tạm tính</span>
                   <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.subtotal)}</span>
                 </div>
                 <div className="flex justify-between meta-label !text-gray-400 uppercase">
                   <span>Phí vận chuyển</span>
                   <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.shippingFee)}</span>
                 </div>
                 <div className="pt-4 border-t border-gray-700 flex justify-between items-end">
                   <span className="tracking-label !text-white opacity-50 uppercase !text-[10px]">Tổng cộng</span>
                   <span className="text-xl font-black text-[#B48F4E]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.total)}
                   </span>
                 </div>
              </div>
           </div>

           {/* Customer/Shipping Info */}
           <div className="p-8 bg-white border border-gray-100 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B48F4E]">
                  <User className="w-3.5 h-3.5" />
                  Người nhận
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-bold text-gray-900 tracking-tight uppercase underline decoration-2 underline-offset-4 decoration-gray-900">{orderDetail.billingInfo.name}</p>
                   <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Phone className="w-3 h-3" />
                      {orderDetail.billingInfo.phone}
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Mail className="w-3 h-3" />
                      {orderDetail.billingInfo.email}
                   </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B48F4E]">
                  <MapPin className="w-3.5 h-3.5" />
                  Địa chỉ giao hàng
                </div>
                <p className="text-xs text-gray-900 font-bold leading-relaxed tracking-tight">{orderDetail.billingInfo.address}</p>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                 <button className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 flex items-center justify-center gap-2 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Bản đồ vị trí
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
