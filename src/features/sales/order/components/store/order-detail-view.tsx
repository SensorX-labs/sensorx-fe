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

const p1 = mockProducts.find(p => p.id === 'prod-001')!;
const p2 = mockProducts.find(p => p.id === 'prod-002')!;

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
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 tracking-breadcrumb group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách đơn hàng
        </button>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-8 py-2.5 border border-gray-900 tracking-label uppercase btn-tracking transition-all hover:bg-gray-900 hover:text-white !text-[10px]">
             <Download className="w-4 h-4" />
             Tải hóa đơn (PDF)
           </button>
        </div>
      </div>

      <div className="bg-white p-10 border border-gray-100">
         <div className="flex justify-between items-start">
            <div className="space-y-4">
               <h1 className="tracking-title-xl">{orderDetail.id}</h1>
               <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <span className="tracking-label uppercase whitespace-nowrap">Ngày đặt hàng: <span className="text-gray-900">{orderDetail.date}</span></span>
                  <span className="tracking-label uppercase whitespace-nowrap">Thanh toán: <span className="text-gray-900">{orderDetail.paymentMethod}</span></span>
                  <span className="tracking-label uppercase">Vận chuyển: <span className="text-gray-900">{orderDetail.shippingMethod}</span></span>
               </div>
            </div>
            <div className={cn("px-6 py-2 border-2 tracking-label uppercase font-bold text-[11px] whitespace-nowrap", config.className)}>
               {config.label}
            </div>
         </div>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="tracking-title uppercase text-lg">Danh sách sản phẩm trong đơn hàng</h3>
            </div>
        </div>
        
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-100 uppercase">
              <th className="px-10 py-5 tracking-label border-r border-gray-50 w-[50%]">Sản phẩm</th>
              <th className="px-4 py-5 tracking-label border-r border-gray-50 text-center w-[10%]">SL</th>
              <th className="px-8 py-5 tracking-label border-r border-gray-50 text-right w-[20%]">Đơn giá</th>
              <th className="px-10 py-5 tracking-label text-right w-[20%] bg-gray-50/30">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.items.map((item, idx) => (
              <tr key={item.id} className={cn("border-b border-gray-50 last:border-0", idx % 2 === 1 && "bg-gray-50/30")}>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 p-2 border border-gray-100 shrink-0">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale" />
                    </div>
                    <div className="space-y-1">
                      <p className="breadcrumb-text uppercase">{item.name}</p>
                      <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase text-[9px] font-bold tracking-widest">{item.sku}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-6 text-center qty-label">{item.qty}</td>
                <td className="px-8 py-6 text-right meta-label font-bold">
                  {(item.price).toLocaleString('vi-VN')}
                </td>
                <td className="px-10 py-6 text-right qty-label bg-gray-50/20 text-base">
                  {(item.price * item.qty).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-10 border-t border-gray-100">
           <div className="w-96 space-y-5">
              <div className="flex justify-between meta-label uppercase">
                <span className="text-gray-400 font-bold">Tạm tính:</span>
                <span className="qty-label">
                  {(orderDetail.subtotal).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between meta-label uppercase">
                <span className="text-gray-400 font-bold">Phí vận chuyển:</span>
                <span className="qty-label">
                  {(orderDetail.shippingFee).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between pt-6 border-t-2 border-gray-900 items-baseline">
                <span className="tracking-label uppercase text-sm">Tổng:</span>
                <span className="tracking-title-xl text-3xl text-brand-green tracking-tighter">
                  {(orderDetail.total).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <h4 className="tracking-label uppercase">Thông tin người nhận</h4>
              </div>
              <div className="space-y-4 pt-2">
                  <div>
                      <p className="breadcrumb-text uppercase text-xl mb-1">{orderDetail.billingInfo.name}</p>
                      {orderDetail.billingInfo.company && (
                          <p className="meta-label uppercase text-[#B48F4E]">
                              {orderDetail.billingInfo.company}
                          </p>
                      )}
                  </div>
                  <div className="space-y-3 pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-300" />
                          <span className="qty-label tracking-widest text-sm">{orderDetail.billingInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-300" />
                          <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">{orderDetail.billingInfo.email}</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white p-10 border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h4 className="tracking-label uppercase">Địa chỉ giao hàng</h4>
              </div>
              <div className="space-y-6 pt-2">
                  <p className="qty-label font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 lowercase first-letter:uppercase">
                      {orderDetail.billingInfo.address}
                  </p>
                  <div className="pt-10 flex flex-col gap-4">
                     <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Xem vị trí trên bản đồ
                     </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
