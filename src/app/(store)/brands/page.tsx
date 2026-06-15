'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  Handshake,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

const partnerBrands = [
  {
    name: 'Omron',
    segment: 'Cảm biến và điều khiển',
    summary: 'Đồng hành trong các giải pháp tự động hóa, giám sát dây chuyền và tối ưu độ ổn định vận hành.',
  },
  {
    name: 'Autonics',
    segment: 'Thiết bị điều khiển công nghiệp',
    summary: 'Phối hợp triển khai bộ đếm, timer, cảm biến và các cấu phần điều khiển cho nhà máy sản xuất.',
  },
  {
    name: 'Panasonic',
    segment: 'Tự động hóa nhà máy',
    summary: 'Hỗ trợ các bài toán sản xuất tinh gọn, kiểm soát tín hiệu và tích hợp vận hành công nghiệp.',
  },
  {
    name: 'Schneider Electric',
    segment: 'Điện công nghiệp và năng lượng',
    summary: 'Kết nối năng lực phân phối thiết bị điện, bảo vệ hệ thống và giải pháp tối ưu hiệu suất vận hành.',
  },
  {
    name: 'Keyence',
    segment: 'Vision và đo kiểm chính xác',
    summary: 'Đáp ứng các nhu cầu đo kiểm, nhận diện và tự động hóa đòi hỏi độ chính xác cao.',
  },
  {
    name: 'Honeywell',
    segment: 'An toàn và điều khiển',
    summary: 'Bổ sung các lớp giải pháp an toàn, điều khiển và giám sát trong môi trường công nghiệp chuyên sâu.',
  },
];

const brandProofs = [
  'Danh mục tập trung vào thiết bị cảm biến, điều khiển và tự động hóa cho khách hàng doanh nghiệp.',
  'Tư vấn theo bài toán vận hành thực tế thay vì chỉ dừng ở bán sản phẩm đơn lẻ.',
  'Ưu tiên nguồn hàng rõ xuất xứ, thông tin kỹ thuật minh bạch và khả năng hỗ trợ sau bán hàng.',
  'Phối hợp cùng doanh nghiệp trong các nhu cầu báo giá, thay thế tương đương và chuẩn hóa lựa chọn thiết bị.',
];

const strengths = [
  {
    icon: Handshake,
    title: 'Hợp tác thực chất',
    desc: 'Tập trung vào quan hệ bền vững với nhà cung cấp và khách hàng doanh nghiệp, ưu tiên giá trị vận hành dài hạn.',
  },
  {
    icon: ShieldCheck,
    title: 'Uy tín kỹ thuật',
    desc: 'Thông tin sản phẩm, thông số và tư vấn được định hướng theo nhu cầu ứng dụng thực tế trong môi trường công nghiệp.',
  },
  {
    icon: Globe2,
    title: 'Kết nối thương hiệu quốc tế',
    desc: 'Mở rộng khả năng tiếp cận các thương hiệu quen thuộc trong tự động hóa và điện công nghiệp.',
  },
  {
    icon: Layers3,
    title: 'Năng lực tích hợp',
    desc: 'Có thể hỗ trợ từ khâu chọn thiết bị, báo giá, so sánh phương án đến định hình bộ giải pháp phù hợp.',
  },
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
        <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-200/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-18 md:px-8 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Hệ sinh thái thương hiệu
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-heading text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                Kết nối thương hiệu mạnh để xây dựng năng lực cung ứng đáng tin cậy
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-200 md:text-base">
                SensorX phát triển hình ảnh thương hiệu bằng năng lực tư vấn, sự minh bạch trong lựa chọn thiết bị
                và mạng lưới hợp tác với các doanh nghiệp, nhà sản xuất đã quen thuộc trong lĩnh vực tự động hóa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-emerald-600"
                >
                  Xem sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/14"
                >
                  Liên hệ hợp tác
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Đối tác tiêu biểu', value: '06+' },
                { label: 'Nhóm giải pháp', value: 'Tự động hóa' },
                { label: 'Trọng tâm phục vụ', value: 'B2B công nghiệp' },
                { label: 'Định vị', value: 'Uy tín và chuyên sâu' },
              ].map(item => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
                    {item.label}
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-stone-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Thương hiệu' },
            ]}
            backLink="/"
            backLabel="Về trang chủ"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-emerald-700">
              Đối tác và doanh nghiệp
            </div>
            <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
              Những thương hiệu đang góp phần tạo nên độ tin cậy của SensorX
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {partnerBrands.map((brand, index) => (
            <article
              key={brand.name}
              className="group rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(28,25,23,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(13,148,136,0.12)]"
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
                <p className="mt-4 text-sm leading-7 text-stone-600">{brand.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
              <Award className="h-3.5 w-3.5" />
              Khẳng định thương hiệu
            </div>
            <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
              SensorX không chỉ phân phối, mà còn xây dựng niềm tin bằng cách làm việc rõ ràng và có chiều sâu
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Giá trị thương hiệu của SensorX đến từ cách chúng tôi hiện diện trong quá trình khách hàng ra quyết định:
              hiểu đúng nhu cầu, đưa ra phương án có căn cứ và duy trì chất lượng tư vấn nhất quán trong toàn bộ hành trình hợp tác.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {strengths.map(item => (
                <div key={item.title} className="rounded-3xl bg-[#f7f4ee] p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-black uppercase tracking-wide text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-stone-200 bg-stone-950 p-7 text-white">
            <div className="absolute inset-0 opacity-35">
              <img src="/assets/images/banner_5.jpeg" alt="Industrial brand presence" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.45),rgba(12,10,9,0.92))]" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-200">
                <Factory className="h-3.5 w-3.5" />
                Brand profile
              </div>
              <h3 className="mt-5 max-w-lg font-heading text-3xl font-black uppercase tracking-tight">
                Một thương hiệu B2B nên được nhớ đến bởi hiệu quả hợp tác, không chỉ bởi hình ảnh
              </h3>

              <div className="mt-8 space-y-4">
                {brandProofs.map(item => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6 text-stone-200">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-amber-200/20 bg-amber-300/10 p-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-amber-200" />
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-100">
                    Định hướng thương hiệu
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-100">
                  Trở thành điểm kết nối đáng tin cậy giữa doanh nghiệp Việt Nam và các giải pháp thiết bị công nghiệp chất lượng,
                  với hình ảnh chuyên nghiệp, thực tế và đủ năng lực đồng hành lâu dài.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="rounded-[36px] border border-stone-200 bg-[linear-gradient(135deg,#052e2b,#0f766e)] px-8 py-10 text-white shadow-[0_20px_60px_rgba(15,118,110,0.22)] md:px-12 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-100">
                Hợp tác cùng SensorX
              </div>
              <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight md:text-4xl">
                Nếu bạn muốn xuất hiện cùng một hệ sinh thái thương hiệu đáng tin cậy, đây là điểm bắt đầu
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50/90">
                Chúng tôi sẵn sàng trao đổi về hợp tác phân phối, đồng hành giải pháp hoặc xây dựng hiện diện thương hiệu trong tệp khách hàng công nghiệp.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-900 transition hover:bg-stone-100"
              >
                Gửi đề nghị hợp tác
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
              >
                Khám phá danh mục
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
