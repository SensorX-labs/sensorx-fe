'use client';

import React from 'react';
import { 
  FileText, 
  MapPin, 
  ChevronLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  Phone,
  Mail,
  User,
  ExternalLink,
  MessageSquare,
  XCircle,
  Truck
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';

// Get real products from mock data
const p1 = mockProducts.find(p => p.id === 'prod-003')!;

// Mock Quotation Detail data
const quotationDetail = {
  id: 'RFQ-2024-001',
  date: '20/12/2024 - 10:15',
  status: 'responded',
  validUntil: '30/12/2024',
  subtotal: (p1.priceList?.tiers[0].defaultPrice || 0) * 10,
  tax: 0,
  get total() { return this.subtotal + this.tax; },
  customerInfo: {
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
      qty: 10,
      image: p1.images?.[0]?.imageUrl || 'https://placehold.co/80x80/f3f4f6/374151?text=Product'
    }
  ],
  responses: [
    {
      author: 'Admin System',
      date: '21/12/2024 - 09:00',
      content: 'Chào anh A, chúng tôi đã gửi báo giá chi tiết cho đơn hàng này. Mức giá này đã bao gồm ưu đãi 5% cho khách hàng doanh nghiệp.',
      isStaff: true
    }
  ]
};

const statusConfig: any = {
  pending: {
    label: 'Đang xử lý',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  responded: {
    label: 'Đã báo giá',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  expired: {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  }
};

export function QuotationDetailView({ onBack }: { onBack: () => void }) {
  const config = statusConfig[quotationDetail.status];

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
           {quotationDetail.status === 'responded' && (
             <button 
                className="flex items-center gap-2 px-6 py-2 border border-[#2D5A27] btn-tracking text-[10px] uppercase text-[#2D5A27] transition-all hover:bg-[#2D5A27] hover:text-white"
             >
               <Truck className="w-3.5 h-3.5" />
               Tạo đơn hàng từ báo giá
             </button>
           )}
           <button className="flex items-center gap-2 px-6 py-2 bg-[#1A1C23] btn-tracking text-[10px] uppercase text-white hover:bg-black transition-all">
             <Download className="w-3.5 h-3.5" />
             Tải PDF báo giá
           </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Header Info */}
          <div className="p-8 bg-white border border-gray-100">
             <div className="flex items-start justify-between mb-8">
               <div className="space-y-1">
                 <h2 className="tracking-title-xl !mb-0">{quotationDetail.id}</h2>
                 <p className="meta-label uppercase tracking-widest">Yêu cầu lúc: {quotationDetail.date}</p>
               </div>
               <div className={cn(
                  "px-4 py-1.5 border btn-tracking text-[10px] uppercase flex items-center gap-2",
                  config.className
               )}>
                 <config.icon className="w-3.5 h-3.5" />
                 {config.label}
               </div>
             </div>

             <div className="pt-8 border-t border-gray-50">
               <div className="flex items-center gap-4 meta-label uppercase">
                 <span className="text-gray-400 font-bold">Hiệu lực đến:</span>
                 <span className="text-red-500 font-black">{quotationDetail.validUntil}</span>
               </div>
             </div>
          </div>

          {/* Product Items */}
          <div className="bg-white border border-gray-100">
             <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="tracking-label uppercase text-gray-900 flex items-center gap-2 !text-xs !font-black">
                   <FileText className="w-4 h-4" />
                   Danh sách sản phẩm yêu cầu
                </h3>
             </div>
             <table className="w-full">
               <tbody>
                  {quotationDetail.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-b-0">
                      <td className="p-6 w-[100px]">
                        <div className="w-20 h-20 bg-gray-100 p-2 border border-gray-100">
                           <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale" />
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="meta-label uppercase tracking-widest !text-[10px] mb-1">{item.sku}</p>
                        <p className="text-sm font-bold text-gray-900 tracking-tight mb-2">{item.name}</p>
                        <div className="flex items-center gap-4">
                           <span className="qty-label uppercase">Số lượng: <span className="text-gray-900">{item.qty}</span></span>
                        </div>
                      </td>
                      <td className="p-6 text-right align-top">
                        <p className="meta-label uppercase tracking-widest !text-[10px] mb-1">Giá báo</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>

          {/* Communication / Feedback */}
          <div className="space-y-4">
             <h3 className="tracking-label uppercase text-gray-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Phản hồi từ hệ thống
             </h3>
             {quotationDetail.responses.map((resp, idx) => (
               <div key={idx} className="p-6 bg-white border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <span className="text-xs font-bold text-gray-900 uppercase tracking-widest underline decoration-2 decoration-[var(--brand-green)] underline-offset-4">{resp.author}</span>
                     <span className="meta-label !text-[10px] text-gray-400 font-bold">{resp.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{resp.content}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Summary Card */}
           <div className="p-8 bg-[#1A1C23] text-white space-y-6">
              <h3 className="tracking-label !text-white opacity-50 uppercase !text-[10px]">Ước tính báo giá</h3>
              <div className="space-y-4">
                 <div className="flex justify-between meta-label !text-gray-400 uppercase">
                   <span>Tạm tính</span>
                   <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quotationDetail.subtotal)}</span>
                 </div>
                 <div className="flex justify-between meta-label !text-gray-400 uppercase">
                   <span>Thuế VAT</span>
                   <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quotationDetail.tax)}</span>
                 </div>
                 <div className="pt-4 border-t border-gray-700 flex justify-between items-end">
                   <span className="tracking-label !text-white opacity-50 uppercase !text-[10px]">Thành tiền</span>
                   <span className="text-xl font-black text-[#B48F4E]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quotationDetail.total)}
                   </span>
                 </div>
              </div>
           </div>

           {/* Client Profile Card */}
           <div className="p-8 bg-white border border-gray-100 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 tracking-label uppercase text-[#B48F4E]">
                  <User className="w-3.5 h-3.5" />
                  Thông tin khách hàng
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-bold text-gray-900 tracking-tight uppercase underline decoration-2 underline-offset-4 decoration-gray-900">{quotationDetail.customerInfo.name}</p>
                   {quotationDetail.customerInfo.company && (
                     <p className="meta-label uppercase font-bold tracking-tight">{quotationDetail.customerInfo.company}</p>
                   )}
                   <div className="flex items-center gap-2 meta-label !text-gray-500 font-medium pt-2">
                      <Phone className="w-3 h-3" />
                      {quotationDetail.customerInfo.phone}
                   </div>
                   <div className="flex items-center gap-2 meta-label !text-gray-500 font-medium">
                      <Mail className="w-3 h-3" />
                      {quotationDetail.customerInfo.email}
                   </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-2 tracking-label uppercase text-[#B48F4E]">
                  <MapPin className="w-3.5 h-3.5" />
                  Địa chỉ khảo sát/giao hàng
                </div>
                <p className="text-xs text-gray-900 font-bold leading-relaxed tracking-tight">{quotationDetail.customerInfo.address}</p>
              </div>

              <div className="pt-8 space-y-4">
                 <button className="w-full py-3 border border-gray-900 btn-tracking text-[10px] uppercase text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                    Chỉnh sửa yêu cầu
                 </button>
                 <button className="w-full py-3 bg-red-600 btn-tracking text-[10px] uppercase text-white hover:bg-red-700 transition-all">
                    Hủy yêu cầu RFQ
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
