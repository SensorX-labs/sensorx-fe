'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Boxes,
  Cable,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cpu,
  Eye,
  Factory,
  Gauge,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

const solutions = [
  {
    icon: Eye,
    title: 'Giải pháp cảm biến giám sát',
    summary:
      'Ứng dụng cảm biến quang, tiệm cận, áp suất, nhiệt độ và đo mức để giám sát trạng thái máy móc, vị trí và chất lượng đầu ra.',
    useCases: ['Kiểm tra hiện diện sản phẩm', 'Đếm sản lượng', 'Phát hiện lỗi vị trí'],
  },
  {
    icon: Bot,
    title: 'Giải pháp tự động hóa dây chuyền',
    summary:
      'Hỗ trợ doanh nghiệp xây dựng hệ thống điều khiển, liên kết tín hiệu và tối ưu thao tác vận hành trên dây chuyền sản xuất.',
    useCases: ['Đồng bộ tín hiệu thiết bị', 'Giảm thao tác thủ công', 'Ổn định chu kỳ vận hành'],
  },
  {
    icon: ShieldCheck,
    title: 'Giải pháp an toàn công nghiệp',
    summary:
      'Bổ sung các lớp bảo vệ cho khu vực máy móc, vùng làm việc và quy trình vận hành có rủi ro cao.',
    useCases: ['Bảo vệ khu vực thao tác', 'Cảnh báo nguy cơ', 'Tăng độ an toàn sản xuất'],
  },
  {
    icon: Boxes,
    title: 'Giải pháp kho vận và logistics',
    summary:
      'Tối ưu nhận diện hàng hóa, luồng di chuyển và kiểm soát trạng thái tồn kho trong môi trường kho và phân phối.',
    useCases: ['Theo dõi hàng ra vào', 'Kiểm soát vị trí lưu trữ', 'Tăng tốc xử lý đơn'],
  },
  {
    icon: Gauge,
    title: 'Giải pháp đo kiểm và tối ưu chất lượng',
    summary:
      'Tập trung vào các điểm đo kiểm cần độ ổn định cao để giúp doanh nghiệp giảm sai số và kiểm soát chất lượng tốt hơn.',
    useCases: ['Đo kiểm theo tiêu chuẩn', 'Giảm lỗi lặp lại', 'Tăng độ tin cậy đầu ra'],
  },
  {
    icon: Cable,
    title: 'Giải pháp tích hợp thiết bị',
    summary:
      'Kết nối nhiều nhóm thiết bị trong cùng một bài toán triển khai để doanh nghiệp có phương án đồng bộ và dễ vận hành hơn.',
    useCases: ['Đồng bộ nhiều thiết bị', 'Chuẩn hóa lựa chọn', 'Mở rộng hệ thống dễ hơn'],
  },
];

const industries = [
  {
    title: 'Nhà máy sản xuất',
    desc: 'Tăng độ ổn định dây chuyền, kiểm soát tín hiệu và giảm sai lệch trong quá trình sản xuất liên tục.',
  },
  {
    title: 'Kho vận và phân phối',
    desc: 'Tăng khả năng nhận diện, theo dõi luồng hàng và kiểm soát vận hành trong kho.',
  },
  {
    title: 'Điện tử và lắp ráp',
    desc: 'Phù hợp với các bài toán cần phát hiện chính xác, phản hồi nhanh và độ ổn định cao.',
  },
  {
    title: 'Điện công nghiệp và tủ điều khiển',
    desc: 'Phù hợp với nhu cầu lựa chọn cảm biến, thiết bị điều khiển và các cấu phần phục vụ hệ thống điện công nghiệp.',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Tiếp nhận bài toán',
    desc: 'Xác định rõ môi trường vận hành, mục tiêu triển khai và các điểm nghẽn doanh nghiệp đang gặp.',
  },
  {
    step: '02',
    title: 'Đề xuất phương án',
    desc: 'Gợi ý nhóm thiết bị và cấu hình giải pháp phù hợp với nhu cầu thực tế thay vì tư vấn dàn trải.',
  },
  {
    step: '03',
    title: 'Báo giá và chuẩn hóa',
    desc: 'Hỗ trợ doanh nghiệp chuẩn hóa lựa chọn, so sánh phương án và xây dựng danh mục phù hợp ngân sách.',
  },
  {
    step: '04',
    title: 'Đồng hành triển khai',
    desc: 'Tiếp tục hỗ trợ trong giai đoạn phối hợp kỹ thuật, thay thế tương đương và mở rộng hệ thống nếu cần.',
  },
];

