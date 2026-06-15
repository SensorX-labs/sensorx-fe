'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Handshake,
  ShieldCheck,
  Sparkles,
  Globe2,
  Layers3,
} from 'lucide-react';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

const partnerBrands = [
  { name: 'Omron', segment: 'Cảm biến và điều khiển', summary: 'Phù hợp cho giám sát tín hiệu, phát hiện vị trí và tự động hóa dây chuyền.' },
  { name: 'Autonics', segment: 'Thiết bị điều khiển công nghiệp', summary: 'Mạnh ở bộ đếm, timer, cảm biến và các cấu phần điều khiển cho nhà máy.' },
  { name: 'Panasonic', segment: 'Tự động hóa nhà máy', summary: 'Hỗ trợ các bài toán vận hành ổn định, đồng bộ tín hiệu và tối ưu năng suất.' },
  { name: 'Schneider Electric', segment: 'Điện công nghiệp và năng lượng', summary: 'Tập trung vào phân phối điện, bảo vệ hệ thống và quản lý năng lượng.' },
  { name: 'Keyence', segment: 'Vision và đo kiểm chính xác', summary: 'Đáp ứng nhu cầu đo kiểm, nhận diện và kiểm soát chất lượng đầu ra.' },
  { name: 'Honeywell', segment: 'An toàn và điều khiển', summary: 'Phù hợp cho các lớp an toàn, giám sát và điều khiển trong công nghiệp.' },
];

const strengths = [
  { icon: Handshake, title: 'Hợp tác thực chất', desc: 'Tập trung vào quan hệ bền vững với khách hàng doanh nghiệp và nhà cung cấp.' },
  { icon: ShieldCheck, title: 'Uy tín kỹ thuật', desc: 'Thông tin sản phẩm và tư vấn được định hướng theo nhu cầu ứng dụng thực tế.' },
  { icon: Globe2, title: 'Thương hiệu quốc tế', desc: 'Mở rộng khả năng tiếp cận các thương hiệu quen thuộc trong tự động hóa.' },
  { icon: Layers3, title: 'Năng lực tích hợp', desc: 'Hỗ trợ chọn thiết bị, so sánh phương án và định hình giải pháp phù hợp.' },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/assets/images/banner_6.jpeg"
            alt="Brand partnerships"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.92),rgba(4,47,46,0.88),rgba(12,74,68,0.7))]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Thương hiệu
          </div>

          <div className="mt-2 grid gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-heading text-3xl font-black uppercase tracking-tight text-white md:text-[2.15rem]">
                Kết nối các thương hiệu SensorX đang làm việc cùng
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-stone-200">
                SensorX làm việc cùng các thương hiệu quen thuộc trong tự động hóa, cảm biến và điện công nghiệp.
              </p>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-stone-200">
                Danh sách bên dưới giúp bạn nhìn nhanh đối tác chính và phạm vi ứng dụng tiêu biểu.
              </p>

              <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-emerald-600"
                >
                  Xem sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/8 px-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/14"
                >
                  Liên hệ
                </Link>
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                { label: 'Đối tác', value: '06+' },
                { label: 'Phạm vi', value: 'B2B công nghiệp' },
                { label: 'Nhóm chính', value: 'Cảm biến · điều khiển' },
                { label: 'Mục tiêu', value: 'Rõ đầu mối' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-3 backdrop-blur">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">{item.label}</div>
                  <div className="mt-1.5 text-[1.05rem] font-black text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-stone-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Thương hiệu' }]}
            backLink="/"
            backLabel="Về trang chủ"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-emerald-700">
              Đối tác và doanh nghiệp
            </div>
            <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
              Những thương hiệu làm nên độ tin cậy của SensorX
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Mỗi thương hiệu dưới đây đang đại diện cho một nhóm thiết bị hoặc thế mạnh ứng dụng mà SensorX có thể phối hợp trong tư vấn và báo giá.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {partnerBrands.map((brand, index) => (
            <article
              key={brand.name}
              className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(28,25,23,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(13,148,136,0.12)]"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-sm font-black text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="mt-6">
                <h3 className="font-heading text-2xl font-black text-stone-900">{brand.name}</h3>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700">
                  {brand.segment}
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-600">{brand.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
              <Building2 className="h-3.5 w-3.5" />
              Khẳng định thương hiệu
            </div>
            <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
              SensorX làm việc theo hướng rõ ràng và có chiều sâu
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Trang thương hiệu không chỉ để liệt kê tên hãng. Mục tiêu là giúp khách hàng nhận ra nhóm sản phẩm, thế mạnh ứng dụng và mức độ phù hợp với bài toán của họ.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((item) => (
              <div key={item.title} className="rounded-3xl bg-[#f7f4ee] p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-black uppercase tracking-wide text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="rounded-[30px] border border-stone-200 bg-[linear-gradient(180deg,#f6fbf7_0%,#eef8f1_100%)] p-8 shadow-[0_12px_40px_rgba(13,148,136,0.08)]">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
            Kết nối nhanh
          </div>
          <h3 className="mt-4 font-heading text-2xl font-black uppercase tracking-tight text-stone-900">
            Nếu cần báo giá, hãy vào shop hoặc liên hệ trực tiếp
          </h3>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800"
            >
              Xem sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-900 transition hover:bg-stone-50"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
