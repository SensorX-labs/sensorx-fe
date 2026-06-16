'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Headset,
  Wrench,
  Building2,
  ArrowRight,
  Clock3,
} from 'lucide-react';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

const contactGroups = [
  {
    icon: Headset,
    title: 'Chăm sóc khách hàng',
    items: ['support@sensorx.vn', '+84 24 3767 8999'],
  },
  {
    icon: Wrench,
    title: 'Hỗ trợ kỹ thuật',
    items: ['+84 24 3767 8999', 'Tiếp nhận trong giờ làm việc'],
  },
  {
    icon: Phone,
    title: 'Hotline',
    items: ['1900 6868', 'Thứ 2 - Thứ 6 · 08:00 - 17:30'],
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/assets/images/banner_4.jpeg"
            alt="Contact SensorX"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.94),rgba(4,47,46,0.88),rgba(12,74,68,0.68))]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-8 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              <Phone className="h-3.5 w-3.5" />
              Liên hệ doanh nghiệp
            </div>

            <h1 className="mt-5 max-w-4xl font-sans text-2xl font-black uppercase tracking-[0.02em] text-white md:text-[2.2rem]">
              Kết nối đúng đầu mối của SensorX
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-200 md:text-sm">
              Thông tin liên hệ được gom gọn theo từng nhóm để doanh nghiệp dễ kết nối và xử lý nhanh hơn.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Mô hình phục vụ', value: 'B2B công nghiệp' },
              { label: 'Kênh chính', value: 'Email · Hotline' },
              { label: 'Trọng tâm', value: 'Báo giá · kỹ thuật' },
              { label: 'Phản hồi', value: 'Đúng đầu mối' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
                  {item.label}
                </div>
                <div className="mt-2 text-xl font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-stone-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]}
            backLink="/"
            backLabel="Về trang chủ"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {contactGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(28,25,23,0.05)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-white">
                <group.icon className="h-5 w-5" />
              </div>

              <h2 className="mt-5 font-sans text-lg font-black uppercase tracking-[0.02em] text-stone-900">
                {group.title}
              </h2>

              <div className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-stone-200 bg-[#f7f4ee] px-4 py-3 text-sm font-semibold text-stone-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-stone-200 bg-white p-8 shadow-[0_12px_40px_rgba(28,25,23,0.05)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
            <Building2 className="h-3.5 w-3.5" />
            Trụ sở
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-4 rounded-[22px] border border-stone-200 bg-[#f7f4ee] p-5">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Địa chỉ
                </div>
                <div className="mt-2 text-base font-black leading-7 text-stone-900">
                  Đường Vòng Xuyến Võ Nguyên Giáp - Bùi Viện, phường Lê Chân, thành phố Hải Phòng
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[22px] border border-stone-200 bg-[#f7f4ee] p-5">
              <Clock3 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Thời gian làm việc
                </div>
                <div className="mt-2 text-base font-black leading-7 text-stone-900">
                  Thứ 2 - Thứ 6 · 08:00 - 17:30
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-emerald-200 bg-[linear-gradient(180deg,#f6fbf7_0%,#eef8f1_100%)] p-8 shadow-[0_12px_40px_rgba(13,148,136,0.08)]">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
            Bắt đầu nhanh
          </div>

          <h3 className="mt-4 font-sans text-2xl font-black uppercase tracking-[0.02em] text-stone-900">
            Chuẩn bị mã hàng hoặc nhu cầu trước khi liên hệ
          </h3>

          <p className="mt-4 text-sm leading-7 text-stone-600">
            Nếu bạn cần báo giá hoặc hỗ trợ chọn thiết bị, hãy xem trước trang giải pháp hoặc danh mục sản phẩm để trao đổi nhanh hơn.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800"
            >
              Xem giải pháp
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-900 transition hover:bg-stone-50"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