const outcomes = [
  'Doanh nghiệp có một nơi tập trung để tìm thiết bị và định hình giải pháp theo bài toán thực tế.',
  'Rút ngắn thời gian tìm kiếm, hỏi báo giá và chuẩn hóa lựa chọn sản phẩm giữa nhiều thương hiệu.',
  'Tăng mức độ tin cậy trong quá trình mua sắm B2B nhờ thông tin rõ ràng và định hướng tư vấn có trọng tâm.',
  'Giúp đội kỹ thuật, thu mua và vận hành phối hợp dễ hơn khi cùng làm việc trên một nhu cầu triển khai.',
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-900">
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/assets/images/banner_2.jpeg"
            alt="Solutions for businesses"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.94),rgba(4,47,46,0.88),rgba(21,128,61,0.48))]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-18 md:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              <Cpu className="h-3.5 w-3.5" />
              Giải pháp cho doanh nghiệp
            </div>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Đưa giải pháp cảm biến và tự động hóa của SensorX đến nhiều doanh nghiệp hơn
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-200 md:text-base">
              Không chỉ là nơi bán thiết bị, website của bạn có thể được nhìn như một điểm tiếp cận giải pháp:
              giúp doanh nghiệp hiểu họ cần gì, chọn phương án nào và bắt đầu triển khai nhanh hơn.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-emerald-600"
              >
                Tư vấn giải pháp
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/14"
              >
                Xem danh mục thiết bị
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Mô hình phục vụ', value: 'B2B công nghiệp' },
              { label: 'Trọng tâm', value: 'Giải pháp + thiết bị' },
              { label: 'Nhóm khách hàng', value: 'Kỹ thuật / mua hàng / vận hành' },
              { label: 'Mục tiêu', value: 'Tăng chuyển đổi doanh nghiệp' },
            ].map(item => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">{item.label}</div>
                <div className="mt-3 text-2xl font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-stone-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Giải pháp' },
            ]}
            backLink="/"
            backLabel="Về trang chủ"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-emerald-700">Nhóm giải pháp</div>
          <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
            Những gì doanh nghiệp có thể tìm thấy trên website của bạn
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Trang này nên giúp khách hàng doanh nghiệp nhanh chóng nhận ra SensorX giải quyết được bài toán nào,
            phù hợp với lĩnh vực nào và có thể đồng hành đến mức nào trong quá trình triển khai.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map(item => (
            <article
              key={item.title}
              className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(28,25,23,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(13,148,136,0.12)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-black text-stone-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.summary}</p>
              <div className="mt-5 space-y-2">
                {item.useCases.map(useCase => (
                  <div key={useCase} className="flex items-center gap-2 text-sm text-stone-700">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
                <Factory className="h-3.5 w-3.5" />
                Ngành phù hợp
              </div>
              <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight text-stone-900 md:text-4xl">
                Website nên nói chuyện trực tiếp với từng nhóm doanh nghiệp mục tiêu
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                Khi khách hàng nhìn thấy đúng ngữ cảnh ngành nghề của họ, khả năng tin tưởng và để lại nhu cầu sẽ cao hơn đáng kể.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {industries.map(item => (
                <div key={item.title} className="rounded-3xl bg-[#f6f3ed] p-5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white">
                      <Truck className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wide text-stone-900">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="rounded-[32px] border border-stone-200 bg-stone-950 p-7 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-200">
              <ClipboardList className="h-3.5 w-3.5" />
              Quy trình tiếp cận
            </div>
            <div className="mt-6 space-y-4">
              {workflow.map(item => (
                <div key={item.step} className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-black text-emerald-300">{item.step}</div>
                    <h3 className="text-base font-black uppercase tracking-wide">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
              <BarChart3 className="h-3.5 w-3.5" />
              Giá trị mang lại
            </div>
            <div className="mt-6 space-y-4">
              {outcomes.map(item => (
                <div key={item} className="flex items-start gap-3 rounded-3xl border border-stone-200 bg-white p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-7 text-stone-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[#f6f3ed] p-6">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
                <Wrench className="h-3.5 w-3.5" />
                Gợi ý chuyển đổi
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                Từ trang này, bạn có thể dẫn doanh nghiệp đến các hành động rõ ràng như xem danh mục thiết bị, gửi yêu cầu tư vấn,
                hoặc để lại nhu cầu báo giá theo từng nhóm giải pháp cụ thể.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
              >
                Bắt đầu trao đổi giải pháp
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8">
        <div className="rounded-[36px] border border-stone-200 bg-[linear-gradient(135deg,#052e2b,#0f766e)] px-8 py-10 text-white shadow-[0_20px_60px_rgba(15,118,110,0.22)] md:px-12 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-100">Kết nối doanh nghiệp</div>
              <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight md:text-4xl">
                Nếu doanh nghiệp của bạn đang tìm một hướng triển khai phù hợp, SensorX có thể là điểm bắt đầu
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50/90">
                Chúng tôi sẵn sàng trao đổi về bài toán vận hành, nhóm thiết bị phù hợp và cách xây dựng phương án triển khai sát nhu cầu thực tế.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-900 transition hover:bg-stone-100"
              >
                Nhận tư vấn
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
              >
                Xem thiết bị
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
